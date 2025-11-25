'''
Business: Управление ивентами и рейсами
Args: event с httpMethod (GET для списка, POST для создания)
Returns: HTTP response со списком ивентов или результатом операции
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute("""
            SELECT id, name, event_date, start_time, end_time, description, banner
            FROM events
            ORDER BY event_date, start_time
        """)
        
        events = []
        for row in cur.fetchall():
            event_id = row[0]
            
            cur.execute("""
                SELECT id, flight_number, flight_type, flight_time, aircraft, 
                       aircraft_type, route, description, status, booked_by
                FROM flights
                WHERE event_id = %s
                ORDER BY flight_time
            """, (event_id,))
            
            flights = []
            for f in cur.fetchall():
                flights.append({
                    'id': str(f[0]),
                    'flightNumber': f[1],
                    'type': f[2],
                    'time': str(f[3]),
                    'aircraft': f[4] or '',
                    'aircraftType': f[5],
                    'route': f[6] or '',
                    'description': f[7] or 'Без особенностей',
                    'status': f[8],
                    'bookedBy': f[9]
                })
            
            events.append({
                'id': str(row[0]),
                'name': row[1],
                'date': str(row[2]),
                'startTime': str(row[3]),
                'endTime': str(row[4]),
                'description': row[5],
                'banner': row[6],
                'flights': flights
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'events': events})
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        cur.execute("""
            INSERT INTO events (name, event_date, start_time, end_time, description, banner, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            body_data.get('name'),
            body_data.get('date'),
            body_data.get('startTime'),
            body_data.get('endTime'),
            body_data.get('description'),
            body_data.get('banner', '✈️'),
            body_data.get('createdBy')
        ))
        
        event_id = cur.fetchone()[0]
        
        for flight in body_data.get('flights', []):
            cur.execute("""
                INSERT INTO flights (event_id, flight_number, flight_type, flight_time, 
                                   aircraft, aircraft_type, route, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                event_id,
                flight.get('flightNumber'),
                flight.get('type'),
                flight.get('time'),
                flight.get('aircraft'),
                flight.get('aircraftType'),
                flight.get('route'),
                flight.get('description')
            ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'eventId': event_id})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
