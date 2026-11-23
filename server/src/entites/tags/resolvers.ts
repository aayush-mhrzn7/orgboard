import db from "../../db";
import { tags } from "../../db/schema";

const resolvers = {
  Query: {
    tags: async () => db.select().from(tags),
  },
};

export default resolvers;
