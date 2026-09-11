import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../constants/statusCodes.constant";
import { AppError } from "../utils/App.util";
import type { UserRole } from "../interfaces/payload.interface";

export const AuthorizationMiddleware = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role as UserRole)) {
            throw new AppError("Forbidden - Invalid role", StatusCodes.FORBIDDEN);
        }
        next();
    };
};