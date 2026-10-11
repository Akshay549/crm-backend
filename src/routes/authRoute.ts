import { Router } from "express";
import validate from "../middleware/validate";
import { loginSchema } from "../validators/authValidator";
import { login } from "../controllers/authController";

const router = Router();

router.post("/login", validate(loginSchema), login);

export default router;
