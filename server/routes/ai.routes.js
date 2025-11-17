import express from 'express';
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from '../controllers/ai.controller.js';
import protect from '../middlewares/auth.middleware.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desscription', enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);

export default aiRouter;