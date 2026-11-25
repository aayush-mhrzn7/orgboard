import { GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:4000/";

const TOKEN_KEY = "accessToken";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const gqlClient = new GraphQLClient(endpoint, {
  headers: () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);
  },
});
