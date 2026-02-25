import { Request, Response } from "express";
import { loginUser } from "../service/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const data = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      ...data,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message,
    });
  }
};