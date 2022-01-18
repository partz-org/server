import { Type, Static } from "@sinclair/typebox";
import {
  RouteShorthandOptionsWithHandler,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
} from "fastify";
import { RouteGenericInterface } from "fastify/types/route";

// GET ONE USER TYPES ------------------------------
export const UserIdParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export type GetOneUserParams = Static<typeof UserIdParamsJson>;

export interface GetOneUserRequest extends RouteGenericInterface {
  Params: GetOneUserParams;
}

export type GetOneUser = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  GetOneUserRequest
>;

export type UserIdParams = Static<typeof UserIdParamsJson>;

// CREATE A TEMP USER TYPES ------------------------------
export const CreateTempUserBodyJson = Type.Object(
  {
    expoToken: Type.String(),
    email: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    password: Type.Optional(Type.String()),
    phoneNumber: Type.Optional(Type.String()),
  },
  { additionalProperties: false }
);

export type CreateTempUserBody = Static<typeof CreateTempUserBodyJson>;

export interface CreateTempUserRequest extends RouteGenericInterface {
  Body: CreateTempUserBody;
}

export type CreateTempUser = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  CreateTempUserRequest
>;

// UPDATE ONE USER TYPES ------------------------------
export const UpdateUserBodyJson = Type.Object(
  {
    email: Type.Optional(Type.String()),
    expoToken: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    password: Type.Optional(Type.String()),
    phoneNumber: Type.Optional(Type.String()),
  },
  { additionalProperties: false }
);

export type UpdateUserBody = Static<typeof UpdateUserBodyJson>;

export interface UpdateUserRequest extends RouteGenericInterface {
  Params: UserIdParams;
  Body: UpdateUserBody;
}

export type UpdateUser = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  UpdateUserRequest
>;

// DELETE ONE USER TYPES ------------------------------
export interface DeleteUserRequest extends RouteGenericInterface {
  Params: UserIdParams;
}

export type DeleteUser = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  DeleteUserRequest
>;
