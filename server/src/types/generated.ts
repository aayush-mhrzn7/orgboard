import type { GraphQLResolveInfo } from 'graphql';
import type { PostParent } from '../entites/posts/types';
import type { OrganizationParent, OrganizationUserParent } from '../entites/organizations/types';
import type { Context } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ApiError = {
  __typename?: 'APIError';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ApiResponse = ApiError | AuthSuccess | MembershipSuccess | MessageSuccess | OrganizationSuccess | PostSuccess | TagSuccess | UserSuccess;

export type AuthSuccess = {
  __typename?: 'AuthSuccess';
  accessToken?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type MembershipSuccess = {
  __typename?: 'MembershipSuccess';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MessageSuccess = {
  __typename?: 'MessageSuccess';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserToOrganization: ApiResponse;
  createOrganization: ApiResponse;
  createPost: ApiResponse;
  createTag: ApiResponse;
  deleteOrganization: ApiResponse;
  deletePost: ApiResponse;
  deleteTag: ApiResponse;
  login: ApiResponse;
  logout: ApiResponse;
  refreshToken: ApiResponse;
  removeUserFromOrganization: ApiResponse;
  signup: ApiResponse;
  updateOrganization: ApiResponse;
  updatePost: ApiResponse;
  updateTag: ApiResponse;
  updateUser: ApiResponse;
};


export type MutationAddUserToOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateOrganizationArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreatePostArgs = {
  content: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateTagArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveUserFromOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateOrganizationArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdatePostArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type Organization = {
  __typename?: 'Organization';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationUsers: OrganizationUserConnection;
  posts: PostConnection;
  updatedAt: Scalars['String']['output'];
};


export type OrganizationOrganizationUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type OrganizationPostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type OrganizationConnection = {
  __typename?: 'OrganizationConnection';
  edges: Array<OrganizationEdge>;
  pageInfo: PageInfo;
};

export type OrganizationEdge = {
  __typename?: 'OrganizationEdge';
  cursor: Scalars['String']['output'];
  node: Organization;
};

export type OrganizationSuccess = {
  __typename?: 'OrganizationSuccess';
  message: Scalars['String']['output'];
  organization: Organization;
};

export type OrganizationUser = {
  __typename?: 'OrganizationUser';
  createdAt: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type OrganizationUserConnection = {
  __typename?: 'OrganizationUserConnection';
  edges: Array<OrganizationUserEdge>;
  pageInfo: PageInfo;
};

export type OrganizationUserEdge = {
  __typename?: 'OrganizationUserEdge';
  cursor: Scalars['String']['output'];
  node: OrganizationUser;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  authorId?: Maybe<Scalars['ID']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String']['output'];
  node: Post;
};

export type PostSuccess = {
  __typename?: 'PostSuccess';
  message: Scalars['String']['output'];
  post: Post;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  organization?: Maybe<Organization>;
  organizationUsers: OrganizationUserConnection;
  organizations: OrganizationConnection;
  post?: Maybe<Post>;
  posts: PostConnection;
  tag?: Maybe<Tag>;
  tags: TagConnection;
  users: UserConnection;
};


export type QueryOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrganizationUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TagConnection = {
  __typename?: 'TagConnection';
  edges: Array<TagEdge>;
  pageInfo: PageInfo;
};

export type TagEdge = {
  __typename?: 'TagEdge';
  cursor: Scalars['String']['output'];
  node: Tag;
};

export type TagSuccess = {
  __typename?: 'TagSuccess';
  message: Scalars['String']['output'];
  tag: Tag;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserSuccess = {
  __typename?: 'UserSuccess';
  message: Scalars['String']['output'];
  user: User;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  APIResponse:
    | ( ApiError )
    | ( AuthSuccess )
    | ( MembershipSuccess )
    | ( MessageSuccess )
    | ( Omit<OrganizationSuccess, 'organization'> & { organization: _RefType['Organization'] } )
    | ( Omit<PostSuccess, 'post'> & { post: _RefType['Post'] } )
    | ( TagSuccess )
    | ( UserSuccess )
  ;
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  APIError: ResolverTypeWrapper<ApiError>;
  APIResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['APIResponse']>;
  AuthSuccess: ResolverTypeWrapper<AuthSuccess>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MembershipSuccess: ResolverTypeWrapper<MembershipSuccess>;
  MessageSuccess: ResolverTypeWrapper<MessageSuccess>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Organization: ResolverTypeWrapper<OrganizationParent>;
  OrganizationConnection: ResolverTypeWrapper<Omit<OrganizationConnection, 'edges'> & { edges: Array<ResolversTypes['OrganizationEdge']> }>;
  OrganizationEdge: ResolverTypeWrapper<Omit<OrganizationEdge, 'node'> & { node: ResolversTypes['Organization'] }>;
  OrganizationSuccess: ResolverTypeWrapper<Omit<OrganizationSuccess, 'organization'> & { organization: ResolversTypes['Organization'] }>;
  OrganizationUser: ResolverTypeWrapper<OrganizationUserParent>;
  OrganizationUserConnection: ResolverTypeWrapper<Omit<OrganizationUserConnection, 'edges'> & { edges: Array<ResolversTypes['OrganizationUserEdge']> }>;
  OrganizationUserEdge: ResolverTypeWrapper<Omit<OrganizationUserEdge, 'node'> & { node: ResolversTypes['OrganizationUser'] }>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Post: ResolverTypeWrapper<PostParent>;
  PostConnection: ResolverTypeWrapper<Omit<PostConnection, 'edges'> & { edges: Array<ResolversTypes['PostEdge']> }>;
  PostEdge: ResolverTypeWrapper<Omit<PostEdge, 'node'> & { node: ResolversTypes['Post'] }>;
  PostSuccess: ResolverTypeWrapper<Omit<PostSuccess, 'post'> & { post: ResolversTypes['Post'] }>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tag: ResolverTypeWrapper<Tag>;
  TagConnection: ResolverTypeWrapper<TagConnection>;
  TagEdge: ResolverTypeWrapper<TagEdge>;
  TagSuccess: ResolverTypeWrapper<TagSuccess>;
  User: ResolverTypeWrapper<User>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserSuccess: ResolverTypeWrapper<UserSuccess>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  APIError: ApiError;
  APIResponse: ResolversUnionTypes<ResolversParentTypes>['APIResponse'];
  AuthSuccess: AuthSuccess;
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  MembershipSuccess: MembershipSuccess;
  MessageSuccess: MessageSuccess;
  Mutation: Record<PropertyKey, never>;
  Organization: OrganizationParent;
  OrganizationConnection: Omit<OrganizationConnection, 'edges'> & { edges: Array<ResolversParentTypes['OrganizationEdge']> };
  OrganizationEdge: Omit<OrganizationEdge, 'node'> & { node: ResolversParentTypes['Organization'] };
  OrganizationSuccess: Omit<OrganizationSuccess, 'organization'> & { organization: ResolversParentTypes['Organization'] };
  OrganizationUser: OrganizationUserParent;
  OrganizationUserConnection: Omit<OrganizationUserConnection, 'edges'> & { edges: Array<ResolversParentTypes['OrganizationUserEdge']> };
  OrganizationUserEdge: Omit<OrganizationUserEdge, 'node'> & { node: ResolversParentTypes['OrganizationUser'] };
  PageInfo: PageInfo;
  Post: PostParent;
  PostConnection: Omit<PostConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostEdge']> };
  PostEdge: Omit<PostEdge, 'node'> & { node: ResolversParentTypes['Post'] };
  PostSuccess: Omit<PostSuccess, 'post'> & { post: ResolversParentTypes['Post'] };
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  Tag: Tag;
  TagConnection: TagConnection;
  TagEdge: TagEdge;
  TagSuccess: TagSuccess;
  User: User;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserSuccess: UserSuccess;
}>;

export type ApiErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['APIError'] = ResolversParentTypes['APIError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApiResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['APIResponse'] = ResolversParentTypes['APIResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'APIError' | 'AuthSuccess' | 'MembershipSuccess' | 'MessageSuccess' | 'OrganizationSuccess' | 'PostSuccess' | 'TagSuccess' | 'UserSuccess', ParentType, ContextType>;
}>;

export type AuthSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthSuccess'] = ResolversParentTypes['AuthSuccess']> = ResolversObject<{
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MembershipSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MembershipSuccess'] = ResolversParentTypes['MembershipSuccess']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MessageSuccess'] = ResolversParentTypes['MessageSuccess']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addUserToOrganization?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationAddUserToOrganizationArgs, 'organizationId' | 'userId'>>;
  createOrganization?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'name'>>;
  createPost?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'content' | 'organizationId' | 'title'>>;
  createTag?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'name'>>;
  deleteOrganization?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'id'>>;
  deletePost?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  login?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType>;
  removeUserFromOrganization?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationRemoveUserFromOrganizationArgs, 'organizationId' | 'userId'>>;
  signup?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'name' | 'password'>>;
  updateOrganization?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationArgs, 'id' | 'name'>>;
  updatePost?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'id'>>;
  updateTag?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'id' | 'name'>>;
  updateUser?: Resolver<ResolversTypes['APIResponse'], ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
}>;

export type OrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationUsers?: Resolver<ResolversTypes['OrganizationUserConnection'], ParentType, ContextType, RequireFields<OrganizationOrganizationUsersArgs, 'first'>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<OrganizationPostsArgs, 'first'>>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type OrganizationConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationConnection'] = ResolversParentTypes['OrganizationConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['OrganizationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type OrganizationEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationEdge'] = ResolversParentTypes['OrganizationEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
}>;

export type OrganizationSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationSuccess'] = ResolversParentTypes['OrganizationSuccess']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationUser'] = ResolversParentTypes['OrganizationUser']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type OrganizationUserConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationUserConnection'] = ResolversParentTypes['OrganizationUserConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['OrganizationUserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type OrganizationUserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationUserEdge'] = ResolversParentTypes['OrganizationUserEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['OrganizationUser'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  authorId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PostConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostConnection'] = ResolversParentTypes['PostConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type PostEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostEdge'] = ResolversParentTypes['PostEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
}>;

export type PostSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostSuccess'] = ResolversParentTypes['PostSuccess']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryOrganizationArgs, 'id'>>;
  organizationUsers?: Resolver<ResolversTypes['OrganizationUserConnection'], ParentType, ContextType, RequireFields<QueryOrganizationUsersArgs, 'first' | 'organizationId'>>;
  organizations?: Resolver<ResolversTypes['OrganizationConnection'], ParentType, ContextType, RequireFields<QueryOrganizationsArgs, 'first'>>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<QueryPostsArgs, 'first'>>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  tags?: Resolver<ResolversTypes['TagConnection'], ParentType, ContextType, RequireFields<QueryTagsArgs, 'first'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'first'>>;
}>;

export type TagResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type TagConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TagConnection'] = ResolversParentTypes['TagConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['TagEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type TagEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TagEdge'] = ResolversParentTypes['TagEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Tag'], ParentType, ContextType>;
}>;

export type TagSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TagSuccess'] = ResolversParentTypes['TagSuccess']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type UserConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type UserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type UserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSuccess'] = ResolversParentTypes['UserSuccess']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  APIError?: ApiErrorResolvers<ContextType>;
  APIResponse?: ApiResponseResolvers<ContextType>;
  AuthSuccess?: AuthSuccessResolvers<ContextType>;
  MembershipSuccess?: MembershipSuccessResolvers<ContextType>;
  MessageSuccess?: MessageSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  OrganizationConnection?: OrganizationConnectionResolvers<ContextType>;
  OrganizationEdge?: OrganizationEdgeResolvers<ContextType>;
  OrganizationSuccess?: OrganizationSuccessResolvers<ContextType>;
  OrganizationUser?: OrganizationUserResolvers<ContextType>;
  OrganizationUserConnection?: OrganizationUserConnectionResolvers<ContextType>;
  OrganizationUserEdge?: OrganizationUserEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostConnection?: PostConnectionResolvers<ContextType>;
  PostEdge?: PostEdgeResolvers<ContextType>;
  PostSuccess?: PostSuccessResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagConnection?: TagConnectionResolvers<ContextType>;
  TagEdge?: TagEdgeResolvers<ContextType>;
  TagSuccess?: TagSuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserSuccess?: UserSuccessResolvers<ContextType>;
}>;

