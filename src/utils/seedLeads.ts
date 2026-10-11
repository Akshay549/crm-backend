import "dotenv/config";
import mongoose from "mongoose";
import connectDb from "../config/database";
import Lead from "../models/lead";
import Note from "../models/note";
import User from "../models/user";
import { generateLeadId } from "./generateLeadId";

// Sample leads (newest first). daysAgo sets how old the lead is.
const sampleLeads = [
    { name: "Priya Sharma", phone: "9876543210", email: "priya.sharma@example.com", budget: 12500000, location: "Powai, Mumbai", propertyType: "3 BHK", source: "Google", status: "Site Visit", daysAgo: 1, note: "Prefers a higher floor with a balcony. Site visit planned for Saturday." },
    { name: "Rahul Mehta", phone: "9820123456", email: "rahul.mehta@example.com", budget: 8500000, location: "Thane West", propertyType: "2 BHK", source: "Referral", status: "Contacted", daysAgo: 2, note: "Discussed budget and possession timeline. Follow up tomorrow." },
    { name: "Sneha Patil", phone: "9765432109", email: "sneha.p@example.com", budget: 6200000, location: "Navi Mumbai", propertyType: "2 BHK", source: "Facebook", status: "New", daysAgo: 3 },
    { name: "Amit Desai", phone: "9892012345", email: "amit.desai@example.com", budget: 22000000, location: "Bandra East, Mumbai", propertyType: "4+ BHK", source: "Website", status: "Closed", daysAgo: 4, note: "Deal closed. Booking amount received." },
    { name: "Neha Kulkarni", phone: "9819012345", email: "", budget: 4500000, location: "Kalyan", propertyType: "1 BHK", source: "Walk-in", status: "Contacted", daysAgo: 5 },
    { name: "Vikram Joshi", phone: "9930123456", email: "vikram.j@example.com", budget: 15000000, location: "Andheri West", propertyType: "3 BHK", source: "Google", status: "Site Visit", daysAgo: 6 },
    { name: "Pooja Nair", phone: "9821012345", email: "pooja.nair@example.com", budget: 3200000, location: "Karjat", propertyType: "Plot", source: "Facebook", status: "New", daysAgo: 7 },
    { name: "Karan Shah", phone: "9898765432", email: "karan.shah@example.com", budget: 9500000, location: "Goregaon East", propertyType: "2 BHK", source: "Referral", status: "Contacted", daysAgo: 8 },
    { name: "Anjali Rao", phone: "9760012345", email: "anjali.rao@example.com", budget: 18000000, location: "Worli, Mumbai", propertyType: "Commercial", source: "Other", status: "Closed", daysAgo: 9 },
    { name: "Siddharth More", phone: "9811122233", email: "sid.more@example.com", budget: 7200000, location: "Mira Road", propertyType: "2 BHK", source: "Website", status: "New", daysAgo: 10 },
    { name: "Meera Iyer", phone: "9833344455", email: "meera.iyer@example.com", budget: 11000000, location: "Chembur, Mumbai", propertyType: "3 BHK", source: "Google", status: "New", daysAgo: 11 },
    { name: "Rohan Gupta", phone: "9867788990", email: "", budget: 4800000, location: "Dombivli", propertyType: "1 BHK", source: "Walk-in", status: "Contacted", daysAgo: 12 },
];

// Run once: npm run seed:leads  (run npm run seed:user first)
const seedLeads = async () => {
    await connectDb();

    const user = await User.findOne({ email: "demo@estateflow.in" });
    if (!user) {
        throw new Error("Demo user not found. Run npm run seed:user first.");
    }

    if ((await Lead.countDocuments()) > 0) {
        console.log("Leads already exist, nothing to do");
    } else {
        // Oldest first, so the newest lead gets the highest lead id
        for (const { daysAgo, note, ...data } of [...sampleLeads].reverse()) {
            const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            const lead = await Lead.create({ ...data, leadId: await generateLeadId(), createdAt });

            if (note) {
                await Note.create({ leadId: lead._id, text: note, createdBy: user._id, authorName: user.name });
            }
        }
        console.log(`${sampleLeads.length} sample leads created`);
    }

    await mongoose.disconnect();
};

seedLeads().catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
});
