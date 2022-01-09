import { ParticipantDoc } from "../../schemas/participant";
import { User, UserDoc } from "../../schemas/user";

export const linkUserToParticipantAndCount = async (
  participant: ParticipantDoc,
  userId: UserDoc
) => {
  const userToUpdate = await User.findById(userId).populate("counts");
  if (!userToUpdate) {
    throw new Error("Error while tagging your to count.");
  }
  const countOfParticipant = participant.count;

  countOfParticipant?.participants.forEach((p) => {
    if (p.user?.toString() === userToUpdate.id) {
      p.user = undefined;
      p.save();
    }
  });

  participant.user = userId;

  userToUpdate?.counts.push(participant.count);

  userToUpdate.save();

  participant.save();
};
