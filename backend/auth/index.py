'''
Business: Аутентификация пилотов и администраторов
Args: event с httpMethod, body с данными для входа
Returns: HTTP response с данными пользователя или ошибкой
'''
import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_type = body_data.get('type')
    pid = body_data.get('pid')
    password = body_data.get('password')
    
    if not all([user_type, pid, password]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if user_type == 'pilot':
        cur.execute(
            "SELECT pid, first_name, last_name, rating, completed_flights, failed_flights FROM pilots WHERE pid = %s AND password = %s",
            (pid, password)
        )
        row = cur.fetchone()
        
        if row:
            result = {
                'success': True,
                'user': {
                    'pid': row[0],
                    'firstName': row[1],
                    'lastName': row[2],
                    'rating': row[3],
                    'completedFlights': row[4],
                    'failedFlights': row[5]
                }
            }
        else:
            result = {'success': False, 'error': 'Invalid credentials'}
    
    elif user_type == 'admin':
        cur.execute(
            "SELECT pid, first_name, last_name, is_super_admin FROM admins WHERE pid = %s AND password = %s",
            (pid, password)
        )
        row = cur.fetchone()
        
        if row:
            result = {
                'success': True,
                'user': {
                    'pid': row[0],
                    'firstName': row[1],
                    'lastName': row[2],
                    'isSuperAdmin': row[3]
                }
            }
        else:
            result = {'success': False, 'error': 'Invalid credentials'}
    else:
        result = {'success': False, 'error': 'Invalid user type'}
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200 if result.get('success') else 401,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(result)
    }
