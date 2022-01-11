import { exec } from "child_process";
import fp from "fastify-plugin";
import fastifyRedis, { FastifyRedisPluginOptions } from "fastify-redis";

let IS_REDIS_ONLINE: boolean;

exec(
  `echo "$( docker container inspect -f '{{.State.Running}}' "redis-partz")"`,
  (_error, stdout) => {
    IS_REDIS_ONLINE = stdout.includes("true");
  }
);

export default fp(async (fastify) => {
  if (IS_REDIS_ONLINE) {
    fastify.register<FastifyRedisPluginOptions>(fastifyRedis, {
      url: process.env.REDIS_URL,
    });
  }
});
