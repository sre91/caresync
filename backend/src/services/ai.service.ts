import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Check Symptoms
export const checkSymptoms = async (symptoms: string): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a helpful medical assistant for CareSync AI.
        Your job is to analyze patient symptoms and provide:
        1. Possible conditions (2-3 likely conditions)
        2. Severity level (Mild / Moderate / Severe)
        3. Recommended specialist type
        4. Simple home care tips
        Keep response clear, simple and under 200 words.
        Always remind patient to consult a real doctor.
        Never diagnose definitively.`,
      },
      {
        role: "user",
        content: `Patient symptoms: ${symptoms}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "Unable to analyze symptoms";
};

// Suggest Specialist
export const suggestSpecialist = async (symptoms: string): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a medical specialist recommender for CareSync AI.
        Based on patient symptoms suggest the most appropriate specialist.
        Available specialists: Cardiologist, Dermatologist, Neurologist,
        Orthopedist, Gastroenterologist, Pulmonologist, General Physician.
        Respond in this exact JSON format:
        {
          "specialist": "specialist name",
          "reason": "one line reason",
          "urgency": "Low / Medium / High"
        }
        Return ONLY the JSON. No extra text.`,
      },
      {
        role: "user",
        content: `Patient symptoms: ${symptoms}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "{}";
};

// Generate Health Summary
export const generateHealthSummary = async (
  patientName: string,
  appointments: any[],
): Promise<string> => {
  const appointmentText = appointments
    .map(
      (apt) =>
        `Date: ${new Date(apt.date).toLocaleDateString()}, Doctor: ${apt.doctor?.user?.name}, Specialization: ${apt.doctor?.specialization}, Symptoms: ${apt.symptoms || "Not provided"}, Status: ${apt.status}`,
    )
    .join("\n");

  const response = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are a health summary generator for CareSync AI.
        Generate a brief, friendly health summary for a patient.
        Include: visit patterns, common symptoms, health trends.
        Keep it positive, supportive and under 150 words.
        Always encourage regular checkups.`,
      },
      {
        role: "user",
        content: `Patient: ${patientName}\n\nAppointment History:\n${appointmentText}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "Unable to generate summary";
};
