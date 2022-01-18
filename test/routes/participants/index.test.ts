import { Count } from "../../../src/schemas/count";
import { Participant } from "../../../src/schemas/participant";
import { createUserWithToken } from "../../helpers";
import { countBody, newCount, newParticipant } from "../../mocks";
import { app } from "../../setup";

let userToken: string;
let userId: string;
beforeAll(async () => {
  const { token, id } = await createUserWithToken();
  userToken = token;
  userId = id;
});

const postCount = async (payload: any) =>
  (
    await app.inject({
      method: "POST",
      url: "/counts",
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      payload: payload,
    })
  ).json();

describe("Should properly create participants", () => {
  test("should create a participant", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/participants",
      payload: newParticipant,
    });

    expect(result.payload).toContain(newParticipant.name);
    expect(result.statusCode).toEqual(201);
  });

  test("should not create an participant with negative balance", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/participants",
      payload: {
        ...newParticipant,
        balance: -1500,
      },
    });

    expect(result.payload).toContain("body.balance should be >= 0");
    expect(result.statusCode).toEqual(400);
  });

  test("creating an participant updates the count doc.", async () => {
    const createdCount = await postCount(countBody);

    const result = (
      await app.inject({
        method: "POST",
        url: "/participants",
        payload: {
          ...newParticipant,
          count: createdCount.id,
        },
      })
    ).json();

    const updatedCount = await Count.findById(createdCount.id);

    expect(updatedCount?.participants.toString()).toContain(result.id);
  });
});

describe("Should properly get participants", () => {
  test("should return all participants", async () => {
    const createdCount = await Count.create(newCount);
    const createdParticipantOne = await Participant.create({
      ...newParticipant,
      count: createdCount.id,
    });
    const createdParticipantTwo = await Participant.create({
      ...newParticipant,
      title: "other",
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "GET",
      url: "/participants",
    });

    expect(result.payload).toContain(createdParticipantOne.name);
    expect(result.payload).toContain(createdParticipantTwo.name);
  });

  test("should return a newly created participant", async () => {
    const createdCount = await Count.create(newCount);
    const createdParticipant = await Participant.create({
      ...newParticipant,
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "GET",
      url: `/participants/${createdParticipant.id}`,
    });

    expect(result.payload).toContain(createdParticipant.name);
  });
});

describe("Should properly udpate a newly created participant", () => {
  test("should tag a user to a participant", async () => {
    const createdCount = await Count.create(newCount);

    const createdParticipant = await Participant.create({
      ...newParticipant,
      count: createdCount.id,
    });

    const result = (
      await app.inject({
        method: "PUT",
        url: `/participants/${createdParticipant.id}`,
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      })
    ).json();

    expect(result.name).toEqual("andré");
    expect(result.user).toEqual(userId);
  });
});

describe("Should properly delete a participant", () => {
  test("should delete an participant", async () => {
    const createdCount = await Count.create(newCount);
    const createdParticipant = await Participant.create({
      ...newParticipant,
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "DELETE",
      url: `/participants/${createdParticipant.id}`,
    });

    expect(result.payload).toEqual(
      '{"message":"Success! The participant andré was deleted from the count"}'
    );
  });
});
