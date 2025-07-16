import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", authRouter);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on ${PORT}`);
});