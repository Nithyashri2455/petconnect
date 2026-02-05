import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('⚠️  Make sure MySQL server is running');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('⚠️  Check your database credentials');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('⚠️  Database does not exist. Run: npm run init-db');
        }
    } else {
        console.log('✅ Database connected successfully');
        connection.release();
    }
});

export default promisePool;
