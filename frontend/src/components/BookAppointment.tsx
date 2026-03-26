import { useState } from "react";
import toast from "react-hot-toast";
import type { Doctor } from "../types";
import { appointmentService } from "../services/appointment.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  doctors: Doctor[];
  onClose: () => void;
  onSuccess: () => void;
}

const BookAppointment = ({ doctors, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

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

  const handleBook = async () => {
    if (!selectedDoc || !date || !time) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      await appointmentService.book({
        doctorId: selectedDoc,
        date,
        time,
        symptoms,
      });
      toast.success("Appointment booked successfully!");
      onSuccess();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Book Appointment</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              x
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Select Doctor */}
          <div className="space-y-2">
            <Label className="text-gray-300">Select Doctor *</Label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.user?.name} - {doc.specialization} (Rs. {doc.fees})
                </option>
              ))}
            </select>
          </div>

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
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-colors
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

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBook}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointment;
