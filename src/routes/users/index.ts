import { FastifyPluginAsync } from "fastify";
import {
  createTempUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
} from "./controller";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", getAllUsers);
  fastify.get("/:id", getOneUser);
  fastify.post("/", createTempUser);
  fastify.put("/:id", updateUser);
  fastify.delete("/:id", deleteUser);
};

export default users;
