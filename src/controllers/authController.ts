import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  const {
    email,
    password,

    fullName,
     studentId,
    role,
  } = req.body;

  try {
    console.log(studentId)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (role === "student") {
      if (!studentId) {
        return res
          .status(400)
          .json({ message: "Student ID is required for student registration" });
      }

      const  studentIdExists = await User.findOne({ studentId });
      if ( studentIdExists) {
        return res
          .status(400)
          .json({ message: "Student ID already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
       studentId,
      role,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string
    );
    res.json({ token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
