import { ParticipantDoc } from "../../schemas/participant";

export const getTokensExceptOwner = (
  participants: ParticipantDoc[],
  owner: string
) => {
  const tokens = participants
    .map((p) => {
      if (p.name === owner) return;

      return p.user?.expoToken;
    })
    .filter((p): p is string => !!p);

  return tokens;
};
