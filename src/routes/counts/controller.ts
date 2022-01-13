import { RouteShorthandOptionsWithHandler } from "fastify";
import { Count, CountDoc } from "../../schemas/count";
import { Expense } from "../../schemas/expense";
import { Participant } from "../../schemas/participant";
import { User } from "../../schemas/user";
import {
  CountIdParamsJson,
  CreateCount,
  CreateCountBodyJson,
  DeleteCount,
  GetOneCount,
  GetOneCountParamsJson,
  UpdateCount,
  UpdateCountBodyJson,
} from "./validator";
import { addNewParticipants } from "./helper";

export const getAllCounts: RouteShorthandOptionsWithHandler = {
  schema: {
    tags: ["counts"],
  },
  handler: async function (req, rep) {
    const allCounts = await Count.find({}).populate([
      "expenses",
      "participants",
    ]);

    rep.status(200).send(allCounts);
  },
};

export const getMyCounts: RouteShorthandOptionsWithHandler = {
  schema: {
    tags: ["counts"],
  },
  handler: async function (req, rep) {
    const {
      user: { id: userId },
    } = req;

    const userCounts = await Count.find({
      creatorId: userId,
    }).populate(["expenses", "participants"]);

    rep.status(200).send(userCounts);
  },
};

export const getOneCount: GetOneCount = {
  schema: {
    tags: ["counts"],
    params: GetOneCountParamsJson,
  },
  handler: async function (req, rep) {
    const countToFind = await Count.findById(req.params.id).populate([
      "expenses",
      "participants",
    ]);
    if (!countToFind) {
      throw new Error("No such count exists.");
    }

    return rep.send(countToFind);
  },
};

export const createCount: CreateCount = {
  schema: {
    tags: ["counts"],
    body: CreateCountBodyJson,
  },
  handler: async function (req, rep) {
    const {
      user: { id: userId },
    } = req;

    const newCountProps = req.body;

    const newParticipants = await Participant.insertMany(req.body.participants);

    const newCount = await new Count({
      ...newCountProps,
      creatorId: userId,
      participants: newParticipants.map((p) => p.id),
    }).populate(["expenses", "participants"]);

    newParticipants.forEach(async (p) => {
      p.count = newCount.id;
      // Tag user to participant
      if (p.name === req.body.userToTag) {
        p.user = userId;
      }
      await p.save();
    });

    const userToUpdate = await User.findById(userId);

    if (userToUpdate) {
      userToUpdate.counts = userToUpdate.counts.concat(newCount.id);
      await userToUpdate.save();
    }

    await newCount.save();

    rep.status(201).send(newCount);
  },
};

export const updateCount: UpdateCount = {
  schema: {
    tags: ["counts"],
    params: CountIdParamsJson,
    body: UpdateCountBodyJson,
  },
  handler: async function (req, rep) {
    const countToUpdate = await Count.findById(req.params.id).populate([
      "expenses",
      "participants",
    ]);

    if (!countToUpdate) {
      throw new Error("Your count wasn't found");
    }

    countToUpdate.title = req.body.title || countToUpdate.title;
    countToUpdate.description =
      req.body.description || countToUpdate.description;

    if (req.body.participantsToAdd) {
      await addNewParticipants(countToUpdate, req.body.participantsToAdd);
    }

    countToUpdate.save();

    rep.send(countToUpdate);
  },
};

export const deleteCount: DeleteCount = {
  schema: {
    tags: ["counts"],
    params: CountIdParamsJson,
  },
  handler: async function (req, rep) {
    const countId = req.params.id;
    const countToDelete = await Count.findById(countId);

    if (!countToDelete) {
      throw new Error("Couldn't find your count to delete.");
    }

    await Expense.deleteMany({ count: countId as unknown as CountDoc });

    await Participant.deleteMany({
      count: countId as unknown as CountDoc,
    });

    await countToDelete.delete();

    rep
      .status(200)
      .send({ message: `Your count ${countToDelete?.title} was deleted.` });
  },
};
