import { Router } from "express";
import validate from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { loginSchema } from "../validators/authValidator";
import { login, getMe, logout } from "../controllers/authController";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, getMe);
router.post("/logout", logout);

export default router;
