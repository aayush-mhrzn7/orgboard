import { and, asc, desc, eq, gt } from "drizzle-orm";
import db from "../../db";
import { organizations, organizationUsers, posts, users } from "../../db/schema";
import type { organizationType, organizationUserType } from "../../db/schema";
import { notFound, requireUser } from "../../libs/auth";
import type { Resolvers } from "../../types/generated";
import { postsAfter, toPost } from "../posts/resolvers";
import { pageSize, paginate } from "../shared/pagination";
import {
  apiError,
  membershipSuccess,
  organizationSuccess,
} from "../shared/response";
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
    organizationUsers: async (parent, args, context) => {
      requireUser(context);
      const first = pageSize(args.first);
      const rows = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.organizationId, parent.id),
            args.after ? gt(organizationUsers.userId, args.after) : undefined,
          ),
        )
        .orderBy(asc(organizationUsers.userId))
        .limit(first + 1);
      return paginate(rows.map(toOrganizationUser), first, (r) => r.userId);
    },

    posts: async (parent, args, context) => {
      requireUser(context);
      const first = pageSize(args.first);
      const rows = await db
        .select()
        .from(posts)
        .where(
          and(eq(posts.organizationId, parent.id), await postsAfter(args.after)),
        )
        .orderBy(desc(posts.createdAt), desc(posts.id))
        .limit(first + 1);
      return paginate(rows.map(toPost), first);
    },
  },

  OrganizationUser: {
    user: async (parent, _args, context) => {
      requireUser(context);
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
        return apiError("Failed to create organization", "INTERNAL");
      }
      await db.insert(organizationUsers).values({
        organizationId: organization.id,
        userId: auth.userId,
      });
      return organizationSuccess(
        "Organization created",
        toOrganization(organization),
      );
    },

    updateOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [organization] = await db
        .update(organizations)
        .set({ name: args.name, updatedAt: new Date() })
        .where(eq(organizations.id, args.id))
        .returning();
      if (!organization) return apiError("Organization not found", "NOT_FOUND");
      return organizationSuccess(
        "Organization updated",
        toOrganization(organization),
      );
    },

    deleteOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [organization] = await db
        .delete(organizations)
        .where(eq(organizations.id, args.id))
        .returning();
      if (!organization) return apiError("Organization not found", "NOT_FOUND");
      return organizationSuccess(
        "Organization deleted",
        toOrganization(organization),
      );
    },

    addUserToOrganization: async (_parent, args, context) => {
      requireUser(context);
      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, args.organizationId))
        .limit(1);
      if (!organization) return apiError("Organization not found", "NOT_FOUND");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, args.userId))
        .limit(1);
      if (!user) return apiError("User not found", "NOT_FOUND");

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
        return apiError(
          "User is already in this organization",
          "BAD_USER_INPUT",
        );
      }

      await db.insert(organizationUsers).values({
        organizationId: args.organizationId,
        userId: args.userId,
      });
      return membershipSuccess("User added to organization");
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
      if (!removed) return apiError("Membership not found", "NOT_FOUND");
      return membershipSuccess("User removed from organization");
    },
  },

  Query: {
    organizations: async (_parent, args, context) => {
      const auth = requireUser(context);
      const first = pageSize(args.first);
      const rows = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          createdAt: organizations.createdAt,
          updatedAt: organizations.updatedAt,
        })
        .from(organizations)
        .innerJoin(
          organizationUsers,
          eq(organizationUsers.organizationId, organizations.id),
        )
        .where(
          and(
            eq(organizationUsers.userId, auth.userId),
            args.after ? gt(organizations.id, args.after) : undefined,
          ),
        )
        .orderBy(asc(organizations.id))
        .limit(first + 1);
      return paginate(rows.map(toOrganization), first);
    },

    organization: async (_parent, args, context) => {
      const auth = requireUser(context);
      const [organization] = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          createdAt: organizations.createdAt,
          updatedAt: organizations.updatedAt,
        })
        .from(organizations)
        .innerJoin(
          organizationUsers,
          eq(organizationUsers.organizationId, organizations.id),
        )
        .where(
          and(
            eq(organizations.id, args.id),
            eq(organizationUsers.userId, auth.userId),
          ),
        )
        .limit(1);
      return organization ? toOrganization(organization) : null;
    },

    organizationUsers: async (_parent, args, context) => {
      requireUser(context);
      const first = pageSize(args.first);
      const rows = await db
        .select()
        .from(organizationUsers)
        .where(
          and(
            eq(organizationUsers.organizationId, args.organizationId),
            args.after ? gt(organizationUsers.userId, args.after) : undefined,
          ),
        )
        .orderBy(asc(organizationUsers.userId))
        .limit(first + 1);
      return paginate(rows.map(toOrganizationUser), first, (r) => r.userId);
    },
  },
};

export default resolvers;
