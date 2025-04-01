const i18n = require('i18n');

i18n.configure({
    locales: ['en', 'fr'], // Add supported locales
    directory: __dirname + '/locales', // Path to locale files
    defaultLocale: 'en', // Default locale
    cookie: 'lang' // Cookie name for the locale
});

// Middleware for i18n
const i18nMiddleware = (req, res, next) => {
    i18n.init(req, res); // Initialize i18n
    next(); // Proceed to the next middleware
};

module.exports = i18nMiddleware; // Export the middleware
// Compare this snippet from middleware/authMiddleware.js: