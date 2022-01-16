import { hasSomeParitcipantsInCount } from "../../helpers/hasSomeParitcipantsInCount";
import { CountDoc } from "../../schemas/count";
import { Participant } from "../../schemas/participant";

export const addNewParticipants = async (
  countToUpdate: CountDoc,
  participantsToAdd: string[]
) => {
  if (hasSomeParitcipantsInCount(countToUpdate, participantsToAdd)) {
    throw new Error(
      "One of the participants with the same name already exists in this count."
    );
  }
  for await (const newParticipant of participantsToAdd) {
    const createdParticipant = await Participant.create({
      name: newParticipant,
      count: countToUpdate.id,
    });
    countToUpdate.participants.push(createdParticipant);
  }
};
