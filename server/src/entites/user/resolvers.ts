import { GraphQLError } from "graphql";
import { eq } from "drizzle-orm";
import db from "../../db";
import { users } from "../../db/schema";
import type { Context } from "../../context";
import { clearRefreshToken, getRefreshToken, setRefreshToken } from "../../libs/cookies";
import { generateToken, verifyToken } from "../../libs/jwt";

function requireUser(context: Context) {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.user;
}

function issueTokens(context: Context, userId: string) {
  const accessToken = generateToken(userId, "access");
  const refreshToken = generateToken(userId, "refresh");
  setRefreshToken(context.res, refreshToken);
  return accessToken;
}

const resolvers = {
  Mutation: {
    signup: async (
      _parent: unknown,
      args: { name: string; email: string; password: string },
      context: Context,
    ) => {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, args.email))
        .limit(1);
      if (existing[0]) {
        throw new GraphQLError("Email already in use", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const [user] = await db
        .insert(users)
        .values({
          name: args.name,
          email: args.email,
          password: args.password,
        })
        .returning();

      const accessToken = issueTokens(context, user!.id);
      return {
        message: "User created successfully",
        status: "success",
        accessToken,
        data: user,
      };
    },

    login: async (
      _parent: unknown,
      args: { email: string; password: string },
      context: Context,
    ) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, args.email))
        .limit(1);

      if (!user || user.password !== args.password) {
        throw new GraphQLError("Invalid email or password", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const accessToken = issueTokens(context, user.id);
      return {
        message: "Login successful",
        status: "success",
        accessToken,
        data: user,
      };
    },

    logout: async (_parent: unknown, _args: unknown, context: Context) => {
      clearRefreshToken(context.res);
      return {
        message: "Logged out",
        status: "success",
      };
    },

    refreshToken: async (_parent: unknown, _args: unknown, context: Context) => {
      const token = getRefreshToken(context.req);
      if (!token) {
        throw new GraphQLError("No refresh token", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      let payload;
      try {
        payload = verifyToken(token, "refresh");
      } catch {
        clearRefreshToken(context.res);
        throw new GraphQLError("Invalid refresh token", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const accessToken = issueTokens(context, payload.userId);
      return {
        message: "Token refreshed",
        status: "success",
        accessToken,
      };
    },

    updateUser: async (
      _parent: unknown,
      args: { name?: string; email?: string; password?: string },
      context: Context,
    ) => {
      const auth = requireUser(context);
      const [user] = await db
        .update(users)
        .set({
          ...(args.name !== undefined ? { name: args.name } : {}),
          ...(args.email !== undefined ? { email: args.email } : {}),
          ...(args.password !== undefined ? { password: args.password } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, auth.userId))
        .returning();
      return user;
    },
  },

  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      const auth = requireUser(context);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, auth.userId))
        .limit(1);
      return user ?? null;
    },

    users: async () => {
      return db.select().from(users);
    },
  },
};

export default resolvers;
