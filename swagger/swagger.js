const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const i18n = require("../config/i18n"); // Ensure this exists

// Swagger Options
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Event Locator API",
            version: "1.0.0",
            description: "API for discovering, managing, and interacting with events based on user location and preferences.",
        },
        servers: [
            { url: "http://localhost:5000", description: "Development Server" },
            { url: "https://api.example.com/v1", description: "Production Server" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                UserRegister: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        password: { type: "string", format: "password" },
                    },
                    required: ["email", "password"],
                },
                UserLogin: {
                    type: "object",
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", format: "password" },
                    },
                    required: ["email", "password"],
                },
                Event: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        category: { type: "string" },
                        latitude: { type: "number" },
                        longitude: { type: "number" },
                        date: { type: "string", format: "date-time" },
                    },
                    required: ["title", "description", "latitude", "longitude", "date"],
                },
            },
        },
        security: [{ bearerAuth: [] }],
        paths: {
            "/api/auth/register": {
                post: {
                    summary: "Register a new user",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UserRegister" },
                            },
                        },
                    },
                    responses: {
                        "201": { description: "User registered successfully" },
                        "400": { description: "Invalid input" },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    summary: "User login",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UserLogin" },
                            },
                        },
                    },
                    responses: {
                        "200": { description: "Login successful, returns JWT token" },
                        "401": { description: "Invalid credentials" },
                    },
                },
            },
            "/api/auth/logout": {
                post: {
                    summary: "Logout user",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        "200": { description: "User logged out successfully" },
                    },
                },
            },
            "/api/events": {
                get: {
                    summary: "Get all events (Filter by category if provided)",
                    parameters: [
                        {
                            name: "category",
                            in: "query",
                            schema: { type: "string" },
                            description: "Filter events by category (e.g., 'Music', 'Sports', 'Tech')",
                        },
                    ],
                    responses: {
                        "200": { description: "List of events" },
                    },
                },
                post: {
                    summary: "Create a new event",
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Event" },
                            },
                        },
                    },
                    responses: {
                        "201": { description: "Event created successfully" },
                        "400": { description: "Duplicate event title" },
                    },
                },
            },
            "/api/events/search": {
                get: {
                    summary: "Search events by location",
                    parameters: [
                        { name: "latitude", in: "query", schema: { type: "number" }, required: true },
                        { name: "longitude", in: "query", schema: { type: "number" }, required: true },
                        { name: "radius", in: "query", schema: { type: "number" }, required: true },
                        { name: "category", in: "query", schema: { type: "string" }, required: false },
                    ],
                    responses: {
                        "200": { description: "List of events within the specified radius" },
                    },
                },
            },
            "/api/events/{id}": {
                put: {
                    summary: "Update an event by ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "integer" } },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Event" },
                            },
                        },
                    },
                    responses: {
                        "200": { description: "Event updated successfully" },
                        "400": { description: "Duplicate event title" },
                        "404": { description: "Event not found" },
                    },
                },
                delete: {
                    summary: "Delete an event by ID",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "integer" } },
                    ],
                    responses: {
                        "200": { description: "Event deleted successfully" },
                        "404": { description: "Event not found" },
                    },
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

// Generate Swagger Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware to serve Swagger UI
const swaggerSetup = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerSetup;
