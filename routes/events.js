const express = require("express");
const redis = require("redis");
const pool = require("../db"); // PostgreSQL connection
const router = express.Router();

const publisher = redis.createClient();

// Event Creation Route
router.post("/create", async (req, res) => {
  const { title, category, location, date_time } = req.body;

  try {
    // Save event to DB (example query)
    await pool.query("INSERT INTO events (title, category, location, date_time) VALUES ($1, $2, $3, $4)", 
                      [title, category, location, date_time]);

    // Publish event notification
    publisher.publish("event_notifications", JSON.stringify({ title, category }));

    res.json({ message: "Event created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', async (req, res) => {
    const { latitude, longitude, radius } = req.query;

    try {
        const events = await pool.query(
            `SELECT * FROM events 
             WHERE ST_DWithin(
                 location, 
                 ST_SetSRID(ST_MakePoint($1, $2), 4326), 
                 $3
             )`,
            [longitude, latitude, radius]
        );

        res.json(events.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;