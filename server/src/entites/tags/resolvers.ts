import { eq } from "drizzle-orm";
import db from "../../db";
import { tags } from "../../db/schema";
import type { tagType } from "../../db/schema";
import { requireUser } from "../../libs/auth";
import type { Resolvers } from "../../types/generated";
import { apiError, tagSuccess } from "../shared/response";

function toTag(row: tagType) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const resolvers: Resolvers = {
  Mutation: {
    createTag: async (_parent, args, context) => {
      requireUser(context);
      const [tag] = await db
        .insert(tags)
        .values({ name: args.name })
        .returning();
      if (!tag) return apiError("Failed to create tag", "INTERNAL");
      return tagSuccess("Tag created", toTag(tag));
    },

    updateTag: async (_parent, args, context) => {
      requireUser(context);
      const [tag] = await db
        .update(tags)
        .set({ name: args.name, updatedAt: new Date() })
        .where(eq(tags.id, args.id))
        .returning();
      if (!tag) return apiError("Tag not found", "NOT_FOUND");
      return tagSuccess("Tag updated", toTag(tag));
    },

    deleteTag: async (_parent, args, context) => {
      requireUser(context);
      const [tag] = await db
        .delete(tags)
        .where(eq(tags.id, args.id))
        .returning();
      if (!tag) return apiError("Tag not found", "NOT_FOUND");
      return tagSuccess("Tag deleted", toTag(tag));
    },
  },

  Query: {
    tags: async () => {
      const rows = await db.select().from(tags);
      return rows.map(toTag);
    },

    tag: async (_parent, args) => {
      const [tag] = await db
        .select()
        .from(tags)
        .where(eq(tags.id, args.id))
        .limit(1);
      return tag ? toTag(tag) : null;
    },
  },
};

export default resolvers;
