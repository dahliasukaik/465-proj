const dbcreds = require('./DbConfig');
const mysql = require('mysql2');
const winston = require('winston');

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Add console logging for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbcreds.DB_HOST,
    user: dbcreds.DB_USER,
    password: dbcreds.DB_PWD,
    database: dbcreds.DB_DATABASE,
    connectTimeout: 10000, // Ensure a valid timeout option is used
    waitForConnections: true,
    queueLimit: 0,
});

// Test database connection immediately
pool.getConnection((err, connection) => {
    if (err) {
        logger.error('Error connecting to the database', err);
        process.exit(1); // Exit the process if the database connection fails
    } else {
        logger.info('Successfully connected to the database');
        connection.release();
    }
});

// Function to retrieve all transactions
function getAllTransactions() {
    return new Promise((resolve, reject) => {
        logger.info('Attempting to retrieve all transactions');
        const query = 'SELECT * FROM `transactions`';

        pool.query(query, (err, result) => {
            if (err) {
                logger.error('Database query error:', err);
                reject({ message: 'Could not retrieve transactions', error: err.message });
                return;
            }

            if (result.length === 0) {
                logger.warn('No transactions found');
                resolve([]); // Return an empty array instead of rejecting
                return;
            }

            logger.info(`Successfully retrieved ${result.length} transactions`);
            resolve(result);
        });
    });
}

// Function to add a transaction
function addTransaction(amount, desc) {
    return new Promise((resolve, reject) => {
        logger.info(`Attempting to add transaction: amount=${amount}, desc=${desc}`);
        const query = 'INSERT INTO `transactions` (`amount`, `description`) VALUES (?, ?)';

        pool.query(query, [amount, desc], (err, result) => {
            if (err) {
                logger.error('Error adding transaction:', err);
                reject({ message: 'Failed to add transaction', error: err.message });
                return;
            }

            logger.info('Transaction added successfully');
            resolve(result.insertId); // Return the ID of the inserted transaction
        });
    });
}

// Function to delete all transactions
function deleteAllTransactions() {
    return new Promise((resolve, reject) => {
        logger.info('Attempting to delete all transactions');
        const query = 'DELETE FROM `transactions`';

        pool.query(query, (err, result) => {
            if (err) {
                logger.error('Error deleting all transactions:', err);
                reject({ message: 'Failed to delete transactions', error: err.message });
                return;
            }

            logger.info('All transactions deleted successfully');
            resolve(result.affectedRows); // Return the number of deleted rows
        });
    });
}

// Function to delete a transaction by ID
function deleteTransactionById(id) {
    return new Promise((resolve, reject) => {
        logger.info(`Attempting to delete transaction with ID: ${id}`);
        const query = 'DELETE FROM `transactions` WHERE `id` = ?';

        pool.query(query, [id], (err, result) => {
            if (err) {
                logger.error(`Error deleting transaction ${id}:`, err);
                reject({ message: 'Failed to delete transaction', error: err.message });
                return;
            }

            if (result.affectedRows === 0) {
                logger.warn(`Transaction with ID ${id} not found`);
                reject({ message: `Transaction with ID ${id} not found` });
                return;
            }

            logger.info(`Transaction ${id} deleted successfully`);
            resolve(result.affectedRows); // Return the number of deleted rows
        });
    });
}

// Function to find a transaction by ID
function findTransactionById(id) {
    return new Promise((resolve, reject) => {
        logger.info(`Attempting to find transaction with ID: ${id}`);
        const query = 'SELECT * FROM `transactions` WHERE `id` = ?';

        pool.query(query, [id], (err, result) => {
            if (err) {
                logger.error(`Error finding transaction ${id}:`, err);
                reject({ message: 'Failed to find transaction', error: err.message });
                return;
            }

            if (result.length === 0) {
                logger.warn(`Transaction with ID ${id} not found`);
                reject({ message: `Transaction with ID ${id} not found` });
                return;
            }

            logger.info(`Transaction ${id} found`);
            resolve(result[0]); // Return the found transaction
        });
    });
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteAllTransactions,
    findTransactionById,
    deleteTransactionById,
};
