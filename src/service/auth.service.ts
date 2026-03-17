import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model";

export const registerUser = async (name: string, email: string, password: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured. Please set it in your .env file.");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error: any) {
    console.error("User creation error:", error);
    if (error.code === 11000) {
      throw new Error("Email already registered");
    }
    if (error.name === "ValidationError") throw error;
    throw new Error(error?.message || "Registration failed. Please try again.");
  }
};

export const loginUser = async (email: string, password: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured. Please set it in your .env file.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};