require("dotenv").config();  
const express = require("express");
const { sequelize } = require('./models');
const cors = require("cors");
const swaggerSetup = require("./swagger/swagger");
const userRoutes = require('./routes/userRoutes');
const passport = require("passport");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require('./routes/authRoutes');
const i18n = require("./config/i18n");
const db = require("./models"); // Ensure your models are configured for PostgreSQL
const bcrypt = require("bcryptjs");
require("sequelize");

const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(i18n); // Your internationalization middleware
app.use(passport.initialize());
app.use('/api/auth', authRoutes);

// Correct the auth route handling
// This is where you register your route for POST requests to '/api/auth/register'
app.post("/api/auth/register", async (req, res) => {
    try {
        console.log("DB Object:", db);  // Debug: Check if db is loaded
        console.log("DB User Model:", db.User);  // Debug: Check if User model exists

        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!db.User) {
            return res.status(500).json({ error: "User model is undefined!" });
        }

        const newUser = await db.User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error("Error in /api/auth/register:", err);
        res.status(500).json({ message: "Internal server error", error: err.message || "Unknown error" });
    }
});


// Swagger Setup
swaggerSetup(app);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Use user routes
app.use("/api/events", eventRoutes); // Use event routes

// Database Connection
db.sequelize.sync()
  .then(() => {
      console.log("PostgreSQL connected successfully.");
  })
  .catch(err => {
      console.error("Database connection error:", err);
  });

// Event Management Routes
const Event = db.Event;
app.post("/api/events", async (req, res) => {
    try {
        const { title, description, category, latitude, longitude, date, createdBy } = req.body;
        const newEvent = await Event.create({ title, description, category, latitude, longitude, date, createdBy });
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("Registered Routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

module.exports = app; // Export the app for testing or further configuration
