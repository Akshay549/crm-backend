import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDb from "../config/database";
import User from "../models/user";

// Optional - to get sample users
const seedUser = async () => {
    await connectDb();

    const existingUser = await User.findOne({ email: "demo@estateflow.in" });

    if (existingUser) {
        console.log("Demo user already exists");
    } else {
        await User.create({
            name: "Akshay",
            email: "demo@estateflow.in",
            password: await bcrypt.hash("demo1234", 10),
            role: "Sales Executive",
        });
        console.log("Demo user created: demo@estateflow.in / demo1234");
    }

    await mongoose.disconnect();
};

seedUser().catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
});
