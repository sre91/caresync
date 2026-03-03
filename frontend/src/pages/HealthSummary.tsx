import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { aiService } from "../services/ai.service";
import { appointmentService } from "../services/appointment.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

const HealthSummary = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out!");
  };

  // Fetch appointments for stats
  const { data: appointmentsData } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: appointmentService.getMyAppointments,
  });

  const appointments = appointmentsData?.appointments || [];

  // Calculate stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed",
  ).length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled",
  ).length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed",
  ).length;

  // Get unique specializations visited
  const specializations = [
    ...new Set(
      appointments
        .filter((a) => a.doctor?.specialization)
        .map((a) => a.doctor.specialization),
    ),
  ];

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setSummary("");
      const response = await aiService.getHealthSummary();
      setSummary(response.summary);
      setGenerated(true);
      toast.success("Health summary generated!");
    } catch {
      toast.error("AI service unavailable!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">CareSync AI</h1>
          <p className="text-gray-400 mt-1">My Health Summary</p>
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
        {/* Welcome Card */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">{user?.name}</h2>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <p className="text-blue-400 text-sm mt-1">
                  CareSync AI Patient
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-white">
                {totalAppointments}
              </p>
              <p className="text-gray-400 text-xs mt-1">Total Visits</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">
                {completedAppointments}
              </p>
              <p className="text-gray-400 text-xs mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">
                {pendingAppointments}
              </p>
              <p className="text-gray-400 text-xs mt-1">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-400">
                {cancelledAppointments}
              </p>
              <p className="text-gray-400 text-xs mt-1">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Specializations Visited */}
        {specializations.length > 0 && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Specialists Visited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-blue-950 border border-blue-800 text-blue-300 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Summary Button */}
        {!generated && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Generate AI Health Summary
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Our AI will analyze your appointment history and create a
                personalized health report just for you!
              </p>
              <Button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {loading ? "Generating..." : "Generate My Health Summary"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-blue-400 font-medium">
                AI is analyzing your health history...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Creating your personalized health summary!
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Health Summary */}
        {summary && !loading && (
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">
                  Your Health Summary
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={handleGenerateSummary}
                  className="text-sm"
                >
                  Regenerate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <p className="text-blue-400 font-medium text-sm mb-3">
                      CareSync AI - Personal Health Report
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {summary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-950 rounded-lg border border-blue-800">
                <p className="text-blue-300 text-xs">
                  This AI summary is generated from your appointment history and
                  is for informational purposes only. Always consult your doctor
                  for medical decisions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/doctors")}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/symptom-checker")}
                >
                  Check Symptoms
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthSummary;
