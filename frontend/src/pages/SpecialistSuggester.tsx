import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { aiService } from "../services/ai.service";
import { doctorService } from "../services/doctor.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import type { SpecialistSuggestion } from "../types";

const specialists = [
  {
    name: "Cardiologist",
    icon: "heart",
    desc: "Heart and cardiovascular system",
  },
  {
    name: "Dermatologist",
    icon: "skin",
    desc: "Skin, hair and nail conditions",
  },
  { name: "Neurologist", icon: "brain", desc: "Brain and nervous system" },
  { name: "Orthopedist", icon: "bone", desc: "Bones, joints and muscles" },
  {
    name: "Gastroenterologist",
    icon: "stomach",
    desc: "Digestive system disorders",
  },
  {
    name: "Pulmonologist",
    icon: "lungs",
    desc: "Lungs and respiratory system",
  },
  {
    name: "General Physician",
    icon: "doctor",
    desc: "General health and common illness",
  },
];

const SpecialistSuggester = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [suggestion, setSuggestion] = useState<SpecialistSuggestion | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  // Get all doctors to filter by specialization
  const { data: doctorsData } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorService.getAll,
  });

  const doctors = doctorsData?.doctors || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out!");
  };

  const handleGetSuggestion = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms!");
      return;
    }
    try {
      setLoading(true);
      setSuggestion(null);
      const response = await aiService.getSpecialist(symptoms);
      setSuggestion(response.suggestion);
      setSelectedSpec(response.suggestion.specialist);
      toast.success("AI suggestion ready!");
    } catch {
      toast.error("AI service unavailable!");
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

  // Filter doctors by selected specialization
  const filteredDoctors = selectedSpec
    ? doctors.filter((doc) =>
        doc.specialization.toLowerCase().includes(selectedSpec.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">CareSync AI</h1>
          <p className="text-gray-400 mt-1">AI Specialist Suggester</p>
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

      <div className="max-w-4xl mx-auto">
        {/* Symptom Input */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">
              What are your symptoms?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              rows={4}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Button
              onClick={handleGetSuggestion}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-11"
            >
              {loading ? "AI is thinking..." : "Find Best Specialist"}
            </Button>
          </CardContent>
        </Card>

        {/* AI Suggestion Result */}
        {suggestion && !loading && (
          <Card className="bg-gray-900 border-blue-800 border-2 mb-6">
            <CardHeader>
              <CardTitle className="text-blue-400">AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    Best specialist for your symptoms
                  </p>
                  <h2 className="text-3xl font-bold text-white">
                    {suggestion.specialist}
                  </h2>
                  <p className="text-gray-400 mt-2">{suggestion.reason}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg border text-sm font-bold shrink-0 ${getUrgencyColor(suggestion.urgency)}`}
                >
                  {suggestion.urgency} Urgency
                </div>
              </div>

              {/* Matching Doctors */}
              {filteredDoctors.length > 0 ? (
                <div>
                  <p className="text-gray-400 text-sm mb-3">
                    Available {suggestion.specialist}s in CareSync AI
                  </p>
                  <div className="space-y-3">
                    {filteredDoctors.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {doc.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              Dr. {doc.user?.name}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {doc.experience} years | Rs. {doc.fees}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-sm"
                          onClick={() => navigate("/doctors")}
                        >
                          Book Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
                  <p className="text-gray-400 text-sm">
                    No {suggestion.specialist} available yet!
                  </p>
                  <Button
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate("/doctors")}
                  >
                    Browse All Doctors
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Specialists Grid */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">
            Browse by Specialist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialists.map((spec) => {
              const availableDocs = doctors.filter((doc) =>
                doc.specialization
                  .toLowerCase()
                  .includes(spec.name.toLowerCase()),
              );

              const isSelected = selectedSpec === spec.name;
              const isAISuggested = suggestion?.specialist === spec.name;

              return (
                <Card
                  key={spec.name}
                  className={`cursor-pointer transition-all border-2 ${
                    isAISuggested
                      ? "border-blue-500 bg-gray-800"
                      : isSelected
                        ? "border-gray-600 bg-gray-800"
                        : "border-gray-800 bg-gray-900 hover:border-gray-600"
                  }`}
                  onClick={() =>
                    setSelectedSpec(
                      selectedSpec === spec.name ? null : spec.name,
                    )
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold">
                          {spec.name}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {spec.desc}
                        </p>
                        <p className="text-blue-400 text-sm mt-2">
                          {availableDocs.length} doctor
                          {availableDocs.length !== 1 ? "s" : ""} available
                        </p>
                      </div>
                      {isAISuggested && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          AI Pick
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistSuggester;
