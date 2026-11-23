const resolvers = {
 Query: {
    organization: async () => {
        return {
            id: "1",
            name: "Organization 1",
            description: "Description 1",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
 }
 },
};

export default resolvers;