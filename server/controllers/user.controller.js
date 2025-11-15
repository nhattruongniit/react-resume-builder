import Resume from "../models/Resume.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    const token = generateToken(newUser._id);
    delete newUser.password;
    
    await newUser.save();
    res.status(201).json({ 
      message: "User registered successfully",
      user: newUser,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if(!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if(!existingUser) {
      return res.status(400).json({ message: "Invalid email and password" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email and password" });
    }

    const token = generateToken(existingUser._id);
    delete existingUser.password;
    res.status(200).json({ 
      message: "User logged in successfully",
      user: existingUser,
      token
    }); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET: /api/users/data -> get user by id
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const existingUser = await User.findById(userId);
    if(!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    delete existingUser.password;
    
    res.status(200).json({ 
      message: "User retrieved successfully",
      user: existingUser,
    }); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET: /api/users/resumes -> get all resumes by user id
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    
    const resumes = await Resume.find({ user: userId });
    res.status(200).json({
      message: "Resumes retrieved successfully",
      resumes
    });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// DELETE: /api/users/delete -> delete user by id