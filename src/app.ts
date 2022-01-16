import { join } from "path";
import { FastifyPluginAsync } from "fastify";
import AutoLoad, { AutoloadPluginOptions } from "fastify-autoload";
import * as mongoose from "mongoose";
import { addCachingHooks, decorateFastify } from "./helpers/mutateFastify";
import { createRedisClient } from "./utils/redis";

// import { resetMongoose } from "./helpers/resetMongoose";

const mongoUri = process.env.MONGO_URI;

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  if (process.env.NODE_ENV !== "test") {
    await mongoose.connect(mongoUri!);
    fastify.log.info("Connected to MongoDB");
  }

  await createRedisClient(fastify);

  decorateFastify(fastify);
  addCachingHooks(fastify);

  // await resetMongoose(mongoose);

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  // fastify.ready(() => {
  //   fastify.log.info(fastify.printRoutes());
  // });
};

export default app;
export { app };
