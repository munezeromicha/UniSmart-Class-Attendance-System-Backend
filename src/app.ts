import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import cors from 'cors';

const app = express();
app.use(express.json());
connectDB();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
  }));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));