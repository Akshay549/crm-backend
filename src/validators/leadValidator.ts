import { z } from "zod";
import { propertyTypes, sources, statuses } from "../utils/constants";

const oneOf = (label: string, values: readonly string[]) => `${label} must be one of: ${values.join(", ")}`;

// Fields shared by create and update
const leadFields = {
    name: z
        .string({ error: "Name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    // Spaces and symbols are removed, then exactly 10 digits are required
    phone: z
        .string({ error: "Phone number is required" })
        .transform((value) => value.replace(/\D/g, ""))
        .pipe(z.string().length(10, "Phone number must be 10 digits")),
    // Optional: an empty string is allowed
    email: z
        .string()
        .trim()
        .toLowerCase()
        .refine((value) => value === "" || z.email().safeParse(value).success, "Enter a valid email address")
        .optional(),
    budget: z
        .number({ error: (issue) => (issue.input === undefined ? "Budget is required" : "Budget must be a number") })
        .positive("Budget must be greater than 0")
        .max(10_000_000_000, "Budget is too large"),
    location: z
        .string({ error: "Location is required" })
        .trim()
        .min(2, "Location must be at least 2 characters")
        .max(100, "Location must be at most 100 characters"),
    propertyType: z.enum(propertyTypes, { error: oneOf("Property type", propertyTypes) }),
    source: z.enum(sources, { error: oneOf("Lead source", sources) }),
    status: z.enum(statuses, { error: oneOf("Status", statuses) }),
};

export const createLeadSchema = z.object({
    ...leadFields,
    status: leadFields.status.default("New"),
});

// Every field is optional on update, but at least one must be sent
export const updateLeadSchema = z
    .object(leadFields)
    .partial()
    .refine((data) => Object.keys(data).length > 0, "Send at least one field to update");

export const updateStatusSchema = z.object({
    status: leadFields.status,
});

// Query string of GET /leads
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const listLeadsQuerySchema = z.object({
    search: z.preprocess(emptyToUndefined, z.string().trim().max(50, "Search text is too long").optional()),
    source: z.preprocess(emptyToUndefined, z.enum(sources, { error: oneOf("Source", sources) }).optional()),
    status: z.preprocess(emptyToUndefined, z.enum(statuses, { error: oneOf("Status", statuses) }).optional()),
    sort: z.enum(["newest", "oldest", "budget_desc", "budget_asc"], {
        error: "Sort must be one of: newest, oldest, budget_desc, budget_asc",
    }).default("newest"),
    page: z.coerce.number({ error: "Page must be a number" }).int("Page must be a whole number").min(1, "Page must be at least 1").default(1),
    limit: z.coerce.number({ error: "Limit must be a number" }).int("Limit must be a whole number").min(1, "Limit must be at least 1").max(50, "Limit must be at most 50").default(10),
});
