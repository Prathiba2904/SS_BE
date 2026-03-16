import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
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

  console.log("Auth header received:", rawHeader);

  if (!rawHeader) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }

  const token = rawHeader.startsWith("Bearer ")
    ? rawHeader.split(" ")[1]
    : rawHeader;

  console.log("Token being verified:", token);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};