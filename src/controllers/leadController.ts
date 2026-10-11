import { Request, Response } from "express";
import Lead from "../models/lead";
import Note from "../models/note";
import AppError from "../utils/appError";
import { generateLeadId } from "../utils/generateLeadId";

const sortOptions: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    budget_desc: { budget: -1, createdAt: -1 },
    budget_asc: { budget: 1, createdAt: -1 },
};

// Makes text safe to use inside a regular expression
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createLead = async (req: Request, res: Response) => {
    const leadId = await generateLeadId();
    const lead = await Lead.create({ ...req.body, leadId });

    return res.status(201).json({
        success: true,
        message: "Lead created successfully",
        data: { lead },
    });
};

export const getLeads = async (req: Request, res: Response) => {
    const { search, source, status, sort, page, limit } = res.locals.query;

    const filter: Record<string, any> = {};

    if (source) filter.source = source;
    if (status) filter.status = status;

    // Search matches the name, or the phone number (spaces in the search text are ignored)
    if (search) {
        const conditions: Record<string, any>[] = [{ name: new RegExp(escapeRegex(search), "i") }];
        const digits = search.replace(/\D/g, "");
        if (digits) conditions.push({ phone: new RegExp(digits) });
        filter.$or = conditions;
    }

    const [leads, total] = await Promise.all([
        Lead.find(filter)
            .sort(sortOptions[sort])
            .skip((page - 1) * limit)
            .limit(limit),
        Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        message: "Leads fetched successfully",
        data: {
            leads,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        },
    });
};

export const getLeadById = async (req: Request, res: Response) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
        throw new AppError("Lead not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Lead fetched successfully",
        data: { lead },
    });
};

export const updateLead = async (req: Request, res: Response) => {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!lead) {
        throw new AppError("Lead not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Lead updated successfully",
        data: { lead },
    });
};

export const updateLeadStatus = async (req: Request, res: Response) => {
    const lead = await Lead.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
    );

    if (!lead) {
        throw new AppError("Lead not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Lead status updated successfully",
        data: { lead },
    });
};

export const deleteLead = async (req: Request, res: Response) => {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
        throw new AppError("Lead not found", 404);
    }

    // Notes cannot exist without their lead
    await Note.deleteMany({ leadId: lead._id });

    return res.status(200).json({
        success: true,
        message: "Lead deleted successfully",
    });
};
