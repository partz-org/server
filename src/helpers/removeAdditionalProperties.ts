import { FastifySchema } from "fastify";

export const removeAdditionalProperties = (
  body: Record<string, unknown>
): FastifySchema["body"] => {
  return { ...body, additionalProperties: false };
};
