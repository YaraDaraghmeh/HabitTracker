const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Habit Tracker API',
            version: '1.0.0',
            description: 'Back end System for Simple  Habit Tracker App',

        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server',
            },
        ],
        components: {
            schemas: {
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