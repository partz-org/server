import { CountDoc } from "../schemas/count";

export const hasSomeParitcipantsInCount = (
  count: CountDoc,
  participants: string[]
) => {
  const countParticipantNames = count.participants.map((p) => p.name);
  const hasSomeParticipantsAlreadyInCount = participants.some((participant) =>
    countParticipantNames.includes(participant)
  );

  return hasSomeParticipantsAlreadyInCount;
};
