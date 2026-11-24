import { eq } from "drizzle-orm";
import db from "../../db";
import { organizations, posts, users } from "../../db/schema";
import type { postType } from "../../db/schema";
import { notFound, requireUser } from "../../libs/auth";
import type { Resolvers } from "../../types/generated";
import { apiError, postSuccess } from "../shared/response";
import type { PostParent } from "./types";

export function toPost(row: postType): PostParent {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    authorId: row.authorId,
    organizationId: row.organizationId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const resolvers: Resolvers = {
  Post: {
    author: async (parent, _args, context) => {
      requireUser(context);
      if (!parent.authorId) notFound("Post has no author");
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parent.authorId))
        .limit(1);
      if (!user) notFound("Author not found");
      return user;
    },
  },

  Mutation: {
    createPost: async (_parent, args, context) => {
      const auth = requireUser(context);
      const [organization] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, args.organizationId))
        .limit(1);
      if (!organization) return apiError("Organization not found", "NOT_FOUND");

      const [post] = await db
        .insert(posts)
        .values({
          title: args.title,
          content: args.content,
          authorId: auth.userId,
          organizationId: args.organizationId,
        })
        .returning();
      if (!post) return apiError("Failed to create post", "INTERNAL");
      return postSuccess("Post created", toPost(post));
    },

    updatePost: async (_parent, args, context) => {
      requireUser(context);
      const [post] = await db
        .update(posts)
        .set({
          ...(args.title != null ? { title: args.title } : {}),
          ...(args.content != null ? { content: args.content } : {}),
          updatedAt: new Date(),
        })
        .where(eq(posts.id, args.id))
        .returning();
      if (!post) return apiError("Post not found", "NOT_FOUND");
      return postSuccess("Post updated", toPost(post));
    },

    deletePost: async (_parent, args, context) => {
      requireUser(context);
      const [post] = await db
        .delete(posts)
        .where(eq(posts.id, args.id))
        .returning();
      if (!post) return apiError("Post not found", "NOT_FOUND");
      return postSuccess("Post deleted", toPost(post));
    },
  },

  Query: {
    posts: async (_parent, _args, context) => {
      requireUser(context);
      const rows = await db.select().from(posts);
      return rows.map(toPost);
    },

    post: async (_parent, args, context) => {
      requireUser(context);
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, args.id))
        .limit(1);
      return post ? toPost(post) : null;
    },
  },
};

export default resolvers;
