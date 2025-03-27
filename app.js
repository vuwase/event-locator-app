const express = require("express");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

const app = express();

// Middleware
app.use(express.json());
app.use(middleware.handle(i18next));

// Routes
app.get("/", (req, res) => {
  res.send("Event Locator App is running");
});

// Export app (without listening)
module.exports = app;
