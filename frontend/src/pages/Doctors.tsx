import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doctorService } from "../services/doctor.service";
import { appointmentService } from "../services/appointment.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import type { Doctor } from "../types";

const Doctors = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorService.getAll,
  });

  const doctors = data?.doctors || [];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  // Filter doctors by search
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBook = async () => {
    if (!selectedDoctor || !date || !time) {
      toast.error("Please select doctor, date and time!");
      return;
    }
    try {
      setLoading(true);
      await appointmentService.book({
        doctorId: selectedDoctor._id,
        date,
        time,
        symptoms,
      });
      toast.success("Appointment booked successfully!");
      setSelectedDoctor(null);
      setDate("");
      setTime("");
      setSymptoms("");
      navigate("/patient/dashboard");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">CareSync AI</h1>
          <p className="text-gray-400 mt-1">Find and Book a Doctor</p>
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

      <div className="mb-6">
        <Input
          placeholder="Search by doctor name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-900 border-gray-700 text-white max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">
            Available Doctors ({filteredDoctors.length})
          </h2>

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No doctors found!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor._id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedDoctor?._id === doctor._id
                      ? "border-blue-500 bg-gray-800"
                      : "border-gray-800 bg-gray-900 hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {doctor.user?.name?.charAt(0) || "D"}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">
                          Dr. {doctor.user?.name}
                        </h3>
                        <p className="text-blue-400 text-sm">
                          {doctor.specialization}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-gray-400 text-sm">
                            {doctor.experience} years exp
                          </span>
                          <span className="text-green-400 text-sm font-medium">
                            Rs. {doctor.fees}
                          </span>
                        </div>
                        {doctor.about && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {doctor.about}
                          </p>
                        )}
                      </div>

                      {selectedDoctor?._id === doctor._id && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white font-semibold text-lg mb-4">
            Book Appointment
          </h2>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 space-y-5">
              {selectedDoctor ? (
                <div className="p-3 bg-blue-950 rounded-lg border border-blue-800">
                  <p className="text-blue-300 text-sm">Selected Doctor</p>
                  <p className="text-white font-medium mt-1">
                    Dr. {selectedDoctor.user?.name}
                  </p>
                  <p className="text-blue-400 text-sm">
                    {selectedDoctor.specialization} | Rs. {selectedDoctor.fees}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm text-center">
                    Select a doctor from the list!
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-300">Select Date *</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Select Time *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 px-2 rounded-md text-xs font-medium transition-colors
                        ${
                          time === slot
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Symptoms (optional)</Label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms..."
                  rows={3}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={handleBook}
                disabled={loading || !selectedDoctor || !date || !time}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>

              {selectedDoctor && date && time && (
                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 text-sm">
                  <p className="text-gray-400 font-medium mb-2">
                    Booking Summary
                  </p>
                  <p className="text-white">
                    Doctor : Dr. {selectedDoctor.user?.name}
                  </p>
                  <p className="text-white">
                    Date : {new Date(date).toLocaleDateString()}
                  </p>
                  <p className="text-white">Time : {time}</p>
                  <p className="text-green-400 font-medium mt-1">
                    Fees : Rs. {selectedDoctor.fees}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
