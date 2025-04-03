const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const Event = db.Event;
const { sendEmail } = require("../services/notificationService"); // Import the email service
const User = db.User; // Assuming you have a User model

const createEvent = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude, date, createdBy } = req.body;

        // Check for duplicate event title
        const existingEvent = await Event.findOne({ where: { title } });
        if (existingEvent) {
            return res.status(400).json({ message: req.__('event.duplicate_title') });
        }

        const newEvent = await Event.create({ title, description, category, latitude, longitude, date, createdBy });
        
        // Send notification to the creator
        const creator = await User.findByPk(createdBy);
        if (creator && creator.email) {
            await sendEmail(
                creator.email,
                "Event Created Successfully",
                `Your event "${title}" has been created successfully!\n\n` +
                `Event Details:\n` +
                `Date: ${new Date(date).toLocaleString()}\n` +
                `Location: ${latitude}, ${longitude}\n` +
                `Description: ${description}`
            );
        }

        res.status(201).json({ message: req.__('event.created_successfully'), event: newEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, latitude, longitude, date } = req.body;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: req.__('event.not_found') });
        }

        if (title && title !== event.title) {
            const duplicateEvent = await Event.findOne({ where: { title } });
            if (duplicateEvent) {
                return res.status(400).json({ message: req.__('event.duplicate_title') });
            }
        }

        const oldEventData = { ...event.get() };
        await event.update({ title, description, category, latitude, longitude, date });
        
        // Send notification about the update
        const creator = await User.findByPk(event.createdBy);
        if (creator && creator.email) {
            let changes = [];
            if (oldEventData.title !== title) changes.push(`Title: ${oldEventData.title} → ${title}`);
            if (oldEventData.date !== date) changes.push(`Date: ${new Date(oldEventData.date).toLocaleString()} → ${new Date(date).toLocaleString()}`);
            // Add more fields as needed

            if (changes.length > 0) {
                await sendEmail(
                    creator.email,
                    "Event Updated",
                    `Your event "${title}" has been updated.\n\n` +
                    `Changes:\n${changes.join('\n')}\n\n` +
                    `New Event Details:\n` +
                    `Date: ${new Date(date).toLocaleString()}\n` +
                    `Location: ${latitude}, ${longitude}\n` +
                    `Description: ${description}`
                );
            }
        }

        res.json({ message: req.__('event.updated_successfully'), event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: req.__('event.not_found') });
        }

        // Get event details before deletion for notification
        const eventDetails = { ...event.get() };
        await event.destroy();
        
        // Send deletion notification
        const creator = await User.findByPk(event.createdBy);
        if (creator && creator.email) {
            await sendEmail(
                creator.email,
                "Event Deleted",
                `Your event "${eventDetails.title}" has been deleted.\n\n` +
                `Deleted Event Details:\n` +
                `Date: ${new Date(eventDetails.date).toLocaleString()}\n` +
                `Location: ${eventDetails.latitude}, ${eventDetails.longitude}\n` +
                `Description: ${eventDetails.description}`
            );
        }

        res.json({ message: req.__('event.deleted_successfully') });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const { category } = req.query;

        // Filter by category if provided
        const whereClause = category ? { category } : {};

        const events = await Event.findAll({ where: whereClause });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchEvents = async (req, res) => {
    try {
        const { latitude, longitude, radius, category } = req.query;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ message: req.__('event.missing_parameters') });
        }

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
};

// getEvents and searchEvents remain the same as they don't modify data
// ...

module.exports = {
    createEvent,
    getEvents,
    searchEvents,
    updateEvent,
    deleteEvent
};