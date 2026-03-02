import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { aiService } from "../services/ai.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

const SymptomChecker = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [specialist, setSpecialist] = useState<{
    specialist: string;
    reason: string;
    urgency: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out!");
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms!");
      return;
    }

    try {
      setLoading(true);
      setAnalysis("");
      setSpecialist(null);

      // Call both APIs at same time!
      const [analysisRes, specialistRes] = await Promise.all([
        aiService.analyzeSymptoms(symptoms),
        aiService.getSpecialist(symptoms),
      ]);

      setAnalysis(analysisRes.analysis);
      setSpecialist(specialistRes.suggestion);
    } catch {
      toast.error("AI service unavailable! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "text-red-400 bg-red-950 border-red-800";
      case "Medium":
        return "text-yellow-400 bg-yellow-950 border-yellow-800";
      case "Low":
        return "text-green-400 bg-green-950 border-green-800";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">CareSync AI</h1>
          <p className="text-gray-400 mt-1">AI Symptom Checker</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/patient/dashboard")}
          >
            Dashboard
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Describe Your Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: I have been having chest pain for 2 days, shortness of breath when climbing stairs, and mild fever..."
              rows={5}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
            />

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
            >
              {loading ? "AI is analyzing..." : "Analyze Symptoms"}
            </Button>

            <p className="text-gray-500 text-xs text-center">
              AI analysis is for guidance only. Always consult a real doctor for
              medical advice.
            </p>
          </CardContent>
        </Card>

        {loading && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-blue-400 font-medium">
                  AI is analyzing your symptoms...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This usually takes 2-3 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Specialist Suggestion */}
        {specialist && !loading && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white">
                Recommended Specialist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-400">
                    {specialist.specialist}
                  </h3>
                  <p className="text-gray-400 mt-1">{specialist.reason}</p>
                </div>

                <div
                  className={`px-4 py-2 rounded-lg border text-sm font-bold ${getUrgencyColor(specialist.urgency)}`}
                >
                  {specialist.urgency} Urgency
                </div>
              </div>

              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/doctors")}
              >
                Book Appointment with {specialist.specialist}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis */}
        {analysis && !loading && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">AI Health Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <p className="text-blue-400 font-medium text-sm mb-2">
                      CareSync AI Analysis
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {analysis}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-950 rounded-lg border border-yellow-800">
                <p className="text-yellow-400 text-xs">
                  Disclaimer: This AI analysis is for informational purposes
                  only and does not constitute medical advice. Please consult a
                  qualified healthcare professional for proper diagnosis.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
