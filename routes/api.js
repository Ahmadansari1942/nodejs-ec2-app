const express = require('express');
const router = express.Router();

// Login route
router.get('/login', (req, res) => {
  res.send('Login Page'); 
  // Agar EJS use karna chahte ho to:
  // res.render('login');
});

// Register route
router.get('/register', (req, res) => {
  res.render('register'); // register.ejs file honi chahiye views folder me
});

module.exports = router;

