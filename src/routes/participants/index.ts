import { FastifyPluginAsync } from "fastify";
import {
  createParticipant,
  deleteParticipant,
  getAllParticipants,
  getOneParticipant,
  updateParticipant,
} from "./controller";

const expenses: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", getAllParticipants);
  fastify.get("/:id", getOneParticipant);
  fastify.post("/", createParticipant);
  fastify.put("/:id", updateParticipant);
  fastify.delete("/:id", deleteParticipant);
};

export default expenses;
