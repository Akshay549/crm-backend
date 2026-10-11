import { Request, Response } from "express";
import Lead from "../models/lead";
import { sources, statuses } from "../utils/constants";

type GroupCount = { _id: string; count: number };

export const getDashboardStats = async (req: Request, res: Response) => {
    const [totalLeads, statusCounts, sourceCounts, recentLeads] = await Promise.all([
        Lead.countDocuments(),
        Lead.aggregate<GroupCount>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Lead.aggregate<GroupCount>([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
        Lead.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Every status and source is listed, even when its count is 0
    const countOf = (list: GroupCount[], name: string) => list.find((item) => item._id === name)?.count ?? 0;
    const percentOf = (count: number) => (totalLeads === 0 ? 0 : Math.round((count / totalLeads) * 100));

    const closedDeals = countOf(statusCounts, "Closed");
    const siteVisits = countOf(statusCounts, "Site Visit");

    return res.status(200).json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: {
            totalLeads,
            closedDeals,
            siteVisits,
            conversionRate: percentOf(closedDeals),
            leadsBySource: sources.map((source) => ({ source, count: countOf(sourceCounts, source) })),
            statusDistribution: statuses.map((status) => {
                const count = countOf(statusCounts, status);
                return { status, count, percentage: percentOf(count) };
            }),
            recentLeads,
        },
    });
};
