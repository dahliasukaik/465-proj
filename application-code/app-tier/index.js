const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;


// Middleware - Put this before your route definitions
app.use(cors()); // Allows cross-origin requests, useful if frontend and backend are on different ports
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(bodyParser.json()); // Parses JSON request body


// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type'] // Allowed headers
}));

// Health Check Route
app.get('/health', (req, res) => {
    res.json({ message: "Health check successful!" });
});

app.post('/transaction', async (req, res) => {
    console.log('Received POST request to /transaction');
    try {
        const { amount, desc } = req.body;
        console.log(`Amount: ${amount}, Description: ${desc}`);

        // Ensure 'amount' is treated as a number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            return res.status(400).json({ message: 'Invalid amount, must be a number' });
        }

        // Call the addTransaction service
        const success = await transactionService.addTransaction(parsedAmount, desc);

        // Log the success value
        console.log('Transaction add success status:', success);

        if (success === 200) {
            res.status(200).json({ message: 'Transaction added successfully' });
        } else {
            res.status(400).json({ message: 'Failed to add transaction' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
});



app.get('/transaction', async (req, res) => {
    try {
        console.log('Fetching all transactions...');
        const transactionList = await transactionService.getAllTransactions();
        console.log('Transactions retrieved:', transactionList);

        if (!Array.isArray(transactionList)) {
            return res.status(500).json({ message: 'Invalid data received', error: 'Data is not an array' });
        }

        const result = transactionList.map(row => ({
            id: row.id,
            amount: row.amount,
            description: row.description,
        }));

        res.status(200).json({ result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Could not retrieve transactions', error: err.message });
    }
});



// Delete All Transactions
app.delete('/transaction', async (req, res) => {
    try {
        await transactionService.deleteAllTransactions();
        res.status(200).json({ message: 'All transactions deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete all transactions', error: err.message });
    }
});

// Delete One Transaction
app.delete('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionService.deleteTransactionById(id);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Transaction with id ${id} deleted successfully` });
        } else {
            res.status(404).json({ message: `Transaction with id ${id} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting transaction', error: err.message });
    }
});

// Get Single Transaction
app.get('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionService.findTransactionById(id);

        if (result && result.length > 0) {
            const { id, amount, description } = result[0];
            res.status(200).json({ id, amount, description });
        } else {
            res.status(404).json({ message: `Transaction with id ${id} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving transaction', error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`AB3 backend app listening at http://localhost:${port}`);
});
