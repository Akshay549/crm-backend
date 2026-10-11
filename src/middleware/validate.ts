import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// Validates req.body against a Zod schema.
// On success, req.body is replaced with the cleaned data (trimmed, lowercased, etc.)
const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body ?? {});

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        req.body = result.data;
        next();
    };
};

export default validate;
