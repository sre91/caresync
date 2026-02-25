export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
}

export interface Doctor {
  _id: string;
  user: User;
  specialization: string;
  experience: number;
  fees: number;
  available: boolean;
  about: string;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: Doctor;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  symptoms: string;
  fees: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}
