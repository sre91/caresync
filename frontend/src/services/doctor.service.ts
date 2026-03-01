import API from "../lib/axios";
import type { Doctor } from "../types";

export const doctorService = {
  // Get all doctors
  getAll: async (): Promise<{ doctors: Doctor[] }> => {
    const response = await API.get("/doctors");
    return response.data;
  },

  // Get single doctor
  getById: async (id: string): Promise<{ doctor: Doctor }> => {
    const response = await API.get(`/doctors/${id}`);
    return response.data;
  },

  // Get doctor dashboard
  getDashboard: async () => {
    const response = await API.get("/doctors/dashboard");
    return response.data;
  },
};
