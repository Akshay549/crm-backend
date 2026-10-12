import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";
import connectDb from "../src/config/database";

// Vercel runs this file as a serverless function and vercel.json sends every URL here, and Express handles the routing.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
    try {
        await connectDb();
    } catch (error) {
        console.error("Unable to connect to database:", (error as Error).message);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        return res.end(
            JSON.stringify({ success: false, message: "Database connection failed" })
        );
    }

    return app(req, res);
}