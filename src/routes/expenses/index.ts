import { FastifyPluginAsync } from "fastify";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getOneExpense,
  updateExpense,
} from "./controller";

const expenses: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/", getAllExpenses);
  fastify.get("/:id", getOneExpense);
  fastify.post("/", createExpense);
  fastify.put("/:id", updateExpense);
  fastify.delete("/:id", deleteExpense);
};

export default expenses;
