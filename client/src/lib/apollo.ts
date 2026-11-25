import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const TOKEN_KEY = "accessToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    new SetContextLink(({ headers }) => ({
      headers: {
        ...headers,
        authorization: getToken() ? `Bearer ${getToken()}` : "",
      },
    })),
    new HttpLink({ uri: "http://localhost:4000/" }),
  ]),
  cache: new InMemoryCache(),
});
