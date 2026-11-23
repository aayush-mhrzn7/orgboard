import resolvers from "./resolvers";
import typeDefsPath from "./type-defs.graphql" with { type: "file" };

const typeDefs = await Bun.file(typeDefsPath).text();

export default {
  resolvers,
  typeDefs,
};
