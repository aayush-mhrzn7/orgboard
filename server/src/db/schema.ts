import { index, integer, sqliteTable, primaryKey, text } from "drizzle-orm/sqlite-core";

const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

const organizationUsers = sqliteTable(
  "organization_users",
  {
    organizationId: text("organization_id").references(() => organizations.id),
    userId: text("user_id").references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.organizationId, table.userId] }),
    index("organization_users_organization_id_user_id_idx").on(
      table.organizationId,
      table.userId,
    ),
  ],
);

const posts = sqliteTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").references(() => users.id),
  organizationId: text("organization_id").references(() => organizations.id),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

const tags = sqliteTable("tags", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

const postTags = sqliteTable(
  "post_tags",
  {
    postId: text("post_id").references(() => posts.id),
    tagId: text("tag_id").references(() => tags.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("post_tags_post_id_tag_id_idx").on(table.postId, table.tagId),
  ],
);

type userType = typeof users.$inferSelect;
type postType = typeof posts.$inferSelect;
type tagType = typeof tags.$inferSelect;
type organizationType = typeof organizations.$inferSelect;
type organizationUserType = typeof organizationUsers.$inferSelect;
type postTagType = typeof postTags.$inferSelect;

export { users, posts, tags, postTags, organizations, organizationUsers };
export type { userType, postType, tagType, organizationType, organizationUserType, postTagType };