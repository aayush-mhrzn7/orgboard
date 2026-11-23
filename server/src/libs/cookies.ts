import type { IncomingMessage, ServerResponse } from "http";

const REFRESH_COOKIE = "refresh_token";
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key!, decodeURIComponent(rest.join("=") || "")];
    }),
  );
}

function cookieOptions(maxAgeMs: number): string {
  const parts = [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function getRefreshToken(req: IncomingMessage): string | undefined {
  return parseCookies(req.headers.cookie)[REFRESH_COOKIE];
}

export function setRefreshToken(res: ServerResponse, token: string): void {
  res.setHeader(
    "Set-Cookie",
    `${REFRESH_COOKIE}=${encodeURIComponent(token)}; ${cookieOptions(REFRESH_MAX_AGE_MS)}`,
  );
}

export function clearRefreshToken(res: ServerResponse): void {
  res.setHeader(
    "Set-Cookie",
    `${REFRESH_COOKIE}=; ${cookieOptions(0)}`,
  );
}
