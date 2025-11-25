'''
Business: Получение рейтинга пилотов
Args: event с httpMethod GET
Returns: HTTP response со списком пилотов и их рейтингом
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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT pid, first_name, last_name, rating, completed_flights, failed_flights
        FROM pilots
        ORDER BY rating DESC
    """)
    
    pilots = []
    for row in cur.fetchall():
        pilots.append({
            'pid': row[0],
            'firstName': row[1],
            'lastName': row[2],
            'rating': row[3],
            'completedFlights': row[4],
            'failedFlights': row[5]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'pilots': pilots})
    }
