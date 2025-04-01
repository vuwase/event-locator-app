// File: middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Define the middleware function
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('Token is required for authentication');
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user; // Save user information in the request object
        next(); // Proceed to the next middleware/route handler
    });
};

// Export the middleware function
module.exports = authMiddleware;
