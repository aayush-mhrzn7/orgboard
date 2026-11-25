import { useEffect, useState, type FormEvent } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import {
  CreateOrganizationMutation,
  CreatePostMutation,
  LoginMutation,
  MeQuery,
  OrganizationsQuery,
  PostsQuery,
} from "./graphql/operations";
import { getToken, setToken } from "./lib/apollo";
import "./index.css";

export function App() {
  const client = useApolloClient();
  const [token, setAuth] = useState(getToken);

  function auth(next: string | null) {
    setToken(next);
    setAuth(next);
    if (!next) client.clearStore();
  }

  if (!token) return <Login onSuccess={auth} />;
  return <Home onLogout={() => auth(null)} />;
}

function Login({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [login, { loading }] = useMutation(LoginMutation);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const { data } = await login({
      variables: {
        email: String(form.get("email")),
        password: String(form.get("password")),
      },
    });
    const result = data?.login;
    if (result?.__typename === "APIError") setError(result.message);
    else if (result?.__typename === "AuthSuccess" && result.accessToken) {
      onSuccess(result.accessToken);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Orgboard</h1>
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
          disabled={loading}
          className="rounded-md bg-zinc-100 text-zinc-900 font-medium py-2 hover:bg-white disabled:opacity-50"
        >
          Log in
        </button>
      </form>
    </main>
  );
}

function Home({ onLogout }: { onLogout: () => void }) {
  const { data: meData, loading } = useQuery(MeQuery);
  const { data: orgsData } = useQuery(OrganizationsQuery, {
    variables: { first: 50 },
  });
  const { data: postsData } = useQuery(PostsQuery, {
    variables: { first: 20 },
  });

  const [createOrg] = useMutation(CreateOrganizationMutation, {
    refetchQueries: ["Organizations"],
  });
  const [createPost] = useMutation(CreatePostMutation, {
    refetchQueries: ["Posts"],
  });
  const [error, setError] = useState<string | null>(null);

  const user = meData?.me;
  const orgs = orgsData?.organizations.edges.map((e) => e.node) ?? [];
  const posts = postsData?.posts.edges.map((e) => e.node) ?? [];

  useEffect(() => {
    if (!loading && !user) onLogout();
  }, [loading, user, onLogout]);

  if (loading || !user) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <p className="text-zinc-500">Loading…</p>
      </main>
    );
  }

  async function onCreateOrg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const name = String(new FormData(form).get("name")).trim();
    if (!name) return;
    const { data } = await createOrg({ variables: { name } });
    const result = data?.createOrganization;
    if (result?.__typename === "APIError") setError(result.message);
    else form.reset();
  }

  async function onCreatePost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const { data } = await createPost({
      variables: {
        title: String(fd.get("title")).trim(),
        content: String(fd.get("content")).trim(),
        organizationId: String(fd.get("organizationId")),
      },
    });
    const result = data?.createPost;
    if (result?.__typename === "APIError") setError(result.message);
    else form.reset();
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
      </section>
    </main>
  );
}

export default App;
