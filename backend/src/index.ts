import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🏥 Welcome to CareSync AI Backend!",
    status: "Server is running!",
  });
});

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CareSync AI Server running on port ${PORT}`);
});
