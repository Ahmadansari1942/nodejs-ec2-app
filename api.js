const express = require('express');
const router = express.Router();

// API middleware - check for API key (optional)
function apiAuth(req, res, next) {
    // For now, just check if user is logged in via session
    if (req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

// Get user info
router.get('/user', apiAuth, (req, res) => {
    res.json({
        success: true,
        user: req.session.user
    });
});

// Get app info
router.get('/info', (req, res) => {
    res.json({
        app: 'Task Manager Application',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        features: [
            'User Authentication',
            'Task Management',
            'CRUD Operations',
            'Session Management'
        ]
    });
});

// Get stats
router.get('/stats', apiAuth, (req, res) => {
    // In real app, get from database
    res.json({
        success: true,
        stats: {
            totalUsers: 1,
            totalTasks: 3,
            completedTasks: 1,
            pendingTasks: 2
        }
    });
});

module.exports = router;
