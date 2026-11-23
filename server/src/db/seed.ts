import db from ".";
import {
  organizations,
  organizationUsers,
  posts,
  postTags,
  tags,
  users,
} from "./schema";

async function seed() {
  const [alice, bob, cara] = await db
    .insert(users)
    .values([
      {
        name: "Alice Nguyen",
        email: "alice@tekvortex.dev",
        password: "password",
      },
      {
        name: "Bob Okonkwo",
        email: "bob@tekvortex.dev",
        password: "password",
      },
      {
        name: "Cara Singh",
        email: "cara@acme.dev",
        password: "password",
      },
    ])
    .returning();

  const [tekvortex, acme] = await db
    .insert(organizations)
    .values([
      { name: "Tekvortex" },
      { name: "Acme Labs" },
    ])
    .returning();

  await db.insert(organizationUsers).values([
    { organizationId: tekvortex!.id, userId: alice!.id },
    { organizationId: tekvortex!.id, userId: bob!.id },
    { organizationId: acme!.id, userId: cara!.id },
    { organizationId: acme!.id, userId: alice!.id },
  ]);

  const [graphql, drizzle, auth, learning] = await db
    .insert(tags)
    .values([
      { name: "graphql" },
      { name: "drizzle" },
      { name: "auth" },
      { name: "learning" },
    ])
    .returning();

  const [post1, post2, post3] = await db
    .insert(posts)
    .values([
      {
        title: "Welcome to Tekvortex",
        content: "Internal kickoff notes for the GraphQL learning track.",
        authorId: alice!.id,
        organizationId: tekvortex!.id,
      },
      {
        title: "Drizzle schema tips",
        content: "How we model orgs, users, and post visibility.",
        authorId: bob!.id,
        organizationId: tekvortex!.id,
      },
      {
        title: "Acme onboarding",
        content: "Only Acme members should see this post.",
        authorId: cara!.id,
        organizationId: acme!.id,
      },
    ])
    .returning();

  await db.insert(postTags).values([
    { postId: post1!.id, tagId: learning!.id },
    { postId: post1!.id, tagId: graphql!.id },
    { postId: post2!.id, tagId: drizzle!.id },
    { postId: post2!.id, tagId: graphql!.id },
    { postId: post3!.id, tagId: auth!.id },
    { postId: post3!.id, tagId: learning!.id },
  ]);

  console.log("Seeded:", {
    users: [alice!.email, bob!.email, cara!.email],
    organizations: [tekvortex!.name, acme!.name],
    posts: [post1!.title, post2!.title, post3!.title],
  });
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
