import type { IncomingMessage, ServerResponse } from "http";
import { verifyToken, type TokenPayload } from "./libs/jwt";

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  user: TokenPayload | null;
};

function getBearerToken(req: IncomingMessage): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

export async function createContext({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<Context> {
  let user: TokenPayload | null = null;
  const token = getBearerToken(req);
  if (token) {
    try {
      user = verifyToken(token, "access");
    } catch {
      user = null;
    }
  }
  return { req, res, user };
}
