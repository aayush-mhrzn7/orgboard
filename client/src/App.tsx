import { useEffect, useState, type FormEvent } from "react";
import { LoginMutation, MeQuery, PostsQuery } from "./graphql/operations";
import type { PostsQuery as PostsQueryResult } from "./gql/graphql";
import { getToken, gqlClient, setToken } from "./lib/graphql";
import "./index.css";

type User = { id: string; name: string; email: string };
type Post = PostsQueryResult["posts"]["edges"][number]["node"];

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    gqlClient
      .request(MeQuery)
      .then((data) => {
        if (data.me) setUser(data.me);
        else setToken(null);
      })
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) {
      setPosts([]);
      return;
    }
    gqlClient
      .request(PostsQuery, { first: 10 })
      .then((data) => setPosts(data.posts.edges.map((e) => e.node)))
      .catch((e: Error) => setError(e.message));
  }, [user]);

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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  function onLogout() {
    setToken(null);
    setUser(null);
    setPosts([]);
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
    <main className="min-h-screen max-w-2xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
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

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
        Recent posts
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
              {post.author.name} · {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
        {posts.length === 0 && !error && (
          <li className="text-sm text-zinc-500">No posts yet.</li>
        )}
      </ul>
    </main>
  );
}

export default App;
