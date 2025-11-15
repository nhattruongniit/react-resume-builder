import express from 'express';
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from '../controllers/ai.controller.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', enhanceProfessionalSummary);
aiRouter.put('/enhance-job-desscription', enhanceJobDescription);
aiRouter.delete('/upload-resume', uploadResume);

export default aiRouter;