import express from 'express';
import 'dotenv/config.js';
import { DatabaseConfig } from './configs/db.config';
import authRoutes from './routes/auth.route';
import morgan from 'morgan';
import { AuthMiddleware } from './middlewares/auth.middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/job.route';
dotenv.config();


const app = express()
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(morgan('dev'));
DatabaseConfig();


app.use(cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


// middleware
app.use(AuthMiddleware);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));