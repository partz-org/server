import { RouteHandlerMethod } from "fastify/types/route";
import { Expense } from "../../schemas/expense";
import { Count } from "../../schemas/count";
import { recomputeCountData } from "../../helpers/recomputeCountData";
import { hasAllParticipantsInCount } from "../../helpers/hasAllParticipantsInCount";
import {
  CreateExpense,
  CreateExpenseBodyJson,
  DeleteExpense,
  ExpenseIdParamsJson,
  GetOneExpense,
  GetOneExpenseParamsJson,
  UpdateExpense,
  UpdateExpenseBodyJson,
} from "./validator";
import {
  sendExpoMessage,
  getTokensExceptOwner,
} from "../../utils/notifications";

export const getAllExpenses: RouteHandlerMethod = async function (_req, rep) {
  const allExpenses = await Expense.find({});
  rep.status(200).send(allExpenses);
};

export const getOneExpense: GetOneExpense = {
  handler: async function (req, rep) {
    const expenseToFind = await Expense.findById(req.params.id).populate({
      path: "count",
      populate: { path: "participants" },
    });

    if (!expenseToFind) {
      throw new Error("Cannot find document inside Expense");
    }

    rep.send(expenseToFind);
  },
  schema: {
    params: GetOneExpenseParamsJson,
    tags: ["expenses"],
  },
};

export const createExpense: CreateExpense = {
  handler: async function (req, rep) {
    const newExpense = await new Expense(req.body).populate({
      path: "count",
      populate: { path: "participants" },
    });

    const countToUpdate = await Count.findById(req.body.count).populate([
      "expenses",
      {
        path: "participants",
        populate: [{ path: "user" }],
      },
    ]);

    if (!countToUpdate) {
      throw new Error("Cannot find a count associated with your expense.");
    }
    if (!hasAllParticipantsInCount(countToUpdate, newExpense)) {
      throw new Error(
        "One or more participant isn't associated with this count."
      );
    }
    countToUpdate.expenses = countToUpdate.expenses.concat(newExpense);

    await recomputeCountData(countToUpdate);

    await newExpense.save();

    await countToUpdate.save();

    await sendExpoMessage({
      to: getTokensExceptOwner(
        countToUpdate.participants,
        newExpense.mutatedBy
      ),
      title: `New expense created!`,
      body: `An expense of ${newExpense.amount}€ was made by ${newExpense.mutatedBy} for ${newExpense.title} and added to ${countToUpdate.title}`,
    });

    rep.status(201).send(newExpense);
  },
  schema: {
    body: CreateExpenseBodyJson,
    tags: ["expenses"],
  },
};

export const updateExpense: UpdateExpense = {
  handler: async function (req, rep) {
    const expenseToUpdate = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body as any,
      { new: true }
    ).populate({
      path: "count",
      populate: { path: "participants" },
    });

    if (!expenseToUpdate) {
      throw new Error("Expense not found");
    }

    const countToUpdate = await Count.findById(expenseToUpdate.count).populate([
      "expenses",
      {
        path: "participants",
        populate: [{ path: "user" }],
      },
    ]);

    if (!countToUpdate) {
      throw new Error("Cannot update count data after expense edit.");
    }

    if (req.body.payers || req.body.owers || req.body.amount !== undefined) {
      await recomputeCountData(countToUpdate);

      await countToUpdate.save();
    }

    await sendExpoMessage({
      to: getTokensExceptOwner(
        countToUpdate.participants,
        expenseToUpdate.mutatedBy
      ),
      title: `Expense udpated!`,
      body: `An expense of ${expenseToUpdate.amount}€ was updated by ${expenseToUpdate.mutatedBy} for ${expenseToUpdate.title} in ${countToUpdate.title}`,
    });

    rep.send(expenseToUpdate);
  },
  schema: {
    body: UpdateExpenseBodyJson,
    params: ExpenseIdParamsJson,
    tags: ["expenses"],
  },
};

export const deleteExpense: DeleteExpense = {
  schema: {
    params: ExpenseIdParamsJson,
    tags: ["expenses"],
  },
  handler: async function (req, rep) {
    const expenseToDelete = await Expense.findByIdAndRemove(req.params.id);

    if (!expenseToDelete) {
      throw new Error("Expense not found");
    }

    const countToUpdate = await Count.findById(expenseToDelete.count).populate([
      "expenses",
      "participants",
    ]);

    if (!countToUpdate) {
      throw new Error("Cannot update count data after expense edit.");
    }

    await recomputeCountData(countToUpdate);
    await countToUpdate.save();

    rep.send({
      message: `The expense made by ${expenseToDelete?.payers} with amount of  ${expenseToDelete?.amount} was deleted.`,
    });
  },
};
