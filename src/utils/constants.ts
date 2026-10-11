// Allowed values shared by the Mongoose models and the Zod validators
export const propertyTypes = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Plot", "Commercial"] as const;
export const sources = ["Facebook", "Google", "Referral", "Walk-in", "Website", "Other"] as const;
export const statuses = ["New", "Contacted", "Site Visit", "Closed"] as const;
