import { Schema, model } from "mongoose";
import { propertyTypes, sources, statuses } from "../utils/constants";
import { toJsonOptions } from "../utils/toJsonOptions";

const leadSchema = new Schema(
    {
        leadId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be at most 50 characters"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^\d{10}$/, "Phone number must be 10 digits"],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
        budget: {
            type: Number,
            required: [true, "Budget is required"],
            min: [1, "Budget must be greater than 0"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
            minlength: [2, "Location must be at least 2 characters"],
            maxlength: [100, "Location must be at most 100 characters"],
        },
        propertyType: {
            type: String,
            required: [true, "Property type is required"],
            enum: { values: propertyTypes, message: "{VALUE} is not a valid property type" },
        },
        source: {
            type: String,
            required: [true, "Lead source is required"],
            enum: { values: sources, message: "{VALUE} is not a valid lead source" },
        },
        status: {
            type: String,
            enum: { values: statuses, message: "{VALUE} is not a valid status" },
            default: "New",
        },
    },
    { timestamps: true, toJSON: toJsonOptions }
);

const Lead = model("Lead", leadSchema);

export default Lead;
