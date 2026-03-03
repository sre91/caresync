import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Default error values
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    status = 400;
    message = "This email is already registered!";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token! Please login again!";
  }

  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired! Please login again!";
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    status = 404;
    message = "Resource not found!";
  }

  console.error(`Error ${status}: ${message}`);

  return res.status(status).json({
    success: false,
    message,
  });
};

export default errorHandler;
