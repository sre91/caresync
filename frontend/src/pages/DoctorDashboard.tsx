import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { appointmentService } from "../services/appointment.service";

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

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "rgba(52,211,153,0.15)",
          color: "#34d399",
          border: "rgba(52,211,153,0.3)",
        };
      case "pending":
        return {
          bg: "rgba(251,191,36,0.15)",
          color: "#fbbf24",
          border: "rgba(251,191,36,0.3)",
        };
      case "cancelled":
        return {
          bg: "rgba(248,113,113,0.15)",
          color: "#f87171",
          border: "rgba(248,113,113,0.3)",
        };
      case "completed":
        return {
          bg: "rgba(96,165,250,0.15)",
          color: "#60a5fa",
          border: "rgba(96,165,250,0.3)",
        };
      default:
        return {
          bg: "rgba(167,139,250,0.15)",
          color: "#a78bfa",
          border: "rgba(167,139,250,0.3)",
        };
    }
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
      {/* Nebula Background */}
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
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
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
              Dr. {user?.name} — Doctor Dashboard
            </div>
          </div>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total", value: appointments.length, color: "#a78bfa" },
            {
              label: "Pending",
              value: appointments.filter((a) => a.status === "pending").length,
              color: "#fbbf24",
            },
            {
              label: "Confirmed",
              value: appointments.filter((a) => a.status === "confirmed")
                .length,
              color: "#34d399",
            },
            {
              label: "Completed",
              value: appointments.filter((a) => a.status === "completed")
                .length,
              color: "#60a5fa",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(139,92,246,0.07)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "16px",
                padding: "20px",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                animation: "fadeUp 0.6s ease forwards",
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div
                style={{ fontSize: "36px", fontWeight: 500, color: s.color }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(167,139,250,0.5)",
                  marginTop: "6px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Appointments List */}
        <div
          style={{
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "20px",
            padding: "24px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: 500,
              marginBottom: "20px",
            }}
          >
            My Patients
          </h2>

          {appointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>👨‍⚕️</div>
              <p style={{ color: "rgba(167,139,250,0.5)", fontSize: "14px" }}>
                No appointments yet!
              </p>
              <p
                style={{
                  color: "rgba(167,139,250,0.3)",
                  fontSize: "12px",
                  marginTop: "6px",
                }}
              >
                Patients will appear here when they book with you!
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {appointments.map((apt) => {
                const sc = getStatusColor(apt.status);
                return (
                  <div
                    key={apt._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "rgba(139,92,246,0.05)",
                      border: "1px solid rgba(139,92,246,0.15)",
                      borderRadius: "12px",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(139,92,246,0.35)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(139,92,246,0.15)")
                    }
                  >
                    {/* Patient Info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #7c3aed, #ec4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        {apt.patient?.name?.charAt(0) || "P"}
                      </div>
                      <div>
                        <p
                          style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {apt.patient?.name}
                        </p>
                        <p
                          style={{
                            color: "rgba(167,139,250,0.5)",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          {apt.patient?.email}
                        </p>
                        <p
                          style={{
                            color: "rgba(167,139,250,0.4)",
                            fontSize: "11px",
                            marginTop: "4px",
                          }}
                        >
                          {new Date(apt.date).toLocaleDateString()} | {apt.time}
                        </p>
                        {apt.symptoms && (
                          <p
                            style={{
                              color: "rgba(167,139,250,0.4)",
                              fontSize: "11px",
                              marginTop: "2px",
                            }}
                          >
                            Symptoms: {apt.symptoms}
                          </p>
                        )}
                        <p
                          style={{
                            color: "#a78bfa",
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          Fees: Rs. {apt.fees}
                        </p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          borderRadius: "20px",
                          padding: "3px 12px",
                          fontSize: "11px",
                          fontWeight: 500,
                        }}
                      >
                        {apt.status}
                      </span>

                      {apt.status === "pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(apt._id, "confirmed")
                          }
                          style={{
                            background: "rgba(52,211,153,0.15)",
                            border: "1px solid rgba(52,211,153,0.3)",
                            borderRadius: "8px",
                            padding: "5px 14px",
                            color: "#34d399",
                            fontSize: "11px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          Confirm
                        </button>
                      )}

                      {apt.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(apt._id, "completed")
                          }
                          style={{
                            background: "rgba(96,165,250,0.15)",
                            border: "1px solid rgba(96,165,250,0.3)",
                            borderRadius: "8px",
                            padding: "5px 14px",
                            color: "#60a5fa",
                            fontSize: "11px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
