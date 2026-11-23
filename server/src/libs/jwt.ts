import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

type TokenType = "access" | "refresh";

type TokenPayload = {
  userId: string;
  type: TokenType;
};

const generateToken = (userId: string, type: TokenType) => {
  const expiresIn = type === "access" ? "15m" : "7d";
  return jwt.sign({ userId, type } satisfies TokenPayload, JWT_SECRET, {
    expiresIn,
  });
};

const verifyToken = (token: string, expectedType?: TokenType): TokenPayload => {
  const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  if (expectedType && payload.type !== expectedType) {
    throw new Error(`Expected ${expectedType} token`);
  }
  return payload;
};

export { generateToken, verifyToken };
export type { TokenPayload, TokenType };
