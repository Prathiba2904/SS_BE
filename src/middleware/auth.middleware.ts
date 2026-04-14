import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email?: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Accept token from standard Authorization header or x-auth-token
  const rawHeader =
    (req.headers.authorization as string | undefined) ||
    (req.headers["x-auth-token"] as string | undefined);

  if (!rawHeader) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }

  const token = rawHeader.startsWith("Bearer ")
    ? rawHeader.split(" ")[1]
    : rawHeader;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    const id =
      typeof decoded.sub === "string"
        ? decoded.sub
        : typeof decoded.id === "string"
          ? decoded.id
          : undefined;

    if (!id) {
      return res.status(401).json({ message: "Invalid token payload. Please login again." });
    }

    req.user = {
      id,
      email: typeof decoded.email === "string" ? decoded.email : undefined,
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};