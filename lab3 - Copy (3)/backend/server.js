const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to SQLite3 database
let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the users database.');
});

// Enable CORS (if needed)
const cors = require('cors');
app.use(cors());

// Use body-parser middleware to parse request bodies
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Define a route to get user data
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Route to get a user by name
app.get('/api/users/:name', (req, res) => {
    const sql = 'SELECT * FROM users WHERE name = ?';
    const params = [req.params.name];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Route to insert a new user
app.post('/api/users', (req, res) => {
    const { name, email, phone, password, sessions} = req.body;
    const sql = 'INSERT INTO users (name, email, phone, password, sessions) VALUES (?, ?, ?, ?, ?)';
    const params = [name, email, phone, password, sessions];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id: this.lastID, name, email, phone, password, sessions }
        });
    });
});

// Route to update a user
app.put('/api/users/:name', (req, res) => {
    const { sessions } = req.body;
    const sql = 'UPDATE users SET sessions = ? WHERE name = ?';
    const params = [sessions, req.params.name];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { name: req.params.name, sessions }
        });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Close the database connection when the server stops
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
