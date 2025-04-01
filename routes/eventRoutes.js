const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");

router.post("/", authMiddleware, eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/search", eventController.searchEvents);

module.exports = router;
