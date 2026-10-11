import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getDashboardStats } from "../controllers/dashboardController";

const router = Router();

router.get("/stats", requireAuth, getDashboardStats);

export default router;
