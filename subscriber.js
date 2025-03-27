const redis = require("redis");

const subscriber = redis.createClient();

// Subscribe to event notifications
subscriber.subscribe("event_notifications");

// Listen for messages
subscriber.on("message", (channel, message) => {
  console.log("🔔 New Event Notification:", JSON.parse(message));
});
