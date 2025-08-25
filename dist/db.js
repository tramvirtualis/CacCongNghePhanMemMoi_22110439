import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// First, create a connection without specifying database to create it if it doesn't exist
const createDatabaseConnection = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
    });
    try {
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "heroes_db"}`);
        console.log("✅ Database created/verified successfully");
    }
    catch (error) {
        console.error("❌ Error creating database:", error);
    }
    finally {
        await connection.end();
    }
};
// Create the main connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "heroes_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Initialize database and create tables
const initializeDatabase = async () => {
    try {
        await createDatabaseConnection();
        // Create users table if it doesn't exist
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        age INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
        await pool.execute(createTableQuery);
        console.log("✅ Users table created/verified successfully");
        // Check if table is empty and insert sample data
        const [rows] = await pool.query("SELECT COUNT(*) as count FROM users");
        if (rows[0].count === 0) {
            const insertQuery = `
        INSERT INTO users (name, email, age) VALUES 
        ('John Doe', 'john.doe@example.com', 28),
        ('Jane Smith', 'jane.smith@example.com', 32),
        ('Mike Johnson', 'mike.johnson@example.com', 25)
      `;
            await pool.execute(insertQuery);
            console.log("✅ Sample data inserted successfully");
        }
    }
    catch (error) {
        console.error("❌ Error initializing database:", error);
    }
};
// Initialize database on startup
initializeDatabase();
export default pool;
