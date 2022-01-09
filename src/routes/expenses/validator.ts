import { Type, Static } from "@sinclair/typebox";
import {
  RouteShorthandOptionsWithHandler,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
} from "fastify";
import { RouteGenericInterface } from "fastify/types/route";

// GET ONE EXPENSE TYPES ------------------------------
export const GetOneExpenseParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export type GetOneExpenseParams = Static<typeof GetOneExpenseParamsJson>;

export interface GetOneExpenseRequest extends RouteGenericInterface {
  Params: GetOneExpenseParams;
}

export type GetOneExpense = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  GetOneExpenseRequest
>;

// CREATE AN EXPENSE TYPES ------------------------------
export const CreateExpenseBodyJson = Type.Object(
  {
    title: Type.String(),
    description: Type.Optional(Type.String()),
    currency: Type.Optional(Type.String()),
    amount: Type.Optional(Type.Number({ minimum: 0 })),
    mutatedBy: Type.String(),
    customPayers: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String(),
          customAmount: Type.Number(),
        })
      )
    ),
    customOwers: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String(),
          customAmount: Type.Number(),
        })
      )
    ),
    payers: Type.Array(Type.String(), { minItems: 1 }),
    owers: Type.Array(Type.String(), { minItems: 1 }),
    count: Type.String(),
  },
  { additionalProperties: false }
);

export type CreateExpenseBody = Static<typeof CreateExpenseBodyJson>;

export interface CreateExpenseRequest extends RouteGenericInterface {
  Body: CreateExpenseBody;
}

export type CreateExpense = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  CreateExpenseRequest
>;

// UPDATE AN EXPENSE TYPES ------------------------------
export const ExpenseIdParamsJson = Type.Object(
  {
    id: Type.String(),
  },
  { additionalProperties: false }
);

export type ExpenseIdParams = Static<typeof ExpenseIdParamsJson>;

export const UpdateExpenseBodyJson = Type.Object(
  {
    title: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    currency: Type.Optional(Type.String()),
    amount: Type.Optional(Type.Number()),
    mutatedBy: Type.Optional(Type.String()),
    customPayers: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String(),
          customAmount: Type.Number(),
        })
      )
    ),
    customOwers: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String(),
          customAmount: Type.Number(),
        })
      )
    ),
    payers: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
    owers: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
  },
  { additionalProperties: false }
);

export type UpdateExpenseBody = Static<typeof UpdateExpenseBodyJson>;

export interface UpdateExpenseRequest extends RouteGenericInterface {
  Params: ExpenseIdParams;
  Body: UpdateExpenseBody;
}

export type UpdateExpense = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  UpdateExpenseRequest
>;

// DELETE AN EXPENSE TYPES ------------------------------
export interface DeleteExpenseRequest extends RouteGenericInterface {
  Params: ExpenseIdParams;
}

export type DeleteExpense = RouteShorthandOptionsWithHandler<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  DeleteExpenseRequest
>;
