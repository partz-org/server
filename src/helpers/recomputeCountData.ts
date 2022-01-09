import { CountDoc } from "../schemas/count";
import { ParticipantProps } from "../schemas/participant";
import { updateParticipantsWithExpense } from "./updateParticipantsWithExpense";

export const resetParticipants = (participants: ParticipantProps[]) => {
  participants.forEach((value) => {
    value.balance = 0;
    value.credit = 0;
    value.debit = 0;
    value.creditors = [];
    value.debtors = [];
  });
};

export const recomputeCountData = async (count: CountDoc) => {
  resetParticipants(count.participants);

  count.expenses.forEach((expense) => {
    updateParticipantsWithExpense(count.participants, expense);
  });

  for await (const p of count.participants) {
    p.save();
  }

  count.total = count.expenses.reduce((acc, curr) => acc + curr.amount, 0);
};
