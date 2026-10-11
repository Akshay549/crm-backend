import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/database";
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

// Start Server

const startServer = async () => {
    try {
        await connectDb();

        const port = process.env.EXPRESS_PORT;

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to database:", (error as Error).message);
        process.exit(1);
    }
};

startServer();
