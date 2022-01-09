import {
  invalidCount as count,
  // invalidCountWithCustomAmounts as countWithCustomAmounts,
} from "../mocks";
import {
  recomputeCountData,
  resetParticipants,
} from "../../src/helpers/recomputeCountData";

describe("Should properly handle count computation", () => {
  test("should properly reset the participants", () => {
    resetParticipants(count.participants);
    count.participants.forEach((value) => {
      expect(value.creditors.length).toEqual(0);
      expect(value.debtors.length).toEqual(0);
      expect(value.balance).toEqual(0);
      expect(value.credit).toEqual(0);
      expect(value.debit).toEqual(0);
    });
  });

  test("should properly recompute the balance of a count", () => {
    recomputeCountData(count);

    let totalCredit = 0;
    let totalDebit = 0;

    count.participants.forEach((value: any) => {
      totalCredit += value.credit;
    });

    count.participants.forEach((value: any) => {
      totalDebit += value.debit;
    });

    expect(Math.round(totalCredit)).toEqual(15370);
    expect(Math.round(totalDebit)).toEqual(15370);
  });

  test.todo("should recompute count data with custom amounts");
});
