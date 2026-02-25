import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model";

export const loginUser = async (email: string, password: string) => {
  let user = await User.findOne({ email });
  if (!user) {
    // Create new user if not found
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name: email.split('@')[0], email, password: hashedPassword });
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
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