-- Pathology Lab Database Schema (PostgreSQL)

CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE employee_role AS ENUM ('PHLEBOTOMIST', 'RECEPTIONIST', 'ADMIN');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE collection_type AS ENUM ('HOME', 'LAB');
CREATE TYPE test_type AS ENUM ('INDIVIDUAL', 'PACKAGE');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    role user_role DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role employee_role NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    city VARCHAR(50),
    pincode VARCHAR(20),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8)
);

CREATE TABLE catalog_tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    type test_type DEFAULT 'INDIVIDUAL',
    category VARCHAR(100) DEFAULT 'General',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    patient_id INT REFERENCES patients(id),
    status booking_status DEFAULT 'PENDING',
    collection_type collection_type NOT NULL,
    address_id INT REFERENCES user_addresses(id), -- Null if LAB visit
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    home_visit_fee DECIMAL(10,2) DEFAULT 0.00,
    cancellation_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, REFUNDED
    payment_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mapping table for Booking <-> Tests (Many-to-Many)
CREATE TABLE booking_tests (
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    test_id INT REFERENCES catalog_tests(id),
    price_at_booking DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (booking_id, test_id)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    phlebotomist_id INT REFERENCES employees(id), -- Null until allocated
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    actual_arrival_time TIMESTAMP,
    otp_verified BOOLEAN DEFAULT FALSE,
    delay_penalty_amount DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    local_file_path TEXT NOT NULL,
    uploaded_by INT REFERENCES employees(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scorecards & Leaves (For Phase 2, but good to have schema ready)
CREATE TABLE scorecards (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    month INT NOT NULL,
    year INT NOT NULL,
    total_appointments INT DEFAULT 0,
    total_delay_minutes INT DEFAULT 0,
    total_penalties_deducted DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL,
    UNIQUE(employee_id, month, year)
);

CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
