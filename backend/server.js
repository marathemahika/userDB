import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://marathemahika.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5173;

// Force database connection for Vercel Serverless lambda
connectDB();

// Export the application for Vercel
export default app;
