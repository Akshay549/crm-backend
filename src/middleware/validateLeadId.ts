import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

// Runs for every route that has :id, so a bad id returns 400 instead of a database error
export const validateLeadId = (req: Request, res: Response, next: NextFunction, id: string) => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new AppError("Invalid lead id", 400);
    }
    next();
};
