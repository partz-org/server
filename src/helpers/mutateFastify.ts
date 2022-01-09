import { FastifyInstance } from "fastify";

import { getUserInfoIfLogged } from "../utils/authorization/getUserInfoIfLogged";

export const decorateFastify = (fastify: FastifyInstance) => {
  fastify.decorate("getUserInfoIfLogged", getUserInfoIfLogged);
};
