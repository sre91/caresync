import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { appointmentService } from "../services/appointment.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch doctor appointments
  const { data, refetch } = useQuery({
    queryKey: ["doctorAppointments"],
    queryFn: appointmentService.getDoctorAppointments,
  });

  const appointments = data?.appointments || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await appointmentService.updateStatus(id, status);
      toast.success(`Appointment ${status}!`);
      refetch();
    } catch {
      toast.error("Failed to update appointment!");
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
          <p className="text-gray-400 mt-1">
            Dr. {user?.name} - Doctor Dashboard
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {appointments.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-400">
              {appointments.filter((a) => a.status === "pending").length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-400">
              {appointments.filter((a) => a.status === "confirmed").length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-400">
              {appointments.filter((a) => a.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">My Patients</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No appointments yet!</p>
              <p className="text-gray-500 text-sm mt-2">
                Patients will appear here when they book with you!
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
                      {appointment.patient?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {appointment.patient?.email}
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
                    <p className="text-blue-400 text-sm mt-1">
                      Fees: Rs. {appointment.fees}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>

                    {appointment.status === "pending" && (
                      <Button
                        onClick={() =>
                          handleUpdateStatus(appointment._id, "confirmed")
                        }
                        className="bg-green-600 hover:bg-green-700 text-xs h-8"
                      >
                        Confirm
                      </Button>
                    )}

                    {appointment.status === "confirmed" && (
                      <Button
                        onClick={() =>
                          handleUpdateStatus(appointment._id, "completed")
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                      >
                        Complete
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

export default DoctorDashboard;
