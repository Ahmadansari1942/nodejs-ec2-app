const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.send('Login Page');
});

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

module.exports = router;

