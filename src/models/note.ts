import { Schema, model } from "mongoose";
import { toJsonOptions } from "../utils/toJsonOptions";

const noteSchema = new Schema(
    {
        leadId: {
            type: Schema.Types.ObjectId,
            ref: "Lead",
            required: true,
            index: true,
        },
        text: {
            type: String,
            required: [true, "Note text is required"],
            trim: true,
            maxlength: [1000, "Note must be at most 1000 characters"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, toJSON: toJsonOptions }
);

const Note = model("Note", noteSchema);

export default Note;
