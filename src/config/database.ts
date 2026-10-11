import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Serverless functions are reused between requests, so we keep the
// connection promise and avoid opening a new connection every time.
let connection: Promise<typeof mongoose> | null = null;

const connectDb = async () => {
    if (!connection) {
        connection = mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    }

    try {
        await connection;
    } catch (error) {
        connection = null; // allow a retry on the next request
        throw error;
    }
};

export default connectDb;
