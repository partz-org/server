import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    "/",
    {
      onRequest: (_req, rep) => {
        rep.send({ nope: "^^" });
      },
    },
    async () => ({ hello: "there" })
  );
};

export default root;
