import { Router } from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointment.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

// All appointment routes need login
// So we use protect on all!

// ── Patient Routes ────────────────────────
router.post("/", protect, authorize("patient"), bookAppointment);

router.get(
  "/my-appointments",
  protect,
  authorize("patient"),
  getPatientAppointments,
);

// ── Doctor Routes ─────────────────────────
router.get(
  "/doctor-appointments",
  protect,
  authorize("doctor"),
  getDoctorAppointments,
);

// ── Shared Routes ─────────────────────────
router.get(
  "/:id",
  protect,
  authorize("patient", "doctor", "admin"),
  getAppointmentById,
);

router.put(
  "/:id/status",
  protect,
  authorize("patient", "doctor", "admin"),
  updateAppointmentStatus,
);

// ── Admin Routes ──────────────────────────
router.delete("/:id", protect, authorize("admin"), deleteAppointment);

export default router;
