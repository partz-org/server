import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";

import { getUserInfoIfLogged } from "../utils/authorization/getUserInfoIfLogged";

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
        const result = await fastify.redis.get(req.params.id);

        if (result) return rep.status(202).send(JSON.parse(result));
      }
      return;
    }
  );
  fastify.addHook(
    "onSend",
    function (
      req: FastifyRequest<{ Params: { id: string } }>,
      _rep: FastifyReply,
      payload: string,
      done: HookHandlerDoneFunction
    ) {
      const isMutatingData = req.method === "POST" || req.method === "PUT";

      if (isMutatingData) {
        const object = JSON.parse(payload);
        if (object.id) {
          fastify.redis.set(object.id, payload);
        }
      }

      done();
    }
  );
  fastify.addHook(
    "onResponse",
    function (
      req: FastifyRequest<{ Params: { id: string } }>,
      _rep: FastifyReply,
      done: HookHandlerDoneFunction
    ) {
      if (req.method === "DELETE" && !!req.params.id) {
        fastify.redis.del(req.params.id);
        console.info("I got removed from cache!");
      }
      done();
    }
  );
};
