-- Create database
CREATE DATABASE IF NOT EXISTS heroes_db;
USE heroes_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, age) VALUES 
    ('John Doe', 'john.doe@example.com', 28),
    ('Jane Smith', 'jane.smith@example.com', 32),
    ('Mike Johnson', 'mike.johnson@example.com', 25),
    ('Sarah Wilson', 'sarah.wilson@example.com', 29),
    ('David Brown', 'david.brown@example.com', 35);
