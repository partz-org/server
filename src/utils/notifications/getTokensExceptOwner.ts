import { ParticipantDoc } from "../../schemas/participant";

export const getTokensExceptOwner = (
  participants: ParticipantDoc[],
  owner?: string
) =>
  participants
    .filter((p) => p.name !== owner)
    .map((p) => p.user?.expoToken)
    .filter(Boolean) as string[];
