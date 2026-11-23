import { GraphQLError } from "graphql";
import { and, eq } from "drizzle-orm";
import db from "../../db";
import { organizations, organizationUsers, posts, users } from "../../db/schema";
import type { organizationType, organizationUserType } from "../../db/schema";
import { notFound, requireUser } from "../../libs/auth";
import type { Resolvers } from "../../types/generated";
import { toPost } from "../posts/resolvers";
import type { OrganizationParent, OrganizationUserParent } from "./types";

function toOrganization(row: organizationType): OrganizationParent {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toOrganizationUser(row: organizationUserType): OrganizationUserParent {
  return {
    organizationId: row.organizationId!,
    userId: row.userId!,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const resolvers: Resolvers = {
  Organization: {
    organizationUsers: async (parent) => {
      const rows = await db
        .select()
        .from(organizationUsers)
        .where(eq(organizationUsers.organizationId, parent.id));
      return rows.map(toOrganizationUser);
    },

    posts: async (parent) => {
      const rows = await db
        .select()
        .from(posts)
        .where(eq(posts.organizationId, parent.id));
      return rows.map(toPost);
    },
  },

  OrganizationUser: {
    user: async (parent) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parent.userId))
        .limit(1);
      if (!user) notFound("User not found");
      return user;
    },
  },

  Mutation: {
    createOrganization: async (_parent, args, context) => {
      const auth = requireUser(context);
      const [organization] = await db
        .insert(organizations)
        .values({ name: args.name })
        .returning();
      if (!organization) {
        throw new GraphQLError("Failed to create organization");
      }
      await db.insert(organizationUsers).values({
        organizationId: organization.id,
        userId: auth.userId,
      });
      return toOrganization(organization);
    },

    updateOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [organization] = await db
        .update(organizations)
        .set({ name: args.name, updatedAt: new Date() })
        .where(eq(organizations.id, args.id))
        .returning();
      if (!organization) notFound("Organization not found");
      return toOrganization(organization);
    },

    deleteOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [organization] = await db
        .delete(organizations)
        .where(eq(organizations.id, args.id))
        .returning();
      if (!organization) notFound("Organization not found");
      return toOrganization(organization);
    },

    addUserToOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, args.organizationId))
        .limit(1);
      if (!organization) notFound("Organization not found");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, args.userId))
        .limit(1);
      if (!user) notFound("User not found");

      const [existing] = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.organizationId, args.organizationId),
            eq(organizationUsers.userId, args.userId),
          ),
        )
        .limit(1);
      if (existing) {
        throw new GraphQLError("User is already in this organization", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      await db.insert(organizationUsers).values({
        organizationId: args.organizationId,
        userId: args.userId,
      });
      return true;
    },

    removeUserFromOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [removed] = await db
        .delete(organizationUsers)
        .where(
          and(
            eq(organizationUsers.organizationId, args.organizationId),
            eq(organizationUsers.userId, args.userId),
          ),
        )
        .returning();
      if (!removed) notFound("Membership not found");
      return true;
    },
  },

  Query: {
    organizations: async () => {
      const rows = await db.select().from(organizations);
      return rows.map(toOrganization);
    },

    organization: async (_parent, args) => {
      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, args.id))
        .limit(1);
      return organization ? toOrganization(organization) : null;
    },

    organizationUsers: async (_parent, args) => {
      const rows = await db
        .select()
        .from(organizationUsers)
        .where(eq(organizationUsers.organizationId, args.organizationId));
      return rows.map(toOrganizationUser);
    },
  },
};

export default resolvers;
