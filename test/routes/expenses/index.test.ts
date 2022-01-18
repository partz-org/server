import { Count } from "../../../src/schemas/count";
import { Expense } from "../../../src/schemas/expense";
import { createUserWithToken } from "../../helpers";
import { countBody, newCount, newExpense } from "../../mocks";
import { app } from "../../setup";

let userToken: string;
beforeAll(async () => {
  const { token } = await createUserWithToken();
  userToken = token;
});

const postExpense = async (payload: any) =>
  await app.inject({
    method: "POST",
    url: "/expenses",
    headers: {
      authorization: `Bearer ${userToken}`,
    },
    payload: payload,
  });

const putExpense = async (id: string, payload: any) =>
  await app.inject({
    method: "PUT",
    url: `/expenses/${id}`,
    headers: {
      authorization: `Bearer ${userToken}`,
    },
    payload: payload,
  });

describe("Should properly create expenses", () => {
  test("should return an error if no valid count id is provided", async () => {
    const result = await postExpense(newExpense);

    expect(result.payload).toContain(
      "Cannot find a count associated with your expense."
    );
    expect(result.statusCode).toEqual(500);
  });

  test("should return an error if a user is missing inside the count participants", async () => {
    const createdCount = await Count.create(newCount);

    const result = await postExpense({
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
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      payload: countBody,
    });

    const result = await postExpense({
      ...newExpense,
      count: createdCount.json().id,
    });

    expect(result.payload).toContain(newExpense.title);
    expect(result.statusCode).toEqual(201);
  });

  test("should not create an expense with negative amount", async () => {
    const createdCount = await Count.create(newCount);

    const result = await postExpense({
      ...newExpense,
      amount: -1500,
      count: createdCount.id,
    });

    expect(result.payload).toContain("body.amount should be >= 0");
    expect(result.statusCode).toEqual(400);
  });

  test("creating an expense updates the count doc.", async () => {
    const createdCount = await app.inject({
      method: "POST",
      url: "/counts",
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      payload: countBody,
    });

    const result = await postExpense({
      ...newExpense,
      count: createdCount.json().id,
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

    putExpense;

    const result = await putExpense(createdExpense.id, {
      title: "New title!",
    });

    expect(result.payload).toContain("New title!");
  });

  test("should update the count data if an expense is edited.", async () => {
    const createdCount = (
      await app.inject({
        method: "POST",
        url: "/counts",
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: countBody,
      })
    ).json();

    await app.inject({
      method: "POST",
      url: "/expenses",
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      payload: {
        ...newExpense,
        count: createdCount.id,
      },
    });

    await app.inject({
      method: "POST",
      url: "/expenses",
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      payload: {
        ...newExpense,
        title: "other",
        count: createdCount.id,
      },
    });

    const updatedCount = await Count.findById(createdCount.id).populate(
      "expenses"
    );

    expect(updatedCount?.total).toEqual(3000);

    (
      await putExpense(updatedCount?.expenses[0].id, {
        amount: 9750,
      })
    ).json();

    const countWithEditedExpense = await Count.findById(createdCount.id);

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
