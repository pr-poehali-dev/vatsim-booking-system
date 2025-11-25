'''
Business: Бронирование и управление рейсами
Args: event с httpMethod (POST для бронирования/отмены)
Returns: HTTP response с результатом операции
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
    action = body_data.get('action')
    flight_id = body_data.get('flightId')
    pilot_pid = body_data.get('pilotPid')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if action == 'book':
        cur.execute(
            "UPDATE flights SET booked_by = %s WHERE id = %s AND booked_by IS NULL",
            (pilot_pid, flight_id)
        )
        
        if cur.rowcount == 0:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Flight already booked'})
            }
        
        conn.commit()
        result = {'success': True, 'message': 'Flight booked successfully'}
    
    elif action == 'cancel':
        cur.execute(
            "UPDATE flights SET booked_by = NULL WHERE id = %s AND booked_by = %s",
            (flight_id, pilot_pid)
        )
        
        if cur.rowcount == 0:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Cannot cancel booking'})
            }
        
        conn.commit()
        result = {'success': True, 'message': 'Booking cancelled'}
    
    elif action == 'complete':
        cur.execute(
            "UPDATE flights SET status = 'completed' WHERE id = %s",
            (flight_id,)
        )
        
        cur.execute(
            "SELECT booked_by FROM flights WHERE id = %s",
            (flight_id,)
        )
        pilot = cur.fetchone()
        
        if pilot and pilot[0]:
            cur.execute(
                "UPDATE pilots SET completed_flights = completed_flights + 1, rating = rating + 5 WHERE pid = %s",
                (pilot[0],)
            )
        
        conn.commit()
        result = {'success': True, 'message': 'Flight completed'}
    
    elif action == 'fail':
        cur.execute(
            "UPDATE flights SET status = 'failed' WHERE id = %s",
            (flight_id,)
        )
        
        cur.execute(
            "SELECT booked_by FROM flights WHERE id = %s",
            (flight_id,)
        )
        pilot = cur.fetchone()
        
        if pilot and pilot[0]:
            cur.execute(
                "UPDATE pilots SET failed_flights = failed_flights + 1, rating = rating - 3 WHERE pid = %s",
                (pilot[0],)
            )
        
        conn.commit()
        result = {'success': True, 'message': 'Flight marked as failed'}
    
    else:
        result = {'success': False, 'error': 'Invalid action'}
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200 if result.get('success') else 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(result)
    }
