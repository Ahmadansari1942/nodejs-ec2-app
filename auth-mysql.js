// routes/auth.js - MySQL Version
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { 
        title: 'Login',
        error: null
    });
});

// Register page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('register', { 
        title: 'Register',
        error: null
    });
});

// Login POST
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in database
        const sql = 'SELECT * FROM users WHERE email = ?';
        const users = await db.query(sql, [email]);

        if (users.length === 0) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password'
            });
        }

        // Create session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login',
            error: 'An error occurred. Please try again.'
        });
    }
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.render('register', {
                title: 'Register',
                error: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.render('register', {
                title: 'Register',
                error: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.render('register', {
                title: 'Register',
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const checkSql = 'SELECT * FROM users WHERE email = ?';
        const existingUsers = await db.query(checkSql, [email]);

        if (existingUsers.length > 0) {
            return res.render('register', {
                title: 'Register',
                error: 'Email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const result = await db.query(insertSql, [username, email, hashedPassword]);

        // Auto login
        req.session.user = {
            id: result.insertId,
            username: username,
            email: email
        };

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            title: 'Register',
            error: 'An error occurred. Please try again.'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
