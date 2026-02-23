import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status: number = err.statusCode || 500;
  const message: string = err.message || "Something went wrong!";

  console.error(`Error: ${message}`);

  return res.status(status).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
