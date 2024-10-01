const express = require('express');
const cors = require('cors'); // Import the cors module
const bcrypt = require('bcryptjs'); // Use bcryptjs for password hashing
const bodyParser = require('body-parser');
const mysql = require('mysql2'); // Using mysql2 for better compatibility

const app = express();
const port = 3001; // Changed port to avoid conflicts

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update with your actual username
    password: 'Dmx_1729', // Update with your actual password
    database: 'myappdb'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is empty
    if (!username || !password) {
        console.error('Username or password is missing');
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check password length (minimum 6 characters for security)
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error during password hashing' });
        }

        // Store the user in the database
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

        // Debug: Log the query and data being inserted
        console.log(`Executing query: ${query}, with values: ${username}, ${hash}`);

        db.query(query, [username, hash], (err, result) => {
            if (err) {
                console.error('Error saving user to database:', err);

                // Handle duplicate username error
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Username already exists' });
                }

                // Log the entire error for debugging
                console.error('MySQL error details:', err);
                return res.status(500).json({ message: 'Internal server error during user registration', error: err });
            }

            console.log('User registered successfully', result);
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Route to login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Retrieve the user from the database
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user from database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            res.status(200).json({ message: 'Login successful' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
