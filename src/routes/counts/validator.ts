import { Static, Type } from "@sinclair/typebox";
import {
  RouteShorthandOptionsWithHandler,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
} from "fastify";
import { RouteGenericInterface } from "fastify/types/route";

// GET ONE COUNT TYPES ------------------------------
export const GetOneCountParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export type GetOneCountParams = Static<typeof GetOneCountParamsJson>;

export interface GetOneCountRequest extends RouteGenericInterface {
  Params: GetOneCountParams;
}

export type GetOneCount = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  GetOneCountRequest
>;

// CREATE A COUNT TYPES ------------------------------
export const CreateCountBodyJson = Type.Object(
  {
    title: Type.String(),
    description: Type.Optional(Type.String()),
    currency: Type.Optional(Type.String()),
    participants: Type.Array(
      Type.Object({
        name: Type.String(),
      })
    ),
    userToTag: Type.String(),
  },
  { additionalProperties: false }
);

export type CreateCountBody = Static<typeof CreateCountBodyJson>;

export interface CreateCountRequest extends RouteGenericInterface {
  Body: CreateCountBody;
}

export type CreateCount = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  CreateCountRequest
>;

// UPDATE A COUNT TYPES ------------------------------
export const CountIdParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export const UpdateCountBodyJson = Type.Object(
  {
    title: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    currency: Type.Optional(Type.Enum({ EUR: "EUR", USD: "USD", CAD: "CAD" })),
    participantsToAdd: Type.Optional(Type.Array(Type.String())),
  },
  { additionalProperties: false }
);

export type CountIdParams = Static<typeof CountIdParamsJson>;
export type UpdateCountBody = Static<typeof UpdateCountBodyJson>;

export interface UpdateCountRequest extends RouteGenericInterface {
  Params: CountIdParams;
  Body: UpdateCountBody;
}

export type UpdateCount = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  UpdateCountRequest
>;

// DELETE A COUNT TYPES ------------------------------
export interface DeleteCountRequest extends RouteGenericInterface {
  Params: CountIdParams;
}

export type DeleteCount = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  DeleteCountRequest
>;
