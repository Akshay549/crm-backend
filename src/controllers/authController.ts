import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user";
import Session from "../models/session";
import AppError from "../utils/appError";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const isProduction = process.env.NODE_ENV === "production";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    // Same message for wrong email and wrong password, so we don't reveal which one failed
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Invalid email or password", 401);
    }

    const sessionId = crypto.randomBytes(32).toString("hex");

    await Session.create({
        sessionId,
        userId: user._id,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    });

    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        // In production the frontend and API are on different domains,
        // so the cookie must be "none" (which requires secure: true)
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: SESSION_DURATION_MS,
    });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
};
