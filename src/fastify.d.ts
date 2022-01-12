import { UserDoc } from "./schemas/user";

declare module "fastify" {
  interface FastifyInstance {
    getUserInfoIfLogged: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
  interface FastifyRequest {
    user: UserDoc;
  }
}
