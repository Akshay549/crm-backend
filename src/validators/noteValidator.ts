import { z } from "zod";

export const createNoteSchema = z.object({
    text: z
        .string({ error: "Note text is required" })
        .trim()
        .min(1, "Note text is required")
        .max(1000, "Note must be at most 1000 characters"),
});
