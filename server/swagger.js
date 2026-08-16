const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Habit Tracker API',
            version: '1.0.0',
            description:
                'This is a simple Habit Tracker API application built with Express and documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server',
            },
            {
                url: 'https://habittracker-hvk4.onrender.com',
                description: 'Production server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                SignupInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Yara' },
                        email: { type: 'string', example: 'yara@example.com' },
                        password: { type: 'string', example: 'password123' },
                    },
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'yara@example.com' },
                        password: { type: 'string', example: 'password123' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                    },
                },
                Habit: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '671f1c2e5b3a2a0012a4e123' },
                        name: { type: 'string', example: 'Drink Water' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                HabitInput: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string', example: 'Drink Water' },
                    },
                },
                Entry: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        habit: { type: 'string', example: '671f1c2e5b3a2a0012a4e123' },
                        date: { type: 'string', example: '2026-08-14' },
                    },
                },
                EntryInput: {
                    type: 'object',
                    required: ['date'],
                    properties: {
                        date: { type: 'string', example: '2026-08-14' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;