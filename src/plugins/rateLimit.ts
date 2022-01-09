import fp from "fastify-plugin";
import rateLimiter from "fastify-rate-limit";

export default fp(async (fastify) => {
  fastify.register(rateLimiter, {
    max: 300,
    timeWindow: 10 * 60 * 1000,
    ban: 2,
  });
});
