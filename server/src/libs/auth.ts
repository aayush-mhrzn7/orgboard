import { GraphQLError } from "graphql";
import type { Context } from "../context";

export function requireUser(context: Context) {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.user;
}

export function notFound(message: string): never {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
