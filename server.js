// server.js
const app = require("./app"); // Import the Express app
const PORT = process.env.PORT || 5000; // Set the port, defaulting to 5000
const i18nextMiddleware = require('i18next-http-middleware');
const i18next = require('./i18n'); // Adjust path as needed

app.use(i18nextMiddleware.handle(i18next)); // Use i18next middleware

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log to indicate the server is running
});

// Export server for testing purposes if needed
module.exports = server;

