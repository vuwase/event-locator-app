const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register router
router.post('/register', userController.registerUser);

// Login router
router.post('/login', userController.loginUser);

module.exports = router;
// In this example, the authRoutes.js file defines the routes for user registration and login. The routes are registered using the Express Router, and the corresponding controller functions are imported from the authController.js file. This separation of concerns helps to keep the code organized and maintainable.