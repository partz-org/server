import { Count } from "../../../src/schemas/count";
import { createUserWithToken } from "../../helpers";
import { newCount, countBody } from "../../mocks";
import { app } from "../../setup";

let userToken: string;
beforeAll(async () => {
  const { token } = await createUserWithToken();
  userToken = token;
});

const postCount = async (payload: any) =>
  await app.inject({
    method: "POST",
    url: "/counts",
    headers: {
      authorization: `Bearer ${userToken}`,
    },
    payload: payload,
  });

describe("Should properly create a count", () => {
  test("should create a count and send its data in response payload", async () => {
    const result = await postCount(countBody);
    const createdCount = result.json();

    expect(createdCount.title).toEqual(newCount.title);
    expect(result.statusCode).toEqual(201);
  });
});

describe("Should properly get counts", () => {
  test("should return all counts", async () => {
    const createdCountOne = await Count.create(newCount);
    const createdCountTwo = await Count.create({
      ...newCount,
      title: "Second Count",
    });

    const result = await app.inject({
      method: "GET",
      url: "/counts?all=true",
    });

    expect(result.payload).toContain(createdCountOne.title);
    expect(result.payload).toContain(createdCountTwo.title);
  });
});

describe("Should properly udpate a newly created count", () => {
  test("should update the count with new data", async () => {
    const createdCount = (await postCount(countBody)).json();

    const result = await app.inject({
      method: "PUT",
      url: `/counts/${createdCount.id}`,
      payload: {
        title: "New title!",
      },
    });

    expect(result.payload).toContain("New title!");
  });
});

describe("Should properly delete a newly created count", () => {
  test("should delete an count", async () => {
    const createdCount = await Count.create(newCount);

    const result = await app.inject({
      method: "DELETE",
      url: `/counts/${createdCount.id}`,
    });

    expect(result.payload).toContain(
      `Your count ${createdCount.title} was deleted.`
    );
  });
});
