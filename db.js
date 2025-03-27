// db.js
const { Pool } = require('pg');
require('dotenv').config(); // To use environment variables

// Create a new pool instance with your database configuration
const pool = new Pool({
    user: process.env.DB_USER,       // Your database username
    host: process.env.DB_HOST,       // Your database host (usually localhost)
    database: process.env.DB_NAME,   // Your database name
    password: process.env.DB_PASSWORD,// Your database password
    port: process.env.DB_PORT || 5432 // Your database port (default is 5432)
});

// Export the pool to use it in other files
module.exports = pool;
