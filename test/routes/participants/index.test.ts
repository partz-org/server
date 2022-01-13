import { Count } from "../../../src/schemas/count";
import { Participant } from "../../../src/schemas/participant";
import { countBody, newCount, newParticipant } from "../../mocks";
import { app } from "../../setup";

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
    const createdCount = await app.inject({
      method: "POST",
      url: "/counts",
      payload: countBody,
    });

    const result = await app.inject({
      method: "POST",
      url: "/participants",
      payload: {
        ...newParticipant,
        count: createdCount.json().id,
      },
    });

    const updatedCount = await Count.findById(createdCount.json().id);

    expect(updatedCount?.participants.toString()).toContain(result.json().id);
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

describe.skip("Should properly udpate a newly created participant", () => {
  test("should update an participant", async () => {
    const createdCount = await Count.create(newCount);
    const createdParticipant = await Participant.create({
      ...newParticipant,
      count: createdCount.id,
    });

    const result = await app.inject({
      method: "PUT",
      url: `/participants/${createdParticipant.id}`,
      payload: {
        title: "New title!",
      },
    });

    expect(result.payload).toContain("New title!");
  });

  test("should update the count data if an participant is edited.", async () => {
    const createdCount = await app.inject({
      method: "POST",
      url: "/counts",
      payload: countBody,
    });

    await app.inject({
      method: "POST",
      url: "/participants",
      payload: {
        ...newParticipant,
        count: createdCount.json().id,
      },
    });

    await app.inject({
      method: "POST",
      url: "/participants",
      payload: {
        ...newParticipant,
        title: "other",
        count: createdCount.json().id,
      },
    });

    const updatedCount = await Count.findById(createdCount.json().id);

    expect(updatedCount?.total).toEqual(3000);

    await app.inject({
      method: "PUT",
      url: `/participants/${updatedCount?.participants[0]}`,
      payload: {
        amount: 9750,
      },
    });

    const countWithEditedParticipant = await Count.findById(
      createdCount.json().id
    );

    expect(countWithEditedParticipant?.total).toEqual(11250);
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
