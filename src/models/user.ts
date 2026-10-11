import { Schema, model } from "mongoose";

export const roles = ["Admin", "Sales Executive"] as const;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be at most 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        // select: false -> password is never returned unless asked for explicitly
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        role: {
            type: String,
            enum: { values: roles, message: "{VALUE} is not a valid role" },
            default: "Sales Executive",
        },
    },
    { timestamps: true }
);

const User = model("User", userSchema);

export default User;
