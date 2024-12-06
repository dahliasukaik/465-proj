const mysql = require('mysql2/promise');
const dbcreds = require('./DbConfig.js'); // Path to your DbConfig.js file

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: dbcreds.DB_HOST,
            user: dbcreds.DB_USER,
            password: dbcreds.DB_PWD,
            database: dbcreds.DB_DATABASE,
        });

        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('Database connection successful. Query result:', rows);

        await connection.end(); // Close the connection
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

testConnection();
