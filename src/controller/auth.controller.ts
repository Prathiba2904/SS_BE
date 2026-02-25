import { Request, Response } from "express";
import { loginUser } from "../service/auth.service";
import User from "../model/user.model";

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