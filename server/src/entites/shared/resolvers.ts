import type { Resolvers } from "../../types/generated";

const resolvers: Resolvers = {
  APIResponse: {
    __resolveType(obj) {
      if ("code" in obj) return "APIError";
      if ("accessToken" in obj) return "AuthSuccess";
      if ("organization" in obj) return "OrganizationSuccess";
      if ("post" in obj) return "PostSuccess";
      if ("tag" in obj) return "TagSuccess";
      if ("success" in obj) return "MembershipSuccess";
      if ("user" in obj) return "UserSuccess";
      if ("message" in obj) return "MessageSuccess";
      return null;
    },
  },
};

export default resolvers;
