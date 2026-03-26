import Groq from "groq-sdk";

const getGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY as string,
  });
};

// Check Symptoms
export const checkSymptoms = async (symptoms: string): Promise<string> => {
  console.log("GROQ KEY:", process.env.GROQ_API_KEY);
  const client = getGroqClient();
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a compassionate and knowledgeable medical assistant
          for CareSync AI, a healthcare appointment platform.

          ROLE: Help patients understand their symptoms in simple language.

          ALWAYS provide your response in this exact structure:
          - Possible Conditions: (list 2-3 likely conditions)
          - Severity Level: (Mild / Moderate / Severe)
          - Recommended Specialist: (one specialist type)
          - Home Care Tips: (2 simple tips)
          - Important Reminder: (one line about seeing a real doctor)

          RULES:
          - Use simple language a patient can understand
          - Never diagnose definitively
          - Never recommend specific medications
          - Keep response under 200 words
          - Be supportive and reassuring in tone`,
        },
        {
          role: "user",
          content: `Please analyze these patient symptoms: ${symptoms}`,
        },
      ],
      max_tokens: 350,
      temperature: 0.6,
    });
    return (
      response.choices[0]?.message?.content || "Unable to analyze symptoms"
    );
  } catch (error) {
    console.error("GROQ SYMPTOM ERROR:", error);
    throw error;
  }
};

// Suggest Specialist
export const suggestSpecialist = async (symptoms: string): Promise<string> => {
  const client = getGroqClient();
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a medical specialist recommender for CareSync AI.

          ROLE: Match patient symptoms to the most appropriate specialist.

          AVAILABLE SPECIALISTS ONLY:
          Cardiologist, Dermatologist, Neurologist, Orthopedist,
          Gastroenterologist, Pulmonologist, General Physician

          RULES:
          - Choose ONLY from the available specialists list above
          - Be decisive - recommend exactly ONE specialist
          - Keep reason under 15 words
          - Urgency must be exactly: Low, Medium, or High

          RESPOND IN THIS EXACT JSON FORMAT ONLY:
          {
            "specialist": "specialist name here",
            "reason": "one line reason under 15 words",
            "urgency": "Low or Medium or High"
          }

          Return ONLY the JSON object.
          No explanation. No markdown. No extra text.`,
        },
        {
          role: "user",
          content: `Patient symptoms: ${symptoms}`,
        },
      ],
      max_tokens: 120,
      temperature: 0.2,
    });
    return response.choices[0]?.message?.content || "{}";
  } catch (error) {
    console.error("GROQ SPECIALIST ERROR:", error);
    throw error;
  }
};

// Generate Health Summary
export const generateHealthSummary = async (
  patientName: string,
  appointments: any[],
): Promise<string> => {
  const client = getGroqClient();

  const appointmentText = appointments
    .map(
      (apt, index) =>
        `${index + 1}. Date: ${new Date(apt.date).toLocaleDateString()}, Specialist: ${apt.doctor?.specialization || "General"}, Symptoms: ${apt.symptoms || "Not recorded"}, Status: ${apt.status}`,
    )
    .join("\n");

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a personal health advisor for CareSync AI.

          ROLE: Generate warm, encouraging, personalized health summaries.

          STRUCTURE YOUR RESPONSE AS:
          - Health Overview: (2-3 sentences about overall health pattern)
          - Visit Patterns: (what specialists they visit most)
          - Health Trends: (any patterns you notice)
          - Encouragement: (one positive, motivating statement)
          - Recommendation: (one actionable health tip)

          TONE RULES:
          - Be warm, friendly and supportive
          - Use the patient name naturally
          - Be positive and encouraging
          - Keep under 180 words
          - Never be alarming or scary`,
        },
        {
          role: "user",
          content: `Generate a health summary for patient: ${patientName}

Appointment History:
${appointmentText}

Total appointments: ${appointments.length}`,
        },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });
    return (
      response.choices[0]?.message?.content || "Unable to generate summary"
    );
  } catch (error) {
    console.error("GROQ SUMMARY ERROR:", error);
    throw error;
  }
};
