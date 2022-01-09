import { FastifyPluginAsync } from "fastify";
import {
  createTempUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  register,
  updateUser,
} from "./controller";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", getAllUsers);
  fastify.get("/:id", getOneUser);
  fastify.post("/", createTempUser);
  fastify.post("/register", {
    ...register,
    preValidation: [fastify.getUserInfoIfLogged],
  });

  fastify.put("/:id", updateUser);
  fastify.delete("/:id", deleteUser);
};

export default users;
