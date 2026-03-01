import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { appointmentService } from "../services/appointment.service";
import { doctorService } from "../services/doctor.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import BookAppointment from "../components/BookAppointment";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);

  const { data: appointmentsData, refetch } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: appointmentService.getMyAppointments,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorService.getAll,
  });

  const appointments = appointmentsData?.appointments || [];
  const doctors = doctorsData?.doctors || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await appointmentService.cancel(id);
      toast.success("Appointment cancelled!");
      refetch();
    } catch {
      toast.error("Failed to cancel appointment!");
    }
  };

  // Badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">CareSync AI</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {appointments.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-400">
              {appointments.filter((a) => a.status === "confirmed").length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-400">{doctors.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Book Appointment Button */}
      <div className="mb-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowBooking(true)}
        >
          + Book New Appointment
        </Button>
      </div>

      {/* Book Appointment Modal */}
      {showBooking && (
        <BookAppointment
          doctors={doctors}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            refetch();
          }}
        />
      )}

      {/* Appointments List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">My Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No appointments yet!</p>
              <p className="text-gray-500 text-sm mt-2">
                Click "Book New Appointment" to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div>
                    <p className="text-white font-medium">
                      Dr. {appointment.doctor?.user?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {appointment.doctor?.specialization}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(appointment.date).toLocaleDateString()} |{" "}
                      {appointment.time}
                    </p>
                    {appointment.symptoms && (
                      <p className="text-gray-500 text-sm mt-1">
                        Symptoms: {appointment.symptoms}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                    {appointment.status === "pending" && (
                      <Button
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="text-red-400 border-red-800 hover:bg-red-950 text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
