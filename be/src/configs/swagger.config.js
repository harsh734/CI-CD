const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo Task Management API',
      version: '1.0.0',
      description: 'A RESTful API for managing tasks built with Node.js, Express, and PostgreSQL',
      contact: {
        name: 'Todo API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Task unique identifier',
              example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Learn React',
            },
            status: {
              type: 'boolean',
              description: 'Task completion status',
              example: false,
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority level',
              example: 'high',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp',
            },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Learn React',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority level (default: medium)',
              example: 'high',
            },
          },
        },
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Learn Node.js',
            },
            status: {
              type: 'boolean',
              description: 'Task completion status',
              example: true,
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority level',
              example: 'medium',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/app/**/*.route.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
