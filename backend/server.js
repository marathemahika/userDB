import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://marathemahika.github.io',
    'https://user-db-two.vercel.app'
  ],
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
