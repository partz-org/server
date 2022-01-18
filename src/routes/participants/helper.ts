import { ParticipantDoc } from "../../schemas/participant";
import { User, UserDoc } from "../../schemas/user";

export const linkUserToParticipantAndCount = async (
  participant: ParticipantDoc,
  userId: UserDoc
) => {
  const userToUpdate = await User.findById(userId).populate("counts");

  if (!userToUpdate) {
    throw new Error("Error while tagging you to count.");
  }

  const countOfParticipant = participant.count;

  // If User was already tagged to a participant of this count, remove him.
  for (const p of countOfParticipant.participants) {
    if (p.user?.toString() === userToUpdate.id) {
      p.user = undefined;
      await p.save();
    }
  }

  participant.user = userId;

  userToUpdate.counts.push(participant.count);

  await countOfParticipant.save();

  await userToUpdate.save();

  await participant.save();
};
