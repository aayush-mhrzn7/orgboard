/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ... on AuthSuccess {\n        message\n        accessToken\n        user {\n          id\n          name\n          email\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Posts($first: Int, $after: String) {\n    posts(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.PostsDocument,
    "\n  query Organizations($first: Int) {\n    organizations(first: $first) {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.OrganizationsDocument,
    "\n  mutation CreateOrganization($name: String!) {\n    createOrganization(name: $name) {\n      __typename\n      ... on OrganizationSuccess {\n        message\n        organization {\n          id\n          name\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n": typeof types.CreateOrganizationDocument,
    "\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $organizationId: ID!\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      organizationId: $organizationId\n    ) {\n      __typename\n      ... on PostSuccess {\n        message\n        post {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n": typeof types.CreatePostDocument,
};
const documents: Documents = {
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ... on AuthSuccess {\n        message\n        accessToken\n        user {\n          id\n          name\n          email\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n": types.MeDocument,
    "\n  query Posts($first: Int, $after: String) {\n    posts(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.PostsDocument,
    "\n  query Organizations($first: Int) {\n    organizations(first: $first) {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.OrganizationsDocument,
    "\n  mutation CreateOrganization($name: String!) {\n    createOrganization(name: $name) {\n      __typename\n      ... on OrganizationSuccess {\n        message\n        organization {\n          id\n          name\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n": types.CreateOrganizationDocument,
    "\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $organizationId: ID!\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      organizationId: $organizationId\n    ) {\n      __typename\n      ... on PostSuccess {\n        message\n        post {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n": types.CreatePostDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ... on AuthSuccess {\n        message\n        accessToken\n        user {\n          id\n          name\n          email\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      __typename\n      ... on AuthSuccess {\n        message\n        accessToken\n        user {\n          id\n          name\n          email\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Posts($first: Int, $after: String) {\n    posts(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query Posts($first: Int, $after: String) {\n    posts(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Organizations($first: Int) {\n    organizations(first: $first) {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Organizations($first: Int) {\n    organizations(first: $first) {\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOrganization($name: String!) {\n    createOrganization(name: $name) {\n      __typename\n      ... on OrganizationSuccess {\n        message\n        organization {\n          id\n          name\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrganization($name: String!) {\n    createOrganization(name: $name) {\n      __typename\n      ... on OrganizationSuccess {\n        message\n        organization {\n          id\n          name\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $organizationId: ID!\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      organizationId: $organizationId\n    ) {\n      __typename\n      ... on PostSuccess {\n        message\n        post {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost(\n    $title: String!\n    $content: String!\n    $organizationId: ID!\n  ) {\n    createPost(\n      title: $title\n      content: $content\n      organizationId: $organizationId\n    ) {\n      __typename\n      ... on PostSuccess {\n        message\n        post {\n          id\n          title\n          content\n          createdAt\n          author {\n            name\n          }\n        }\n      }\n      ... on APIError {\n        message\n        code\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;