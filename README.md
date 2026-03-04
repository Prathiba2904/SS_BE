# SS_BE

## Authentication Middleware 🔐

A simple `protect` middleware ensures only logged-in users can access protected routes. It verifies JWTs from the `Authorization` header and attaches decoded user data to `req.user`.

```ts
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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};
```

### Usage Examples

```ts
router.get("/profile", protect, getProfile);
router.post("/expense", protect, addExpense);
router.get("/expenses", protect, getExpenses);
```

> ✅ Only authenticated users can access these routes. No roles or admin checks required.



