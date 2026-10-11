import Counter from "../models/counter";

export const generateLeadId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "lead" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    ).orFail();

    return `LD-${1000 + counter.value}`;
};
