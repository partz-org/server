import { CountDoc } from "../schemas/count";
import { ExpenseDoc } from "../schemas/expense";

export const hasAllParticipantsInCount = (
  count: CountDoc,
  expense: ExpenseDoc
) => {
  const countParticipantNames = count.participants.map((p) => p.name);
  const hasAllTaggedParticipantsInCount = expense.owers.every((participant) =>
    countParticipantNames.includes(participant)
  );

  const hasAllPayingParticipantsInCount = expense.payers.every((participant) =>
    countParticipantNames.includes(participant)
  );

  return hasAllTaggedParticipantsInCount && hasAllPayingParticipantsInCount;
};
