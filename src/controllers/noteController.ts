import { Request, Response } from "express";
import Lead from "../models/lead";
import Note from "../models/note";
import AppError from "../utils/appError";

const checkLeadExists = async (id: string) => {
    const lead = await Lead.exists({ _id: id });

    if (!lead) {
        throw new AppError("Lead not found", 404);
    }
};

export const getNotes = async (req: Request, res: Response) => {
    const leadId = req.params.id as string;
    await checkLeadExists(leadId);

    const notes = await Note.find({ leadId }).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "Notes fetched successfully",
        data: { notes },
    });
};

export const addNote = async (req: Request, res: Response) => {
    const leadId = req.params.id as string;
    await checkLeadExists(leadId);

    const user = res.locals.user;

    const note = await Note.create({
        leadId,
        text: req.body.text,
        createdBy: user._id,
        authorName: user.name,
    });

    return res.status(201).json({
        success: true,
        message: "Note added successfully",
        data: { note },
    });
};
