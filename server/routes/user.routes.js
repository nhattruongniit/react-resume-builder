import express from 'express';
import { getUserById, loginUser, registerUser, getUserResumes } from '../controllers/user.controller.js';
import protect from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get(
  '/data', 
  protect, 
  getUserById
);
userRouter.get(
  '/resumes', 
  protect, 
  getUserResumes
);

export default userRouter;