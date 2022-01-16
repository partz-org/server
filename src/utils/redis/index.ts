import { createClient, RedisClientType } from "redis";
import { exec } from "child_process";
import { promisify } from "util";
import { Document } from "mongoose";
import { FastifyInstance } from "fastify";

const execAwait = promisify(exec);

const CHECK_IF_REDIS_CONTAINER_IS_RUNNING = `echo "$( docker container inspect -f '{{.State.Running}}' "redis-partz")"`;

let redis: RedisClientType<any, any>;

export const createRedisClient = async (fastify?: FastifyInstance) => {
  if (redis) {
    return redis;
  }

  const { stdout } = await execAwait(CHECK_IF_REDIS_CONTAINER_IS_RUNNING);

  if (stdout.includes("true")) {
    redis = createClient();

    if (fastify) {
      redis.on("ready", () => fastify.log.info("Connected to Redis!"));
    }

    await redis.connect();

    return redis;
  }
};

export const MONGOOSE_METHODS = ["save", "findOneAndUpdate", "updateOne"];

export const saveToRedis = async (doc: Document) => {
  const redis = await createRedisClient();

  if (!redis) return;

  redis.set(doc.id, JSON.stringify(doc));
};
