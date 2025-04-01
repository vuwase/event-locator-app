const swaggerUi = require('swagger-ui-express'); 
const swaggerJsDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Event Locator API',
            version: '1.0.0',
            description: 'API for discovering, managing, and interacting with events based on user location and preferences.',
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Development Server' },
            { url: 'https://api.example.com/v1', description: 'Production Server' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                UserRegister: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' }
                    },
                    required: ['email', 'password'] // Make sure email and password are required
                },
                UserLogin: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' }
                    },
                    required: ['email', 'password'] // Ensure that both email and password are required for login
                },
                Event: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                        location: {
                            type: 'object',
                            properties: {
                                lat: { type: 'number' },
                                lng: { type: 'number' }
                            }
                        },
                        date: { type: 'string', format: 'date-time' }
                    },
                    required: ['title', 'description', 'date'] // Set required fields for events
                }
            }
        },
        security: [{ bearerAuth: [] }],
        paths: {
            '/api/auth/register': {
                post: {
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserRegister'
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'User registered successfully'
                        },
                        '400': {
                            description: 'Invalid input'
                        },
                        '500': {
                            description: 'Internal server error'
                        }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    summary: 'User login',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserLogin'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Login successful, returns JWT token'
                        },
                        '401': {
                            description: 'Invalid credentials'
                        }
                    }
                }
            },
            '/api/auth/logout': {
                post: {
                    summary: 'Logout user',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'User logged out successfully'
                        }
                    }
                }
            },
            '/api/auth/profile': {
                get: {
                    summary: 'Get user profile',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'User profile data'
                        }
                    }
                }
            },
            '/events': {
                get: {
                    summary: 'Get all events',
                    parameters: [
                        {
                            name: 'category',
                            in: 'query',
                            schema: { type: 'string' },
                            description: 'Filter by event category'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'List of events'
                        }
                    }
                },
                post: {
                    summary: 'Create a new event',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Event'
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Event created successfully'
                        }
                    }
                }
            },
            '/events/search': {
                get: {
                    summary: 'Search events by location',
                    parameters: [
                        { name: 'lat', in: 'query', schema: { type: 'number' }, required: true },
                        { name: 'lng', in: 'query', schema: { type: 'number' }, required: true },
                        { name: 'radius', in: 'query', schema: { type: 'number' }, required: true }
                    ],
                    responses: {
                        '200': {
                            description: 'List of events within the specified radius'
                        }
                    }
                }
            },
            '/notifications': {
                get: {
                    summary: 'Get user notifications',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'List of notifications'
                        }
                    }
                }
            },
            '/favorites': {
                get: {
                    summary: 'Get favorite events',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'List of favorite events'
                        }
                    }
                }
            },
            '/events/{id}/ratings': {
                post: {
                    summary: 'Rate an event',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        rating: { type: 'integer', minimum: 1, maximum: 5 }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Event rated successfully'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerSetup = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerSetup;
