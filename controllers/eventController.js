const db = require("../models");
const Event = db.Event;

const createEvent = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude, date, createdBy } = req.body;
        const newEvent = await Event.create({ title, description, category, latitude, longitude, date, createdBy });
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchEvents = async (req, res) => {
    try {
        const { latitude, longitude, radius, category } = req.query;
        const events = await Event.findAll({
            where: {
                category: category ? category : { [Op.ne]: null },
                [Op.and]: db.sequelize.literal(
                    `ST_DWithin(geography(ST_SetSRID(ST_Point(longitude, latitude), 4326)), geography(ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326)), ${radius})`
                )
            }
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createEvent, getEvents, searchEvents };
