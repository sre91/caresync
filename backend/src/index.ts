import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🏥 Welcome to CareSync AI Backend!",
    status: "Server is running!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CareSync AI Server running on port ${PORT}`);
});
