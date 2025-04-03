const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");

// Create a new event (protected route)
router.post("/", eventController.createEvent);

// Get all events (public route)
router.get("/", eventController.getEvents);

// Search events by location and radius (public route)
router.get("/search", eventController.searchEvents);

// Update an event by ID (protected route)
router.put("/:id", eventController.updateEvent);

// Delete an event by ID (protected route)
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
