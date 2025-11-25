-- Таблица пилотов
CREATE TABLE IF NOT EXISTS pilots (
    pid VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rating INTEGER DEFAULT 0,
    completed_flights INTEGER DEFAULT 0,
    failed_flights INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица администраторов
CREATE TABLE IF NOT EXISTS admins (
    pid VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ивентов
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    banner VARCHAR(10) DEFAULT '✈️',
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рейсов
CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    flight_number VARCHAR(50) NOT NULL,
    flight_type VARCHAR(20) NOT NULL CHECK (flight_type IN ('arrival', 'departure')),
    flight_time TIME NOT NULL,
    aircraft VARCHAR(50),
    aircraft_type VARCHAR(20) CHECK (aircraft_type IN ('plane', 'helicopter')),
    route VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    booked_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка главного админа
INSERT INTO admins (pid, first_name, last_name, password, is_super_admin)
VALUES ('1437139', 'Главный', 'Админ', '12345', true)
ON CONFLICT (pid) DO NOTHING;

-- Вставка тестовых пилотов
INSERT INTO pilots (pid, first_name, last_name, password, rating, completed_flights, failed_flights)
VALUES 
    ('1234567', 'Иван', 'Петров', 'pilot123', 75, 8, 1),
    ('7654321', 'Мария', 'Сидорова', 'pilot456', 30, 3, 0)
ON CONFLICT (pid) DO NOTHING;

-- Вставка тестовых ивентов
INSERT INTO events (name, event_date, start_time, end_time, description, banner, created_by)
VALUES 
    ('Полёт в Сочи', '2025-12-01', '12:00', '18:00', 'Массовый вылет в Сочи', '✈️', '1437139'),
    ('Вертолётная миссия', '2025-12-05', '09:00', '12:00', 'Тренировочные полёты на вертолётах', '🚁', '1437139')
ON CONFLICT DO NOTHING;

-- Вставка тестовых рейсов (используем подзапрос для получения event_id)
INSERT INTO flights (event_id, flight_number, flight_type, flight_time, aircraft, aircraft_type, route, description, status)
SELECT e.id, 'AFL123', 'departure', '12:30', 'A320', 'plane', 'USSS-URSS', 'Регулярный рейс', 'pending'
FROM events e WHERE e.name = 'Полёт в Сочи'
ON CONFLICT DO NOTHING;

INSERT INTO flights (event_id, flight_number, flight_type, flight_time, aircraft, aircraft_type, route, description, status)
SELECT e.id, 'AFL456', 'arrival', '15:00', 'B737', 'plane', 'UUEE-USSS', 'Без особенностей', 'pending'
FROM events e WHERE e.name = 'Полёт в Сочи'
ON CONFLICT DO NOTHING;

INSERT INTO flights (event_id, flight_number, flight_type, flight_time, aircraft, aircraft_type, route, description, status)
SELECT e.id, 'HEL001', 'departure', '09:30', 'Mi-8', 'helicopter', 'USSS-местность', 'Патрулирование', 'pending'
FROM events e WHERE e.name = 'Вертолётная миссия'
ON CONFLICT DO NOTHING;
