const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: 'my-secret-key-12345',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const apiRoutes = require('./routes/api');

// Use routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index', { 
        user: req.session.user,
        title: 'Home - Task Manager'
    });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('dashboard', { 
        user: req.session.user,
        title: 'Dashboard'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found',
        user: req.session.user
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        error: process.env.NODE_ENV === 'development' ? err : {},
        user: req.session.user
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Local: http://localhost:${PORT}`);
});
