require("dotenv").config();
const express = require("express");
const { sequelize } = require('./models');
const cors = require("cors");
const swaggerSetup = require("./swagger/swagger");
const userRoutes = require('./routes/userRoutes');
const passport = require("passport");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require('./routes/authRoutes');
const i18n = require("./config/i18n.js");  // Import i18n properly
const db = require("./models"); // Ensure your models are configured for PostgreSQL
const bcrypt = require("bcryptjs");
require("sequelize");

const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(i18n.init); // Use i18n middleware to handle language switching
app.use(passport.initialize());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/events', eventRoutes); // Event-related routes

// Auth Route for User Registration
app.post("/api/auth/register", async (req, res) => {
    try {
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

// Swagger Setup for API documentation
swaggerSetup(app);

// Database Connection (PostgreSQL)
db.sequelize.sync()
  .then(() => {
      console.log("PostgreSQL connected successfully.");
  })
  .catch(err => {
      console.error("Database connection error:", err);
  });

// Event Management Routes
const Event = db.Event;

// Create Event Route (POST)
app.post("/api/events", async (req, res) => {
    try {
        const { title, description, category, latitude, longitude, date, createdBy } = req.body;
        const newEvent = await Event.create({ title, description, category, latitude, longitude, date, createdBy });
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Events Route (GET)
app.get("/api/events", async (req, res) => {
    try {
        const { category } = req.query;
        const whereClause = category ? { category } : {};
        const events = await Event.findAll({ where: whereClause });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search Events by Location Route (GET)
app.get("/api/events/search", async (req, res) => {
    try {
        const { latitude, longitude, radius, category } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ message: "Latitude, longitude, and radius are required for search" });
        }

        // Using Haversine formula for distance calculation (in kilometers)
        const whereClause = {
            [Op.and]: db.sequelize.literal(`
                (6371 * acos(
                    cos(radians(${latitude})) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${longitude})) +
                    sin(radians(${latitude})) * sin(radians(latitude))
                )) <= ${radius}
            `),
        };

        if (category) {
            whereClause.category = category;
        }

        const events = await Event.findAll({ where: whereClause });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Event Route (PUT)
app.put("/api/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, latitude, longitude, date } = req.body;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.update({ title, description, category, latitude, longitude, date });
        res.json({ message: "Event updated successfully", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Event Route (DELETE)
app.delete("/api/events/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.destroy();
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Registered Routes:");
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            console.log(r.route.path);
        }
    });
});

module.exports = app; // Export the app for testing or further configuration
