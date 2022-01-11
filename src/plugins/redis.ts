import fp from "fastify-plugin";
import fastifyRedis, { FastifyRedisPluginOptions } from "fastify-redis";
import { exec } from "child_process";
import { promisify } from "util";

// We need to promisify exec because using it the old way
// with the callback crashes the server :(
const execAwait = promisify(exec);

export default fp(async (fastify) => {
  const { stdout } = await execAwait(
    `echo "$( docker container inspect -f '{{.State.Running}}' "redis-partz")"`
  );

  console.log(`stdout`, stdout);

  if (stdout.includes("true")) {
    console.log("coucou");
    fastify.register<FastifyRedisPluginOptions>(fastifyRedis, {
      host: "127.0.0.1",
    });
  }
});
