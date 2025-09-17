import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});