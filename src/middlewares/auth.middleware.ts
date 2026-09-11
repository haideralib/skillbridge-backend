import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../constants/statusCodes.constant";
import { AppError } from "../utils/App.util";
import { verifyToken } from "../utils/jwt.util";


export const AuthMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token as string);
        req.user = decoded;
        next();
    } catch (error) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

}