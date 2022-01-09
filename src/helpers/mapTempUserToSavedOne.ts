import { Count } from "../schemas/count";
import { Participant } from "../schemas/participant";
import { UserDoc, User } from "../schemas/user";

export const mapTempUserToSavedOne = async (
  tempUserId: UserDoc,
  storedUser: UserDoc
) => {
  const userCounts = await Count.find({
    creatorId: tempUserId,
  });

  userCounts.forEach(async (count) => {
    if (!storedUser.counts.includes(count.id)) {
      count.creatorId = storedUser;
      storedUser.counts.push(count.id);
      await count.save();
    }
  });

  const userParticipants = await Participant.find({ user: tempUserId });

  userParticipants.forEach(async (participant) => {
    participant.user === storedUser;
    await participant.save();
  });

  User.findByIdAndRemove(tempUserId);
};
