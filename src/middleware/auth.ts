import { Request, Response, NextFunction } from "express";
import Session from "../models/session";
import User from "../models/user";
import AppError from "../utils/appError";

// Protects a route: the request must carry a valid sessionId cookie.

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
        throw new AppError("Please log in to continue", 401);
    }

    const session = await Session.findOne({ sessionId, expiresAt: { $gt: new Date() } });

    if (!session) {
        throw new AppError("Session expired. Please log in again", 401);
    }

    const user = await User.findById(session.userId);

    if (!user) {
        throw new AppError("User not found. Please log in again", 401);
    }

    res.locals.user = user;
    next();
};
