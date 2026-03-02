import { Response } from "express";
import {
  checkSymptoms,
  suggestSpecialist,
  generateHealthSummary,
} from "../services/ai.service";
import Appointment from "../models/Appointment.model";

// Check Symptoms
export const analyzeSymptoms = async (req: any, res: Response) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      res.status(400).json({
        success: false,
        message: "Please provide symptoms!",
      });
      return;
    }

    const analysis = await checkSymptoms(symptoms);

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "AI service unavailable!",
    });
  }
};

// Suggest Specialist
export const getSpecialistSuggestion = async (req: any, res: Response) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      res.status(400).json({
        success: false,
        message: "Please provide symptoms!",
      });
      return;
    }

    const suggestionText = await suggestSpecialist(symptoms);

    // Parse JSON response from AI
    let suggestion;
    try {
      suggestion = JSON.parse(suggestionText);
    } catch {
      suggestion = {
        specialist: "General Physician",
        reason: "Please consult a doctor",
        urgency: "Medium",
      };
    }

    res.status(200).json({
      success: true,
      suggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "AI service unavailable!",
    });
  }
};

// Health Summary
export const getHealthSummary = async (req: any, res: Response) => {
  try {
    // Get patient appointments
    const appointments = await Appointment.find({
      patient: req.user.id,
      status: { $in: ["completed", "confirmed"] },
    })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name" },
      })
      .sort({ date: -1 })
      .limit(10);

    if (appointments.length === 0) {
      res.status(200).json({
        success: true,
        summary:
          "No appointment history found yet. Book your first appointment to get started with CareSync AI!",
      });
      return;
    }

    const summary = await generateHealthSummary(req.user.name, appointments);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "AI service unavailable!",
    });
  }
};
