import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/authRoute";
import errorHandler from "./middleware/errorHandler";

const app = express();

// Middlewares

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routes

app.get("/", (req, res) => {
    return res.status(200).json({ success: true, message: "EstateFlow CRM API is running" });
});

app.use("/auth", authRoute);

// 404 Handler

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handler

app.use(errorHandler);

export default app;
