import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MyVintage API',
            version: '1.0.0',
            description: 'API documentation for MyVintage',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                AuthTokens: {
                    type: 'object',
                    properties: {
                        accessToken:  { type: 'string' },
                        refreshToken: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

export default swaggerJsdoc(options);
