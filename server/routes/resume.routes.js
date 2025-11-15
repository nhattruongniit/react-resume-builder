import express from 'express';
import { createResume, getResumeById, updateResume, deleteResume, getPublicResumeById } from '../controllers/resume.controller.js';
import upload from '../configs/multer.js';

const resumeRouter = express.Router();

resumeRouter.post('/create', createResume);
resumeRouter.put('/update', upload.single('image'), updateResume);
resumeRouter.delete('/delete/:resumeId', deleteResume);
resumeRouter.get('/get/:resumeId', getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;