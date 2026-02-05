const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// In-memory user storage (replace with database in production)
const users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin123', 10) // admin123
    }
];

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
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.render('login', {
            title: 'Login',
            error: 'Invalid email or password'
        });
    }

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
});

// Register POST
router.post('/register', async (req, res) => {
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
    if (users.find(u => u.email === email)) {
        return res.render('register', {
            title: 'Register',
            error: 'Email already exists'
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword
    };

    users.push(newUser);

    // Auto login
    req.session.user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
    };

    res.redirect('/dashboard');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
