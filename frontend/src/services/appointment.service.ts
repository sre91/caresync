import API from "../lib/axios";
import type { Appointment } from "../types";

export const appointmentService = {
  // Book new appointment
  book: async (data: {
    doctorId: string;
    date: string;
    time: string;
    symptoms: string;
  }) => {
    const response = await API.post("/appointments", data);
    return response.data;
  },

  getMyAppointments: async (): Promise<{ appointments: Appointment[] }> => {
    const response = await API.get("/appointments/my-appointments");
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await API.put(`/appointments/${id}/status`, {
      status: "cancelled",
    });
    return response.data;
  },
};
