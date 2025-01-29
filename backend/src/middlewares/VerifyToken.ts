import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../response/apiResponse";

// Extend the Request interface to include userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const jwt = require("jsonwebtoken");

config();
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return APIResponse({
      res,
      statusCode: 401,
      status: 0,
      message: "Access denied",
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET ?? "randomSecretKey";
    const decoded = jwt.verify(token, secretKey);

    // Add userId to the request object
    req.userId = decoded.id;
    next();
  } catch (error) {
    return APIResponse({
      res,
      statusCode: 401,
      status: 0,
      message: "Invalid token",
    });
  }
};

export default verifyToken;
