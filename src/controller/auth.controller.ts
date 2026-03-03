import { Request, Response } from "express";
import { loginUser, registerUser } from "../service/auth.service";
import User from "../model/user.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const data = await registerUser(name, email, password);

    // Set httpOnly cookie with JWT token
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: data.user,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle specific database errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    return res.status(400).json({
      message: error.message || "Registration failed. Please try again.",
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

    // Set httpOnly cookie with JWT token
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: data.user,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message,
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
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { name, password } = req.body;
    const update: any = {};
    if (name) update.name = name;
    if (password) {
      const bcrypt = require("bcryptjs");
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};