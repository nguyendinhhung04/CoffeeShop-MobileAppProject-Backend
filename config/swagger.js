// javascript
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerDefinitions = require("./swagger-definitions");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CoffeeShop API",
            version: "1.0.0",
            description: "API documentation for CoffeeShop backend"
        },
        servers: [
            {
                url: process.env.SERVER_URL || "http://localhost:3000",
                description: process.env.NODE_ENV === "production" ? "Production server" : "Development server"
            }
        ],
        paths: swaggerDefinitions
    },
    apis: [] // Required by swagger-jsdoc, empty array since we define paths manually
};

const specs = swaggerJsdoc(options);
module.exports = specs;