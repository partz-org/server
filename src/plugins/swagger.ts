import fp from "fastify-plugin";
import fastifySwagger, { SwaggerOptions } from "fastify-swagger";

const swaggerConfig: SwaggerOptions = {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Test swagger",
      description: "testing the fastify swagger api",
      version: "0.1.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "user", description: "User related end-points" },
      { name: "counts", description: "Counts related end-points" },
      { name: "expenses", description: "Expenses related end-points" },
      { name: "participants", description: "Participants related end-points" },
    ],
    definitions: {
      User: {
        type: "object",
        required: ["id", "email"],
        properties: {
          id: { type: "string", format: "uuid" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
    },
    securityDefinitions: {
      apiKey: {
        type: "apiKey",
        name: "apiKey",
        in: "header",
      },
    },
  },
  exposeRoute: true,
};

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<SwaggerOptions>(async (fastify) => {
  fastify.register(fastifySwagger, swaggerConfig);
});
