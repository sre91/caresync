import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { doctorService } from "../services/doctor.service";
import { appointmentService } from "../services/appointment.service";
import toast from "react-hot-toast";
import type { Doctor } from "../types";

const PARTICLES = [
  {
    top: "8%",
    left: "12%",
    size: 4,
    color: "rgba(167,139,250,0.6)",
    delay: "0s",
    dur: "3s",
  },
  {
    top: "20%",
    left: "85%",
    size: 3,
    color: "rgba(236,72,153,0.5)",
    delay: "1s",
    dur: "4s",
  },
  {
    top: "70%",
    left: "8%",
    size: 5,
    color: "rgba(96,165,250,0.4)",
    delay: "0.5s",
    dur: "3.5s",
  },
  {
    top: "80%",
    left: "90%",
    size: 3,
    color: "rgba(167,139,250,0.5)",
    delay: "2s",
    dur: "2.5s",
  },
];

const TIME_SLOTS = [
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

  const inputStyle = {
    width: "100%",
    background: "rgba(139,92,246,0.08)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "white",
    fontSize: "13px",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06001a",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 15% 30%, rgba(120,40,200,0.25) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 85% 70%, rgba(200,40,120,0.2) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            animation: `float ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "16px",
            padding: "16px 24px",
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 500,
                background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CareSync AI
            </div>
            <div
              style={{
                color: "rgba(167,139,250,0.5)",
                fontSize: "12px",
                marginTop: "2px",
              }}
            >
              Find and Book a Doctor
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/patient/dashboard")}
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "rgba(167,139,250,0.8)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "rgba(167,139,250,0.8)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          placeholder="Search by doctor name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            marginBottom: "20px",
            padding: "12px 16px",
            fontSize: "14px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "16px",
              }}
            >
              Available Doctors ({filteredDoctors.length})
            </h2>

            {filteredDoctors.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "rgba(139,92,246,0.05)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  borderRadius: "16px",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>👨‍⚕️</div>
                <p style={{ color: "rgba(167,139,250,0.5)", fontSize: "14px" }}>
                  No doctors found!
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => setSelectedDoctor(doc)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      background:
                        selectedDoctor?._id === doc._id
                          ? "rgba(139,92,246,0.15)"
                          : "rgba(139,92,246,0.05)",
                      border: `1px solid ${
                        selectedDoctor?._id === doc._id
                          ? "rgba(139,92,246,0.5)"
                          : "rgba(139,92,246,0.15)"
                      }`,
                      borderRadius: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDoctor?._id !== doc._id) {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(139,92,246,0.35)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDoctor?._id !== doc._id) {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(139,92,246,0.15)";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "18px",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {doc.user?.name?.charAt(0) || "D"}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Dr. {doc.user?.name}
                      </p>
                      <p
                        style={{
                          color: "#a78bfa",
                          fontSize: "12px",
                          marginTop: "2px",
                        }}
                      >
                        {doc.specialization}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(167,139,250,0.5)",
                            fontSize: "11px",
                          }}
                        >
                          {doc.experience} yrs exp
                        </span>
                        <span
                          style={{
                            color: "#34d399",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          Rs. {doc.fees}
                        </span>
                      </div>
                      {doc.about && (
                        <p
                          style={{
                            color: "rgba(167,139,250,0.4)",
                            fontSize: "11px",
                            marginTop: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.about}
                        </p>
                      )}
                    </div>

                    {selectedDoctor?._id === doc._id && (
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #7c3aed, #ec4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Booking Form */}
          <div>
            <h2
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "16px",
              }}
            >
              Book Appointment
            </h2>

            <div
              style={{
                background: "rgba(139,92,246,0.07)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "20px",
                padding: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              {selectedDoctor ? (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <p
                    style={{ color: "rgba(167,139,250,0.6)", fontSize: "11px" }}
                  >
                    Selected Doctor
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 500,
                      marginTop: "4px",
                    }}
                  >
                    Dr. {selectedDoctor.user?.name}
                  </p>
                  <p
                    style={{
                      color: "#a78bfa",
                      fontSize: "12px",
                      marginTop: "2px",
                    }}
                  >
                    {selectedDoctor.specialization} | Rs. {selectedDoctor.fees}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{ color: "rgba(167,139,250,0.4)", fontSize: "13px" }}
                  >
                    Select a doctor from the list!
                  </p>
                </div>
              )}

              {/* Date */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    color: "rgba(167,139,250,0.8)",
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={inputStyle}
                />
              </div>

              {/* Time Slots */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    color: "rgba(167,139,250,0.8)",
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Select Time
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "6px",
                  }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      style={{
                        padding: "7px 4px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background:
                          time === slot
                            ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                            : "rgba(139,92,246,0.08)",
                        border:
                          time === slot
                            ? "none"
                            : "1px solid rgba(139,92,246,0.2)",
                        color:
                          time === slot ? "white" : "rgba(167,139,250,0.7)",
                        boxShadow:
                          time === slot
                            ? "0 0 15px rgba(124,58,237,0.3)"
                            : "none",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    color: "rgba(167,139,250,0.8)",
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Symptoms (optional)
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "none",
                    fontFamily: "sans-serif",
                  }}
                />
              </div>

              {selectedDoctor && date && time && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: "10px",
                    marginBottom: "16px",
                    fontSize: "12px",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(167,139,250,0.6)",
                      marginBottom: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Booking Summary
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "3px",
                    }}
                  >
                    Doctor : Dr. {selectedDoctor.user?.name}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "3px",
                    }}
                  >
                    Date : {new Date(date).toLocaleDateString()}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "3px",
                    }}
                  >
                    Time : {time}
                  </p>
                  <p style={{ color: "#34d399", fontWeight: 500 }}>
                    Fees : Rs. {selectedDoctor.fees}
                  </p>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={loading || !selectedDoctor || !date || !time}
                style={{
                  width: "100%",
                  background:
                    loading || !selectedDoctor || !date || !time
                      ? "rgba(124,58,237,0.3)"
                      : "linear-gradient(135deg, #7c3aed, #ec4899)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "13px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor:
                    loading || !selectedDoctor || !date || !time
                      ? "not-allowed"
                      : "pointer",
                  boxShadow:
                    loading || !selectedDoctor || !date || !time
                      ? "none"
                      : "0 0 25px rgba(124,58,237,0.4)",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        input::placeholder, textarea::placeholder {
          color: rgba(167,139,250,0.3);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5) sepia(1) saturate(5) hue-rotate(220deg);
        }
      `}</style>
    </div>
  );
};

export default Doctors;
