import API from "../lib/axios";

export const aiService = {
  // Analyze symptoms
  analyzeSymptoms: async (symptoms: string) => {
    const response = await API.post("/ai/symptoms", { symptoms });
    return response.data;
  },

  // Get specialist suggestion
  getSpecialist: async (symptoms: string) => {
    const response = await API.post("/ai/specialist", { symptoms });
    return response.data;
  },

  // Get health summary
  getHealthSummary: async () => {
    const response = await API.get("/ai/summary");
    return response.data;
  },
};
