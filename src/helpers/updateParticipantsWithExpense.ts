import { ExpenseDoc } from "../schemas/expense";
import { DebtorOrCreditor, ParticipantDoc } from "../schemas/participant";
import { UserDoc } from "../schemas/user";

interface Participant {
  name: string;
  user?: UserDoc;
  balance: number;
  credit: number;
  debit: number;
  debtors: DebtorOrCreditor;
  creditors: DebtorOrCreditor;
}

export const updateParticipantsWithExpense = (
  participants: ParticipantDoc[],
  expense: ExpenseDoc
) => {
  const participantsWithDebts: Participant[] = [];
  const participantsWithCredits: Participant[] = [];
  let currentDebtorIndex = 0;

  participants.forEach((participant) => {
    // update the credit of the payers
    if (expense.payers.includes(participant.name)) {
      const customPayer = expense.customPayers?.find(
        (c) => c.name === participant.name
      );

      if (customPayer && customPayer.customAmount > 0) {
        participant.credit += customPayer.customAmount;
      } else {
        participant.credit += expense.amount / expense.payers.length;
      }
    }

    // update each participant debit
    if (expense.owers.includes(participant.name)) {
      const customOwer = expense.customOwers?.find(
        (c) => c.name === participant.name
      );

      if (customOwer && customOwer.customAmount > 0) {
        participant.debit += customOwer.customAmount;
      } else {
        participant.debit += expense.amount / expense.owers.length;
      }
    }

    // update the balance of each participants
    participant.balance = participant.credit - participant.debit;

    participant.debtors = [];
    participant.creditors = [];

    const participantCopy = {
      name: participant.name,
      user: participant?.user,
      balance: participant.balance,
      credit: participant.credit,
      debit: participant.debit,
      debtors: participant.debtors,
      creditors: participant.creditors,
    };

    if (participant.balance > 0) {
      participantsWithCredits.push(participantCopy);
    }
    if (participant.balance < 0) {
      participantsWithDebts.push(participantCopy);
    }

    return participant;
  });

  participantsWithCredits.forEach((creditor: Participant, index: number) => {
    while (creditor.balance > 1) {
      const debtor = participantsWithDebts[currentDebtorIndex];

      const debtorToUpdate = participants.find((p) => p.name === debtor.name);

      const creditorToUpdate = participants.find(
        (p) => p.name === creditor.name
      );

      if (!debtorToUpdate || !creditorToUpdate) {
        return;
      }

      const result = creditor.balance + debtor.balance;

      const canRepayInFull = result <= 0;

      if (canRepayInFull) {
        debtorToUpdate.creditors.push({
          name: creditor.name,
          amount: creditor.balance,
        });
        creditorToUpdate.debtors.push({
          name: debtor.name,
          amount: creditor.balance,
        });

        creditor.balance = 0;
        debtor.balance = result;
        return;
      }

      debtorToUpdate.creditors.push({
        name: creditor.name,
        amount: debtor.balance * -1,
      });
      creditorToUpdate.debtors.push({
        name: debtor.name,
        amount: debtor.balance * -1,
      });

      currentDebtorIndex++;
      debtor.balance = 0;
      creditor.balance = result;
    }
    // if no other items in array, return
    if (index === participantsWithCredits.length - 1) {
      return;
    }
  });
};
