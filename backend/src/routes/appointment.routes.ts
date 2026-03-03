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
import { validateAppointment } from "../middleware/validate";

const router = Router();

router.post(
  "/",
  protect,
  authorize("patient"),
  validateAppointment,
  bookAppointment,
);

router.get(
  "/my-appointments",
  protect,
  authorize("patient"),
  getPatientAppointments,
);

router.get(
  "/doctor-appointments",
  protect,
  authorize("doctor"),
  getDoctorAppointments,
);

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

router.delete("/:id", protect, authorize("admin"), deleteAppointment);

export default router;
