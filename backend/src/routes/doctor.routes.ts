import { Router } from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  getDoctorDashboard,
} from "../controllers/doctor.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public Routes
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

// Protected Routes
router.get("/dashboard", protect, authorize("doctor"), getDoctorDashboard);

//Admin Only Routes
router.post("/", protect, authorize("admin", "doctor"), createDoctor);

//Doctor Only Routes
router.put("/:id", protect, authorize("doctor", "admin"), updateDoctor);

export default router;
