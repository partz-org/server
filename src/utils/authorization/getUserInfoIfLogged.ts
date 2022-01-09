import { FastifyRequest } from "fastify";
import { UserDoc } from "../../schemas/user";

export const getUserInfoIfLogged = async (request: FastifyRequest) => {
  try {
    const user = await request.jwtVerify<UserDoc>();
    request.user = user;
  } catch (e) {
    if (process.env.NODE_ENV === "test") return;
    console.error(e);
  }
};
