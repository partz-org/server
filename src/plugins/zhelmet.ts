// This plugin has to be named like this so that it is loaded last. Otherwise, it creates conflicts with other plugins.
// Also, CSP is disabled in development to be able to see the documentation

import fp from "fastify-plugin";
import helmet from "fastify-helmet";

export default fp(async (fastify) =>
  fastify.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === "production",
  })
);
