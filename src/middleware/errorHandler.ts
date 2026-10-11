import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Errors we threw ourselves
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Broken JSON in request body
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body",
        });
    }

    // Mongoose schema validation failed
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e: any) => ({
            field: e.path,
            message: e.message,
        }));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    // Invalid MongoDB id, e.g. /leads/abc
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}`,
        });
    }

    // Duplicate value on a unique field
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    // Anything unexpected
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
    });
};

export default errorHandler;
