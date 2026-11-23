import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createContext } from "./context";
import organizations from "./entites/organizations";
import posts from "./entites/posts";
import tags from "./entites/tags";
import users from "./entites/user";

const server = new ApolloServer({
  typeDefs: [
    organizations.typeDefs,
    posts.typeDefs,
    tags.typeDefs,
    users.typeDefs,
  ],
  resolvers: [
    organizations.resolvers,
    posts.resolvers,
    tags.resolvers,
    users.resolvers,
  ],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: createContext,
});

console.log(`🚀 Server ready at ${url}`);
