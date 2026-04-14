import { Request, Response } from "express";
import { loginUser, registerUser } from "../service/auth.service";
import User from "../model/user.model";
import bcrypt from "bcryptjs";
import { getErrorMessage, isRecord } from "../utils/errors";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const data = await registerUser(name, email, password);

    return res.status(201).json({
      message: "User registered successfully",
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    });
  } catch (error: unknown) {
    if (res.headersSent) return;

    // Duplicate key (MongoDB)
    if (isRecord(error) && error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    // Mongoose validation error
    if (
      isRecord(error) &&
      error.name === "ValidationError" &&
      isRecord(error.errors)
    ) {
      const first = Object.values(error.errors)[0];
      return res.status(400).json({
        message:
          isRecord(first) && typeof first.message === "string"
            ? first.message
            : "Validation failed. Check your input.",
      });
    }

    return res.status(400).json({
      message: getErrorMessage(error) || "Registration failed. Please try again.",
    });
  }
};

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
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    });
  } catch (error: unknown) {
    return res.status(401).json({
      message: getErrorMessage(error),
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the httpOnly cookie
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: unknown) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { name, password } = req.body;
    const update: { name?: string; password?: string } = {};
    if (name) update.name = name;
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findOneAndUpdate({ email }, update, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: unknown) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};