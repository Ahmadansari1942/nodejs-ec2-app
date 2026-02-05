const express = require('express');
const router = express.Router();

// In-memory task storage (replace with database in production)
let tasks = [
    { id: 1, userId: 1, title: 'Complete project documentation', description: 'Write complete docs for the project', status: 'pending', priority: 'high', createdAt: new Date() },
    { id: 2, userId: 1, title: 'Review pull requests', description: 'Review and merge pending PRs', status: 'in-progress', priority: 'medium', createdAt: new Date() },
    { id: 3, userId: 1, title: 'Deploy to production', description: 'Deploy latest version to EC2', status: 'completed', priority: 'high', createdAt: new Date() }
];

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

// Get all tasks for logged in user
router.get('/', isAuthenticated, (req, res) => {
    const userTasks = tasks.filter(t => t.userId === req.session.user.id);
    res.render('tasks', {
        title: 'My Tasks',
        user: req.session.user,
        tasks: userTasks
    });
});

// Create task page
router.get('/create', isAuthenticated, (req, res) => {
    res.render('create-task', {
        title: 'Create Task',
        user: req.session.user
    });
});

// Create task POST
router.post('/create', isAuthenticated, (req, res) => {
    const { title, description, priority } = req.body;

    const newTask = {
        id: tasks.length + 1,
        userId: req.session.user.id,
        title,
        description,
        status: 'pending',
        priority: priority || 'medium',
        createdAt: new Date()
    };

    tasks.push(newTask);
    res.redirect('/tasks');
});

// Update task status
router.post('/update/:id', isAuthenticated, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;

    const task = tasks.find(t => t.id === taskId && t.userId === req.session.user.id);
    if (task) {
        task.status = status;
    }

    res.redirect('/tasks');
});

// Delete task
router.post('/delete/:id', isAuthenticated, (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(t => !(t.id === taskId && t.userId === req.session.user.id));
    res.redirect('/tasks');
});

// Edit task page
router.get('/edit/:id', isAuthenticated, (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId && t.userId === req.session.user.id);

    if (!task) {
        return res.redirect('/tasks');
    }

    res.render('edit-task', {
        title: 'Edit Task',
        user: req.session.user,
        task
    });
});

// Update task POST
router.post('/edit/:id', isAuthenticated, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, priority, status } = req.body;

    const task = tasks.find(t => t.id === taskId && t.userId === req.session.user.id);
    if (task) {
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.status = status;
    }

    res.redirect('/tasks');
});

module.exports = router;
