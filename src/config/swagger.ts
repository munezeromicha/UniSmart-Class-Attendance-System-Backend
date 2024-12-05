import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniSmart API Documentation',
      version: '1.0.0',
      description: 'API documentation for UniSmart system',
      contact: {
        name: 'UniSmart Support',
        email: 'support@unismart.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
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
  apis: ['./src/routes/*.ts'] 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;