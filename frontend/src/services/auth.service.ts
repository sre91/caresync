import API from "../lib/axios";
import type { AuthResponse } from "../types";

export const authService = {
  signup: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AuthResponse> => {
    const response = await API.post("/auth/signup", data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await API.post("/auth/login", data);
    return response.data;
  },

  getMe: async () => {
    const response = await API.get("/auth/me");
    return response.data;
  },
};
