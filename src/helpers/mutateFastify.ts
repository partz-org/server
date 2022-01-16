import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getUserInfoIfLogged } from "../utils/authorization/getUserInfoIfLogged";
import { createRedisClient } from "../utils/redis";

export const decorateFastify = (fastify: FastifyInstance) => {
  fastify.decorate("getUserInfoIfLogged", getUserInfoIfLogged);
};

export const addCachingHooks = (fastify: FastifyInstance) => {
  fastify.addHook(
    "onRequest",
    async function (
      req: FastifyRequest<{ Params: { id: string } }>,
      rep: FastifyReply
    ) {
      if (req.method === "GET" && !!req.params.id) {
        const redis = await createRedisClient();
        if (!redis) return;

        const result = await redis.get(req.params.id);

        if (result) return rep.status(202).send(JSON.parse(result));
      }
      return;
    }
  );

  fastify.addHook(
    "onResponse",
    async function (req: FastifyRequest<{ Params: { id: string } }>) {
      if (req.method === "DELETE" && !!req.params.id) {
        const redis = await createRedisClient();
        if (!redis) return;
        redis.del(req.params.id);
      }
    }
  );
};
