CREATE TABLE IF NOT EXISTS pilots (
    pid VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rating INTEGER DEFAULT 0,
    completed_flights INTEGER DEFAULT 0,
    failed_flights INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    pid VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    banner VARCHAR(10) DEFAULT '✈️',
    created_by VARCHAR(20) REFERENCES admins(pid),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    flight_number VARCHAR(20) NOT NULL,
    flight_type VARCHAR(20) CHECK (flight_type IN ('arrival', 'departure')),
    flight_time TIME NOT NULL,
    aircraft VARCHAR(50),
    aircraft_type VARCHAR(20) CHECK (aircraft_type IN ('plane', 'helicopter')),
    route VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    booked_by VARCHAR(20) REFERENCES pilots(pid),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_requests (
    id SERIAL PRIMARY KEY,
    pid VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (pid, first_name, last_name, password, is_super_admin) 
VALUES ('1437139', 'Главный', 'Админ', '12345', TRUE)
ON CONFLICT (pid) DO NOTHING;

INSERT INTO pilots (pid, first_name, last_name, password, rating, completed_flights, failed_flights)
VALUES 
    ('1234567', 'Иван', 'Петров', 'pilot123', 75, 8, 1),
    ('7654321', 'Мария', 'Сидорова', 'pilot456', 30, 3, 0)
ON CONFLICT (pid) DO NOTHING;