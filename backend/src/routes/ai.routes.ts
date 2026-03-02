import { Router } from "express";
import {
  analyzeSymptoms,
  getSpecialistSuggestion,
  getHealthSummary,
} from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All AI routes need login
router.post("/symptoms", protect, analyzeSymptoms);
router.post("/specialist", protect, getSpecialistSuggestion);
router.get("/summary", protect, getHealthSummary);

export default router;
