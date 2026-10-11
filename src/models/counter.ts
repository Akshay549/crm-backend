import { Schema, model } from "mongoose";

// Keeps a running number so every lead gets an id like LD-1001
const counterSchema = new Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 },
});

const Counter = model("Counter", counterSchema);

export default Counter;
