import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://marathemahika.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// ✅ CONNECT DB ONLY ONCE (important for Vercel)
let isConnected = false;

const connectOnce = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
        console.log("MongoDB connected");
    }
};

app.use(async (req, res, next) => {
    await connectOnce();
    next();
});

// ✅ ROOT ROUTE (so no blank screen)
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Routes
app.use('/api/users', userRoutes);

// ❌ DO NOT USE app.listen() in Vercel

// Export for Vercel
export default app;