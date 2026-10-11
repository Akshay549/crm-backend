import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // MongoDB deletes the document automatically once this date passes (TTL index)
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
});

const Session = model("Session", sessionSchema);

export default Session;
