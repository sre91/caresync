import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

// Validate Signup
export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password!", 400));
  }

  if (name.length < 2) {
    return next(new AppError("Name must be at least 2 characters!", 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Please provide a valid email!", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters!", 400));
  }

  next();
};

// Validate Login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  next();
};

// Validate Appointment
export const validateAppointment = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { doctorId, date, time } = req.body;

  if (!doctorId || !date || !time) {
    return next(new AppError("Please provide doctor, date and time!", 400));
  }

  // Check date is not in past
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    return next(new AppError("Appointment date cannot be in the past!", 400));
  }

  next();
};
