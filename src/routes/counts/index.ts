import { FastifyPluginAsync } from "fastify";
import {
  createCount,
  deleteCount,
  getAllCounts,
  getOneCount,
  updateCount,
} from "./controller";

const counts: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", {
    ...getAllCounts,
    preValidation: [fastify.getUserInfoIfLogged],
  });
  fastify.get("/:id", getOneCount);
  fastify.post("/", {
    ...createCount,
    preValidation: [fastify.getUserInfoIfLogged],
  });
  fastify.put("/:id", updateCount);
  fastify.delete("/:id", deleteCount);
};

export default counts;
