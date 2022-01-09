import { Type, Static } from "@sinclair/typebox";
import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteShorthandOptionsWithHandler,
} from "fastify";
import { RouteGenericInterface } from "fastify/types/route";

// GET ONE PARTICIPANT TYPES ------------------------------
export const GetOneParticipantParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export type GetOneParticipantParams = Static<
  typeof GetOneParticipantParamsJson
>;

export interface GetOneParticipantRequest extends RouteGenericInterface {
  Params: GetOneParticipantParams;
}

export type GetOneParticipant = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  GetOneParticipantRequest
>;

// CREATE ONE PARTICIPANT TYPES ------------------------------
export const CreateParticipantBodyJson = Type.Object(
  {
    name: Type.String(),
    count: Type.String(),
    user: Type.Optional(Type.String()),
    balance: Type.Number({ minimum: 0 }),
    credit: Type.Number({ minimum: 0 }),
    debit: Type.Number({ minimum: 0 }),
    debtors: Type.Optional(Type.Any()),
    creditors: Type.Optional(Type.Any()),
  },
  { additionalProperties: false }
);

export type CreateParticipantBody = Static<typeof CreateParticipantBodyJson>;

export interface CreateParticipantRequest extends RouteGenericInterface {
  Body: CreateParticipantBody;
}

export type CreateParticipant = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  CreateParticipantRequest
>;

// UPDATE ONE PARTICIPANT TYPES ------------------------------
export const ParticipantIdParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export type ParticipantIdParams = Static<typeof ParticipantIdParamsJson>;

export const UpdateParticipantBodyJson = Type.Object(
  {
    user: Type.String(),
  },
  { additionalProperties: false }
);

export type UpdateParticipantBody = Static<typeof UpdateParticipantBodyJson>;

export interface UpdateParticipantRequest extends RouteGenericInterface {
  Params: ParticipantIdParams;
  Body: UpdateParticipantBody;
}

export type UpdateParticipant = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  UpdateParticipantRequest
>;

// DELETE ONE PARTICIPANT TYPES ------------------------------
export interface DeleteParticipantRequest extends RouteGenericInterface {
  Params: ParticipantIdParams;
}

export type DeleteParticipant = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  DeleteParticipantRequest
>;
