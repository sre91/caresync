import { Request, Response } from "express";
import Doctor from "../models/Doctor.model";
import User from "../models/user.model";

// doc list
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({ available: true }).populate(
      "user",
      "name email",
    );

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Get Single Doctor
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Create Doctor Profile
// Only admin can create doctor profile
export const createDoctor = async (req: any, res: Response) => {
  try {
    const { userId, specialization, experience, fees, about } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
      return;
    }

    // Update user role to doctor
    await User.findByIdAndUpdate(userId, { role: "doctor" });

    // Create doctor profile
    const doctor = await Doctor.create({
      user: userId,
      specialization,
      experience,
      fees,
      about,
    });

    res.status(201).json({
      success: true,
      message: "Doctor profile created!",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Update Doctor Profile
export const updateDoctor = async (req: any, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile updated!",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Get Doctor Dashboard
export const getDoctorDashboard = async (req: any, res: Response) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate(
      "user",
      "name email",
    );

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
