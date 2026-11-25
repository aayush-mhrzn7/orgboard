import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  CreateOrganizationMutation,
  CreatePostMutation,
  LoginMutation,
  MeQuery,
  OrganizationsQuery,
  PostsQuery,
} from "./graphql/operations";
import type {
  OrganizationsQuery as OrgsResult,
  PostsQuery as PostsResult,
} from "./gql/graphql";
import { getToken, gqlClient, setToken } from "./lib/graphql";
import "./index.css";

const PAGE_SIZE = 10;

type User = { id: string; name: string; email: string };
type Post = PostsResult["posts"]["edges"][number]["node"];
type Org = OrgsResult["organizations"]["edges"][number]["node"];

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadOrgs = useCallback(async () => {
    const orgsData = await gqlClient.request(OrganizationsQuery, { first: 50 });
    setOrgs(orgsData.organizations.edges.map((e) => e.node));
  }, []);

  const loadPosts = useCallback(async (after?: string | null) => {
    const data = await gqlClient.request(PostsQuery, {
      first: PAGE_SIZE,
      after: after ?? undefined,
    });
    const next = data.posts.edges.map((e) => e.node);
    setPosts((prev) => (after ? [...prev, ...next] : next));
    setHasNextPage(data.posts.pageInfo.hasNextPage);
    setEndCursor(data.posts.pageInfo.endCursor ?? null);
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([loadPosts(), loadOrgs()]);
  }, [loadPosts, loadOrgs]);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    gqlClient
      .request(MeQuery)
      .then(async (data) => {
        if (!data.me) {
          setToken(null);
          return;
        }
        setUser(data.me);
        await loadData();
      })
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, [loadData]);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const { login } = await gqlClient.request(LoginMutation, {
        email,
        password,
      });
      if (login.__typename === "APIError") {
        setError(login.message);
        return;
      }
      if (login.__typename === "AuthSuccess" && login.accessToken && login.user) {
        setToken(login.accessToken);
        setUser(login.user);
        await loadData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  function onLogout() {
    setToken(null);
    setUser(null);
    setPosts([]);
    setOrgs([]);
    setHasNextPage(false);
    setEndCursor(null);
  }

  async function onLoadMore() {
    if (!endCursor || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      await loadPosts(endCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  async function onCreateOrg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const name = String(new FormData(form).get("name") ?? "").trim();
    if (!name) return;

    try {
      const { createOrganization } = await gqlClient.request(
        CreateOrganizationMutation,
        { name },
      );
      if (createOrganization.__typename === "APIError") {
        setError(createOrganization.message);
        return;
      }
      if (createOrganization.__typename === "OrganizationSuccess") {
        form.reset();
        await loadOrgs();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create org");
    }
  }

  async function onCreatePost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const content = String(data.get("content") ?? "").trim();
    const organizationId = String(data.get("organizationId") ?? "");
    if (!title || !content || !organizationId) return;

    try {
      const { createPost } = await gqlClient.request(CreatePostMutation, {
        title,
        content,
        organizationId,
      });
      if (createPost.__typename === "APIError") {
        setError(createPost.message);
        return;
      }
      if (createPost.__typename === "PostSuccess") {
        form.reset();
        const post = createPost.post;
        setPosts((prev) => [post, ...prev.filter((p) => p.id !== post.id)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <p className="text-zinc-500">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm flex flex-col gap-3"
        >
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Orgboard
          </h1>
          <p className="text-sm text-zinc-500 mb-2">
            Seed: alice@tekvortex.dev / password
          </p>
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            defaultValue="alice@tekvortex.dev"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-400"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            defaultValue="password"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-zinc-400"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="rounded-md bg-zinc-100 text-zinc-900 font-medium py-2 hover:bg-white"
          >
            Log in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto p-6 space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orgboard</h1>
          <p className="text-sm text-zinc-500">{user.name}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          Log out
        </button>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <section>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
          Your organizations
        </h2>
        <form onSubmit={onCreateOrg} className="flex gap-2 mb-3">
          <input
            name="name"
            required
            placeholder="New org name"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-100 text-zinc-900 text-sm font-medium px-3 py-2 hover:bg-white"
          >
            Create
          </button>
        </form>
        <ul className="flex flex-wrap gap-2">
          {orgs.map((org) => (
            <li
              key={org.id}
              className="rounded-md border border-zinc-800 px-3 py-1.5 text-sm"
            >
              {org.name}
            </li>
          ))}
          {orgs.length === 0 && (
            <li className="text-sm text-zinc-500">No organizations yet.</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
          New post
        </h2>
        {orgs.length === 0 ? (
          <p className="text-sm text-zinc-500">Create an organization first.</p>
        ) : (
          <form onSubmit={onCreatePost} className="flex flex-col gap-2">
            <select
              name="organizationId"
              required
              defaultValue={orgs[0]?.id}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            >
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            <input
              name="title"
              required
              placeholder="Title"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <textarea
              name="content"
              required
              rows={3}
              placeholder="Content"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-400 resize-y"
            />
            <button
              type="submit"
              className="self-start rounded-md bg-zinc-100 text-zinc-900 text-sm font-medium px-3 py-2 hover:bg-white"
            >
              Publish
            </button>
          </form>
        )}
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
          Your posts
        </h2>
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border border-zinc-800 rounded-lg px-4 py-3"
            >
              <p className="font-medium">{post.title}</p>
              <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                {post.content}
              </p>
              <p className="text-xs text-zinc-600 mt-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="text-sm text-zinc-500">No posts yet.</li>
          )}
        </ul>
        {hasNextPage && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="mt-4 w-full rounded-md border border-zinc-700 py-2 text-sm text-zinc-300 hover:border-zinc-500 disabled:opacity-50"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        )}
      </section>
    </main>
  );
}

export default App;
