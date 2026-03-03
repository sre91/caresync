import { Request, Response } from "express";
import Appointment from "../models/Appointment.model";
import Doctor from "../models/Doctor.model";
import User from "../models/user.model";
import {
  sendBookingConfirmation,
  sendAppointmentConfirmed,
  sendCancellationEmail,
} from "../services/email.service";

// Book Appointment
export const bookAppointment = async (req: any, res: Response) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
      return;
    }

    // Check if doctor is available
    if (!doctor.available) {
      res.status(400).json({
        success: false,
        message: "Doctor is not available!",
      });
      return;
    }

    // Check if slot already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $nin: ["cancelled"] },
    });

    if (existingAppointment) {
      res.status(400).json({
        success: false,
        message: "This slot is already booked!",
      });
      return;
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date: new Date(date),
      time,
      symptoms: symptoms || "",
      fees: doctor.fees,
      status: "pending",
    });

    // Populate details
    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    // Send confirmation email
    const patientUser = await User.findById(req.user.id);
    const doctorUser = await User.findById(doctor.user);

    if (patientUser && doctorUser) {
      sendBookingConfirmation(
        patientUser.email,
        patientUser.name,
        doctorUser.name,
        new Date(date).toLocaleDateString(),
        time,
        doctor.fees,
      );
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Get Patient Appointments
export const getPatientAppointments = async (req: any, res: Response) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Get Doctor Appointments
export const getDoctorAppointments = async (req: any, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found!",
      });
      return;
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Get Single Appointment
export const getAppointmentById = async (req: any, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Update Appointment Status
export const updateAppointmentStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found!",
      });
      return;
    }

    // Patient can only cancel
    if (req.user.role === "patient" && status !== "cancelled") {
      res.status(403).json({
        success: false,
        message: "Patients can only cancel appointments!",
      });
      return;
    }

    appointment.status = status;
    await appointment.save();

    // Send emails based on new status
    const populatedAppointment = await Appointment.findById(req.params.id)
      .populate("patient")
      .populate({ path: "doctor", populate: { path: "user" } });

    const patient = populatedAppointment?.patient as any;
    const doctor = populatedAppointment?.doctor as any;

    if (status === "confirmed" && patient && doctor) {
      sendAppointmentConfirmed(
        patient.email,
        patient.name,
        doctor.user.name,
        new Date(appointment.date).toLocaleDateString(),
        appointment.time,
      );
    }

    if (status === "cancelled" && patient && doctor) {
      sendCancellationEmail(
        patient.email,
        patient.name,
        doctor.user.name,
        new Date(appointment.date).toLocaleDateString(),
        appointment.time,
      );
    }

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully!`,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Delete Appointment
export const deleteAppointment = async (req: any, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
