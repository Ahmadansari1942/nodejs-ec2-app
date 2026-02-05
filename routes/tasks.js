const express = require('express');
const router = express.Router();

router.get('/tasks', (req, res) => {
  res.send('Tasks Page');
});

router.get('/', (req, res) => {
  res.render('tasks'); // tasks.ejs
});

router.get('/create', (req, res) => {
  res.render('create-task');
});

router.get('/edit/:id', (req, res) => {
  res.render('edit-task', { id: req.params.id });
});

module.exports = router;

