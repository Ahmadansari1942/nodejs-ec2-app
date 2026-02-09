// routes/api.js - MySQL Version
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// API middleware - check for authentication
function apiAuth(req, res, next) {
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
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'MySQL',
        features: [
            'User Authentication',
            'Task Management',
            'CRUD Operations',
            'Session Management',
            'MySQL Database'
        ]
    });
});

// Get stats
router.get('/stats', apiAuth, async (req, res) => {
    try {
        // Get total tasks
        const totalSql = 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ?';
        const totalResult = await db.query(totalSql, [req.session.user.id]);
        const totalTasks = totalResult[0].count;

        // Get completed tasks
        const completedSql = 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = ?';
        const completedResult = await db.query(completedSql, [req.session.user.id, 'completed']);
        const completedTasks = completedResult[0].count;

        // Get pending tasks
        const pendingSql = 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = ?';
        const pendingResult = await db.query(pendingSql, [req.session.user.id, 'pending']);
        const pendingTasks = pendingResult[0].count;

        // Get in-progress tasks
        const inProgressSql = 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = ?';
        const inProgressResult = await db.query(inProgressSql, [req.session.user.id, 'in-progress']);
        const inProgressTasks = inProgressResult[0].count;

        res.json({
            success: true,
            stats: {
                totalUsers: 1,
                totalTasks: totalTasks,
                completedTasks: completedTasks,
                pendingTasks: pendingTasks,
                inProgressTasks: inProgressTasks
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

module.exports = router;
