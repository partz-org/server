import { ParticipantDoc } from "../../schemas/participant";

export const findCurrentUserParticipant = (
  participants: ParticipantDoc[],
  userId: string
) => participants.find((participant) => participant.user?.id === userId)?.name;
