import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation',
      version: process.env.npm_package_version || '1.0.0',
      description: 'MVC API documentation blank template'
    },
    servers: [
      { url: '/api/v1' },
      { url: '/api/v2' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/v*/routes/*.js', './src/v*/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;