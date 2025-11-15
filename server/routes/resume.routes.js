import express from 'express';
import { createResume, getResumeById, updateResume, deleteResume, getPublicResumeById } from '../controllers/resume.controller.js';
import upload from '../configs/multer.js';
import protect from '../middlewares/auth.middleware.js';

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;