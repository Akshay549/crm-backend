import "dotenv/config";
import app from "./app";
import connectDb from "./config/database";

// Local development only. On Vercel, api/index.ts is the entry point.
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
