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
  query Posts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
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

export const OrganizationsQuery = graphql(`
  query Organizations($first: Int) {
    organizations(first: $first) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`);

export const CreateOrganizationMutation = graphql(`
  mutation CreateOrganization($name: String!) {
    createOrganization(name: $name) {
      __typename
      ... on OrganizationSuccess {
        message
        organization {
          id
          name
        }
      }
      ... on APIError {
        message
        code
      }
    }
  }
`);

export const CreatePostMutation = graphql(`
  mutation CreatePost(
    $title: String!
    $content: String!
    $organizationId: ID!
  ) {
    createPost(
      title: $title
      content: $content
      organizationId: $organizationId
    ) {
      __typename
      ... on PostSuccess {
        message
        post {
          id
          title
          content
          createdAt
          author {
            name
          }
        }
      }
      ... on APIError {
        message
        code
      }
    }
  }
`);
