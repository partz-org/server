import { createClient, RedisClientType } from "redis";
import { exec } from "child_process";
import { promisify } from "util";
import { Document } from "mongoose";

const execAwait = promisify(exec);

const CHECK_IF_REDIS_CONTAINER_IS_RUNNING = `echo "$( docker container inspect -f '{{.State.Running}}' "redis-partz")"`;

let redis: RedisClientType<any, any>;

export const createRedisClient = async () => {
  if (redis) {
    return redis;
  }

  const { stdout } = await execAwait(CHECK_IF_REDIS_CONTAINER_IS_RUNNING);

  if (stdout.includes("true")) {
    redis = createClient();
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
