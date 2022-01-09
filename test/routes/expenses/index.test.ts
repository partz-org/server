import { Count } from "../../../src/schemas/count";
import { Expense } from "../../../src/schemas/expense";
import { countBody, newCount, newExpense } from "../../mocks";
import { app } from "../../setup";

describe("Should properly create expenses", () => {
  test("should return an error if no valid count id is provided", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
      },
    });

    expect(result.payload).toContain(
      "Cannot find a count associated with your expense."
    );
    expect(result.statusCode).toEqual(500);
  });

  test("should return an error if a user is missing inside the count participants", async () => {
    const createdCount = await Count.create(newCount);

    const result = await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
        owers: [
          "eric",
          "louise",
          "andré",
          "elisabeth",
          "firmin",
          "olivier",
          "alex",
        ],
        count: createdCount.id,
      },
    });

    expect(result.payload).toContain(
      "One or more participant isn't associated with this count."
    );
    expect(result.statusCode).toEqual(500);
  });

  test("should create an expense", async () => {
    const createdCount = await app.inject({
      method: "POST",
      url: "/counts",
      payload: countBody,
    });

    const result = await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
        count: createdCount.json().id,
      },
    });

    expect(result.payload).toContain(newExpense.title);
    expect(result.statusCode).toEqual(201);
  });

  test("should not create an expense with negative amount", async () => {
    const createdCount = await Count.create(newCount);

    const result = await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
        amount: -1500,
        count: createdCount.id,
      },
    });

    expect(result.payload).toContain("body.amount should be >= 0");
    expect(result.statusCode).toEqual(400);
  });

  test("creating an expense updates the count doc.", async () => {
    const createdCount = await app.inject({
      method: "POST",
      url: "/counts",
      payload: countBody,
    });

    const result = await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
        count: createdCount.json().id,
      },
    });

    const updatedCount = await Count.findById(createdCount.json().id);

    expect(updatedCount?.total).toEqual(1500);
    expect(result.payload).toContain(updatedCount?.expenses[0].toString());
  });
});

describe("Should properly get expenses", () => {
  test("should return all expenses", async () => {
    const createdCount = await Count.create(newCount);
    const createdExpenseOne = await Expense.create({
      ...newExpense,
      count: createdCount.id,
    });
    const createdExpenseTwo = await Expense.create({
      ...newExpense,
      title: "other",
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "GET",
      url: "/expenses",
    });

    expect(result.payload).toContain(createdExpenseOne.title);
    expect(result.payload).toContain(createdExpenseTwo.title);
  });

  test("should return a newly created expense", async () => {
    const createdCount = await Count.create(newCount);
    const createdExpense = await Expense.create({
      ...newExpense,
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "GET",
      url: `/expenses/${createdExpense.id}`,
    });

    expect(result.payload).toContain(createdExpense.title);
    expect(result.payload).toContain(createdExpense.description);
  });
});

describe("Should properly udpate a newly created expense", () => {
  test("should update an expense", async () => {
    const createdCount = await Count.create(newCount);
    const createdExpense = await Expense.create({
      ...newExpense,
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "PUT",
      url: `/expenses/${createdExpense.id}`,
      payload: {
        title: "New title!",
      },
    });

    expect(result.payload).toContain("New title!");
  });

  test("should update the count data if an expense is edited.", async () => {
    const createdCount = await app.inject({
      method: "POST",
      url: "/counts",
      payload: countBody,
    });

    await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
        count: createdCount.json().id,
      },
    });

    await app.inject({
      method: "POST",
      url: "/expenses",
      payload: {
        ...newExpense,
        title: "other",
        count: createdCount.json().id,
      },
    });

    const updatedCount = await Count.findById(createdCount.json().id);

    expect(updatedCount?.total).toEqual(3000);

    await app.inject({
      method: "PUT",
      url: `/expenses/${updatedCount?.expenses[0]}`,
      payload: {
        amount: 9750,
      },
    });

    const countWithEditedExpense = await Count.findById(createdCount.json().id);

    expect(countWithEditedExpense?.total).toEqual(11250);
  });
});

describe("Should properly delete a newly created expense", () => {
  test("should delete an expense", async () => {
    const createdCount = await Count.create(newCount);
    const createdExpense = await Expense.create({
      ...newExpense,
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "DELETE",
      url: `/expenses/${createdExpense.id}`,
    });

    expect(result.payload).toContain(
      "The expense made by alex with amount of  1500 was deleted."
    );
  });
});
