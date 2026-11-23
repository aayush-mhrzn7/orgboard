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
  await db.delete(postTags);
  await db.delete(posts);
  await db.delete(organizationUsers);
  await db.delete(tags);
  await db.delete(organizations);
  await db.delete(users);

  const [alice, bob] = await db
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
    ])
    .returning();

  const [workspace] = await db
    .insert(organizations)
    .values({ name: "Orgboard" })
    .returning();

  await db.insert(organizationUsers).values([
    { organizationId: workspace!.id, userId: alice!.id },
    { organizationId: workspace!.id, userId: bob!.id },
  ]);

  const authors = [alice!, bob!];
  await db.insert(posts).values(
    Array.from({ length: 100 }, (_, i) => {
      const n = i + 1;
      const author = authors[i % authors.length]!;
      return {
        title: `Post ${n}`,
        content: `Body for post ${n}.`,
        authorId: author.id,
        organizationId: workspace!.id,
      };
    }),
  );

  console.log("Seeded:", {
    users: [alice!.email, bob!.email],
    workspace: workspace!.name,
    posts: 100,
  });
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
