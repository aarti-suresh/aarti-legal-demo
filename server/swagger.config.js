/** @type {import('swagger-jsdoc').Options} */
module.exports = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'LEAP Dev - Matters API',
      description:
        'Public API for retrieving legal matter details from the LEAP Dev platform. ' +
        'Designed for third-party integrators and internal teams.',
      version: '1.0.0',
      contact: {
        name: 'LEAP Dev API Support',
        email: 'api-support@leapdev.com',
      },
    },
    servers: [
      {
        url: 'https://api.leapdev.com/v1',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Matters',
        description: 'Operations related to legal matters.',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Provide a valid JWT Bearer token in the Authorization header. ' +
            'Example: Authorization: Bearer <token>',
        },
      },
      schemas: {
        MatterId: {
          type: 'string',
          description: 'Unique identifier of a legal matter.',
          example: 'MTR-00123',
        },
        Matter: {
          type: 'object',
          description: 'Represents a legal matter in the LEAP Dev system.',
          required: ['matterId', 'matterType', 'status', 'clientName', 'assignedLawyer', 'createdAt'],
          properties: {
            matterId: {
              type: 'string',
              description: 'Unique identifier for the matter.',
              example: 'MTR-00123',
            },
            matterType: {
              type: 'string',
              description: 'The type/category of the legal matter.',
              enum: ['Conveyancing', 'Family', 'Commercial', 'Criminal', 'Other'],
              example: 'Conveyancing',
            },
            status: {
              type: 'string',
              description: 'Current status of the matter.',
              enum: ['Open', 'Pending', 'Closed', 'Archived'],
              example: 'Open',
            },
            clientName: {
              type: 'string',
              description: 'Full name of the client associated with the matter.',
              example: 'Jane Smith',
            },
            assignedLawyer: {
              type: 'string',
              description: 'Full name of the lawyer assigned to the matter.',
              example: 'Robert Hughes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'ISO 8601 timestamp of when the matter was created.',
              example: '2026-03-15T09:00:00Z',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          description: 'Standard error response returned for 4xx and 5xx status codes.',
          required: ['code', 'message'],
          properties: {
            code: {
              type: 'integer',
              description: 'HTTP status code.',
              example: 404,
            },
            message: {
              type: 'string',
              description: 'Human-readable error message.',
              example: 'Matter MTR-99999 was not found.',
            },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  // Files to scan for @openapi JSDoc annotations
  apis: ['./index.js'],
};
