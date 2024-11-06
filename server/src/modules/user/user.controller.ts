import express, { NextFunction, Request, Response } from "express";
import User from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const createUser = async (
  req: Request<{}, {}, RegisterRequestBody>, // route params, query params, req body
  res: Response
) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user.", error });
  }
};

// interface SignInRequestBody {
//   email: string;
//   password: string;
// }

export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid)
        res.status(401).json({ message: "Invalid credentials" });

      // Generate JWT
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in env.");
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    }
  } catch (err) {
    console.error("Error signing in user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
