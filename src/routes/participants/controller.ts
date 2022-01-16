import { RouteHandlerMethod } from "fastify/types/route";
import { Count } from "../../schemas/count";
import { Participant } from "../../schemas/participant";
import { UserDoc } from "../../schemas/user";
import { linkUserToParticipantAndCount } from "./helper";
import {
  GetOneParticipant,
  GetOneParticipantParamsJson,
  CreateParticipant,
  CreateParticipantBodyJson,
  UpdateParticipant,
  ParticipantIdParamsJson,
  UpdateParticipantBodyJson,
  DeleteParticipant,
} from "./validator";

export const getAllParticipants: RouteHandlerMethod = async function (
  _req,
  rep
) {
  const allParticipants = await Participant.find({});
  rep.status(200).send(allParticipants);
};

export const getOneParticipant: GetOneParticipant = {
  schema: {
    tags: ["participants"],
    params: GetOneParticipantParamsJson,
  },
  handler: async function (req, rep) {
    const participantToFind = await Participant.findById(
      req.params.id
    ).populate({
      path: "count",
      populate: { path: "participants" },
    });

    if (!participantToFind) {
      throw new Error("Cannot find this Participant");
    }
    rep.send(participantToFind);
  },
};

export const createParticipant: CreateParticipant = {
  schema: {
    tags: ["participants"],
    body: CreateParticipantBodyJson,
  },
  handler: async function (req, rep) {
    const newParticipant = await new Participant(req.body).populate({
      path: "count",
      populate: { path: "participants" },
    });

    const CountToUpdate = await Count.findById(newParticipant.count);

    if (CountToUpdate) {
      CountToUpdate.participants.push(newParticipant);
      await CountToUpdate.save();
    }

    await newParticipant.save();

    rep.status(201).send(newParticipant);
  },
};

export const updateParticipant: UpdateParticipant = {
  schema: {
    tags: ["participants"],
    params: ParticipantIdParamsJson,
    body: UpdateParticipantBodyJson,
  },
  handler: async function (req, rep) {
    const participantToUpdate = await Participant.findById(
      req.params.id
    ).populate({ path: "count", populate: { path: "participants" } });

    if (!participantToUpdate) {
      throw new Error("Couldn't find the participant you selected.");
    }

    linkUserToParticipantAndCount(
      participantToUpdate,
      req.body.user as unknown as UserDoc
    );

    rep.send(participantToUpdate);
  },
};

export const deleteParticipant: DeleteParticipant = {
  schema: {
    tags: ["participants"],
    params: ParticipantIdParamsJson,
  },
  handler: async function (req, rep) {
    const participantToDelete = await Participant.findById(
      req.params.id
    ).populate({ path: "count", populate: { path: "expenses" } });

    if (!participantToDelete) {
      throw new Error("Couldn't find the participant you want to delete.");
    }

    const isTaggedInExpense = participantToDelete.count?.expenses?.some(
      (expense) => expense.owers.includes(participantToDelete?.name)
    );

    if (isTaggedInExpense) {
      throw new Error(
        "Please remove this user from all expenses before deleting him."
      );
    }

    participantToDelete.delete();
    rep.send({
      message: `Success! The participant ${participantToDelete.name} was deleted from the count`,
    });
  },
};
