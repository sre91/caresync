import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { aiService } from "../services/ai.service";
import { appointmentService } from "../services/appointment.service";
import toast from "react-hot-toast";

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

const HealthSummary = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const { data: appointmentsData } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: appointmentService.getMyAppointments,
  });

  const appointments = appointmentsData?.appointments || [];
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

  const specializations = [
    ...new Set(
      appointments
        .filter((a) => a.doctor?.specialization)
        .map((a) => a.doctor.specialization),
    ),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out!");
  };

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

  const navBtn = {
    background: "rgba(139,92,246,0.1)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "8px",
    padding: "8px 16px",
    color: "rgba(167,139,250,0.8)",
    fontSize: "12px",
    cursor: "pointer",
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
          maxWidth: "750px",
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
              My Health Summary
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/patient/dashboard")}
              style={navBtn}
            >
              Dashboard
            </button>
            <button onClick={handleLogout} style={navBtn}>
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "20px",
            padding: "24px",
            backdropFilter: "blur(10px)",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "26px",
              fontWeight: 500,
              flexShrink: 0,
              boxShadow: "0 0 20px rgba(124,58,237,0.4)",
            }}
          >
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: 500 }}>
              {user?.name}
            </h2>
            <p
              style={{
                color: "rgba(167,139,250,0.5)",
                fontSize: "13px",
                marginTop: "2px",
              }}
            >
              {user?.email}
            </p>
            <span
              style={{
                display: "inline-block",
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#a78bfa",
                fontSize: "11px",
                padding: "2px 10px",
                borderRadius: "20px",
                marginTop: "6px",
              }}
            >
              CareSync AI Patient
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              label: "Total Visits",
              value: totalAppointments,
              color: "#a78bfa",
            },
            {
              label: "Completed",
              value: completedAppointments,
              color: "#60a5fa",
            },
            { label: "Upcoming", value: pendingAppointments, color: "#fbbf24" },
            {
              label: "Cancelled",
              value: cancelledAppointments,
              color: "#f87171",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(139,92,246,0.07)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
                animation: "fadeUp 0.6s ease forwards",
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div
                style={{ fontSize: "28px", fontWeight: 500, color: s.color }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(167,139,250,0.5)",
                  marginTop: "4px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {specializations.length > 0 && (
          <div
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "16px",
              padding: "20px",
              backdropFilter: "blur(10px)",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "12px",
              }}
            >
              Specialists Visited
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {specializations.map((spec) => (
                <span
                  key={spec}
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#a78bfa",
                    fontSize: "12px",
                    padding: "4px 14px",
                    borderRadius: "20px",
                  }}
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {!generated && !loading && (
          <div
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "20px",
              padding: "40px",
              backdropFilter: "blur(10px)",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "52px",
                marginBottom: "16px",
                animation: "float 2s ease-in-out infinite",
              }}
            >
              🤖
            </div>
            <h3
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              Generate AI Health Summary
            </h3>
            <p
              style={{
                color: "rgba(167,139,250,0.5)",
                fontSize: "13px",
                lineHeight: 1.6,
                maxWidth: "400px",
                margin: "0 auto 24px",
              }}
            >
              Our AI will analyze your appointment history and create a
              personalized health report just for you!
            </p>
            <button
              onClick={handleGenerateSummary}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                border: "none",
                borderRadius: "10px",
                padding: "13px 32px",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(124,58,237,0.4)",
              }}
            >
              Generate My Health Summary
            </button>
          </div>
        )}

        {loading && (
          <div
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                animation: "float 1.5s ease-in-out infinite",
              }}
            >
              🤖
            </div>
            <p style={{ color: "#a78bfa", fontSize: "15px", fontWeight: 500 }}>
              AI is analyzing your health history...
            </p>
            <p
              style={{
                color: "rgba(167,139,250,0.4)",
                fontSize: "12px",
                marginTop: "6px",
              }}
            >
              Creating your personalized health summary!
            </p>
          </div>
        )}

        {summary && !loading && (
          <div
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "20px",
              padding: "24px",
              backdropFilter: "blur(10px)",
              marginBottom: "20px",
              animation: "fadeUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ color: "white", fontSize: "16px", fontWeight: 500 }}>
                Your Health Summary
              </h3>
              <button
                onClick={handleGenerateSummary}
                style={{
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  color: "rgba(167,139,250,0.8)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Regenerate
              </button>
            </div>

            <div
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <div style={{ fontSize: "24px", flexShrink: 0 }}>🤖</div>
                <div>
                  <p
                    style={{
                      color: "#a78bfa",
                      fontSize: "12px",
                      fontWeight: 500,
                      marginBottom: "10px",
                    }}
                  >
                    CareSync AI — Personal Health Report
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "13px",
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {summary}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "12px 16px",
                background: "rgba(96,165,250,0.08)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: "10px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "rgba(96,165,250,0.7)",
                  fontSize: "11px",
                  lineHeight: 1.5,
                }}
              >
                This AI summary is generated from your appointment history and
                is for informational purposes only. Always consult your doctor
                for medical decisions.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("/doctors")}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                }}
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate("/symptom-checker")}
                style={{
                  flex: 1,
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "rgba(167,139,250,0.8)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Check Symptoms
              </button>
            </div>
          </div>
        )}
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

export default HealthSummary;
