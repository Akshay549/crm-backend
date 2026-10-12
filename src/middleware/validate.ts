import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validate = (schema: ZodType, source: "body" | "query" = "body") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const input = source === "body" ? req.body ?? {} : req.query;
        const result = schema.safeParse(input);

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

        if (source === "body") {
            req.body = result.data;
        } else {
            res.locals.query = result.data;
        }

        next();
    };
};

export default validate;
