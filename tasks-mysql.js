// routes/tasks.js - MySQL Version
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

// Get all tasks for logged in user
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const sql = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
        const tasks = await db.query(sql, [req.session.user.id]);
        
        res.render('tasks', {
            title: 'My Tasks',
            user: req.session.user,
            tasks: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.render('tasks', {
            title: 'My Tasks',
            user: req.session.user,
            tasks: []
        });
    }
});

// Create task page
router.get('/create', isAuthenticated, (req, res) => {
    res.render('create-task', {
        title: 'Create Task',
        user: req.session.user
    });
});

// Create task POST
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const sql = 'INSERT INTO tasks (user_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [
            req.session.user.id,
            title,
            description,
            priority || 'medium',
            'pending'
        ]);

        res.redirect('/tasks');
    } catch (error) {
        console.error('Error creating task:', error);
        res.redirect('/tasks');
    }
});

// Update task status
router.post('/update/:id', isAuthenticated, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { status } = req.body;

        const sql = 'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?';
        await db.query(sql, [status, taskId, req.session.user.id]);

        res.redirect('/tasks');
    } catch (error) {
        console.error('Error updating task:', error);
        res.redirect('/tasks');
    }
});

// Delete task
router.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
        await db.query(sql, [taskId, req.session.user.id]);

        res.redirect('/tasks');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.redirect('/tasks');
    }
});

// Edit task page
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        const sql = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
        const tasks = await db.query(sql, [taskId, req.session.user.id]);

        if (tasks.length === 0) {
            return res.redirect('/tasks');
        }

        res.render('edit-task', {
            title: 'Edit Task',
            user: req.session.user,
            task: tasks[0]
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.redirect('/tasks');
    }
});

// Update task POST
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { title, description, priority, status } = req.body;

        const sql = 'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ? AND user_id = ?';
        await db.query(sql, [title, description, priority, status, taskId, req.session.user.id]);

        res.redirect('/tasks');
    } catch (error) {
        console.error('Error updating task:', error);
        res.redirect('/tasks');
    }
});

module.exports = router;
