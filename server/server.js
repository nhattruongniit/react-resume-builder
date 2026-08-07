import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';  
import userRouter from './routes/user.routes.js';
import resumeRouter from './routes/resume.routes.js';
import aiRouter from './routes/ai.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

await connectDB();

app.get('/', (_, res) => {
  res.send('Resume Builder Server is running');
});
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
