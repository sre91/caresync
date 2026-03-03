import { Router } from "express";
import { signup, login, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validateSignup, validateLogin } from "../middleware/validate";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/me", protect, getMe);

export default router;
