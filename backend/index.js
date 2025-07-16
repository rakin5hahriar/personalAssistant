import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connect } from 'mongoose';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
    {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Allow all frontend ports
        credentials: true, // Allow cookies to be sent
    }
));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);  // Authentication routes
app.use("/api/users", userRouter); // User management routes

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on ${PORT}`);
});