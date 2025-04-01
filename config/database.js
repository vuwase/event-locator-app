module.exports = {
    username: process.env.DB_USER || "jane",
    password: process.env.DB_PASS || "123",
    database: process.env.DB_NAME || "event_locator",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres", // or "mysql" depending on your DB
  };
// Compare this snippet from models/event.js:  