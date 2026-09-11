import type { IPayload } from "../interfaces/payload.interface";
import jwt from "jsonwebtoken";
import { AppError } from "./App.util";
import 'dotenv/config.js';


const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const generateToken = (payload: IPayload): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
}

export const verifyToken = (token: string): IPayload => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as IPayload;
        return decoded;
    } catch (error) {
        throw new AppError("Invalid or expired token", 401);
    }
}