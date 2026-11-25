import { asc, eq, gt } from "drizzle-orm";
import db from "../../db";
import { users } from "../../db/schema";
import type { Context } from "../../context";
import { requireUser } from "../../libs/auth";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "../../libs/cookies";
import { generateToken, verifyToken } from "../../libs/jwt";
import type { Resolvers } from "../../types/generated";
import { pageSize, paginate } from "../shared/pagination";
import {
  apiError,
  authSuccess,
  messageSuccess,
  userSuccess,
} from "../shared/response";

function issueTokens(context: Context, userId: string) {
  const accessToken = generateToken(userId, "access");
  const refreshToken = generateToken(userId, "refresh");
  setRefreshToken(context.res, refreshToken);
  return accessToken;
}

const resolvers: Resolvers = {
  Mutation: {
    signup: async (_parent, args, context) => {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, args.email))
        .limit(1);
      if (existing[0]) {
        return apiError("Email already in use", "BAD_USER_INPUT");
      }

      const [user] = await db
        .insert(users)
        .values({
          name: args.name,
          email: args.email,
          password: args.password,
        })
        .returning();
      if (!user) return apiError("Failed to create user", "INTERNAL");

      const accessToken = issueTokens(context, user.id);
      return authSuccess("User created successfully", accessToken, user);
    },

    login: async (_parent, args, context) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, args.email))
        .limit(1);

      if (!user || user.password !== args.password) {
        return apiError("Invalid email or password", "UNAUTHENTICATED");
      }

      const accessToken = issueTokens(context, user.id);
      return authSuccess("Login successful", accessToken, user);
    },

    logout: async (_parent, _args, context) => {
      clearRefreshToken(context.res);
      return messageSuccess("Logged out");
    },

    refreshToken: async (_parent, _args, context) => {
      const token = getRefreshToken(context.req);
      if (!token) {
        return apiError("No refresh token", "UNAUTHENTICATED");
      }

      let payload;
      try {
        payload = verifyToken(token, "refresh");
      } catch {
        clearRefreshToken(context.res);
        return apiError("Invalid refresh token", "UNAUTHENTICATED");
      }

      const accessToken = issueTokens(context, payload.userId);
      return authSuccess("Token refreshed", accessToken);
    },

    updateUser: async (_parent, args, context) => {
      const auth = requireUser(context);
      const [user] = await db
        .update(users)
        .set({
          ...(typeof args.name === "string" ? { name: args.name } : {}),
          ...(typeof args.email === "string" ? { email: args.email } : {}),
          ...(typeof args.password === "string" ? { password: args.password } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, auth.userId))
        .returning();
      if (!user) return apiError("User not found", "NOT_FOUND");
      return userSuccess("User updated", user);
    },
  },

  Query: {
    me: async (_parent, _args, context) => {
      const auth = requireUser(context);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, auth.userId))
        .limit(1);
      return user ?? null;
    },

    users: async (_parent, args, context) => {
      requireUser(context);
      const first = pageSize(args.first);
      const rows = await db
        .select()
        .from(users)
        .where(args.after ? gt(users.id, args.after) : undefined)
        .orderBy(asc(users.id))
        .limit(first + 1);
      return paginate(rows, first);
    },
  },
};

export default resolvers;
