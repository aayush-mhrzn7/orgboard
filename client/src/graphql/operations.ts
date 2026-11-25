import { graphql } from "../gql";

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      __typename
      ... on AuthSuccess {
        message
        accessToken
        user {
          id
          name
          email
        }
      }
      ... on APIError {
        message
        code
      }
    }
  }
`);

export const MeQuery = graphql(`
  query Me {
    me {
      id
      name
      email
    }
  }
`);

export const PostsQuery = graphql(`
  query Posts($first: Int) {
    posts(first: $first) {
      edges {
        node {
          id
          title
          content
          createdAt
          author {
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);
