import { Router } from "express";
import { signup, login, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// Public routes - no token needed
router.post("/signup", signup);
router.post("/login", login);

// Protected route - token required
router.get("/me", protect, getMe);

export default router;
