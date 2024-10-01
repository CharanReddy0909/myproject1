const bcrypt = require('bcrypt');
const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  // Store the hash in the database
});

try {
    // Sign up logic
  } catch (error) {
    console.error("Error creating user:", error);
  }
  
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // You can choose any available port

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // Database host
    user: 'root', // Your MySQL username
    password: 'Dmx_1729', // Your MySQL password
    database: 'nodejs' // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Routes
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error executing query: ' + err);
            return res.status(500).send('Error creating user');
        }
        res.status(201).send('User created successfully.');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?';

    db.query(sql, [username, username, password], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err);
            return res.status(500).send('Error logging in');
        }
        if (results.length > 0) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid credentials.');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


