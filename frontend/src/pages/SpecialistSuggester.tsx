import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { aiService } from "../services/ai.service";
import { doctorService } from "../services/doctor.service";
import toast from "react-hot-toast";
import type { SpecialistSuggestion } from "../types";

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

const SPECIALISTS = [
  { name: "Cardiologist", desc: "Heart and cardiovascular system" },
  { name: "Dermatologist", desc: "Skin, hair and nail conditions" },
  { name: "Neurologist", desc: "Brain and nervous system" },
  { name: "Orthopedist", desc: "Bones, joints and muscles" },
  { name: "Gastroenterologist", desc: "Digestive system disorders" },
  { name: "Pulmonologist", desc: "Lungs and respiratory system" },
  { name: "General Physician", desc: "General health and common illness" },
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

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "High":
        return {
          bg: "rgba(248,113,113,0.15)",
          color: "#f87171",
          border: "rgba(248,113,113,0.3)",
        };
      case "Medium":
        return {
          bg: "rgba(251,191,36,0.15)",
          color: "#fbbf24",
          border: "rgba(251,191,36,0.3)",
        };
      case "Low":
        return {
          bg: "rgba(52,211,153,0.15)",
          color: "#34d399",
          border: "rgba(52,211,153,0.3)",
        };
      default:
        return {
          bg: "rgba(167,139,250,0.15)",
          color: "#a78bfa",
          border: "rgba(167,139,250,0.3)",
        };
    }
  };

  const filteredDoctors = selectedSpec
    ? doctors.filter((doc) =>
        doc.specialization.toLowerCase().includes(selectedSpec.toLowerCase()),
      )
    : [];

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
          maxWidth: "900px",
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
              AI Specialist Suggester
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
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: 500,
              marginBottom: "16px",
            }}
          >
            What are your symptoms?
          </h2>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms in detail..."
            rows={4}
            style={{
              width: "100%",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "12px",
              padding: "14px 16px",
              color: "white",
              fontSize: "14px",
              outline: "none",
              resize: "none",
              fontFamily: "sans-serif",
              marginBottom: "16px",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(139,92,246,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(139,92,246,0.2)")
            }
          />
          <button
            onClick={handleGetSuggestion}
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(124,58,237,0.3)"
                : "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 25px rgba(124,58,237,0.3)",
            }}
          >
            {loading ? "AI is thinking..." : "Find Best Specialist"}
          </button>
        </div>

        {suggestion && !loading && (
          <div
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "2px solid rgba(139,92,246,0.4)",
              borderRadius: "20px",
              padding: "24px",
              backdropFilter: "blur(10px)",
              marginBottom: "20px",
              animation: "fadeUp 0.5s ease forwards",
            }}
          >
            <p
              style={{
                color: "rgba(167,139,250,0.5)",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              AI Recommendation
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{ color: "white", fontSize: "28px", fontWeight: 500 }}
                >
                  {suggestion.specialist}
                </h2>
                <p
                  style={{
                    color: "rgba(167,139,250,0.6)",
                    fontSize: "13px",
                    marginTop: "6px",
                  }}
                >
                  {suggestion.reason}
                </p>
              </div>
              <div
                style={{
                  background: getUrgencyStyle(suggestion.urgency).bg,
                  color: getUrgencyStyle(suggestion.urgency).color,
                  border: `1px solid ${getUrgencyStyle(suggestion.urgency).border}`,
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {suggestion.urgency} Urgency
              </div>
            </div>

            {filteredDoctors.length > 0 ? (
              <div>
                <p
                  style={{
                    color: "rgba(167,139,250,0.5)",
                    fontSize: "12px",
                    marginBottom: "12px",
                  }}
                >
                  Available {suggestion.specialist}s in CareSync AI
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        background: "rgba(139,92,246,0.08)",
                        border: "1px solid rgba(139,92,246,0.2)",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #7c3aed, #ec4899)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {doc.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p
                            style={{
                              color: "white",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          >
                            Dr. {doc.user?.name}
                          </p>
                          <p
                            style={{
                              color: "rgba(167,139,250,0.5)",
                              fontSize: "11px",
                              marginTop: "2px",
                            }}
                          >
                            {doc.experience} yrs | Rs. {doc.fees}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/doctors")}
                        style={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #ec4899)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          color: "white",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: "rgba(139,92,246,0.05)",
                  borderRadius: "10px",
                }}
              >
                <p style={{ color: "rgba(167,139,250,0.5)", fontSize: "13px" }}>
                  No {suggestion.specialist} available yet!
                </p>
                <button
                  onClick={() => navigate("/doctors")}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    color: "white",
                    fontSize: "13px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Browse All Doctors
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          <h2
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: 500,
              marginBottom: "16px",
            }}
          >
            Browse by Specialist
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {SPECIALISTS.map((spec) => {
              const availableDocs = doctors.filter((doc) =>
                doc.specialization
                  .toLowerCase()
                  .includes(spec.name.toLowerCase()),
              );
              const isAISuggested = suggestion?.specialist === spec.name;
              const isSelected = selectedSpec === spec.name;

              return (
                <div
                  key={spec.name}
                  onClick={() =>
                    setSelectedSpec(
                      selectedSpec === spec.name ? null : spec.name,
                    )
                  }
                  style={{
                    padding: "16px",
                    background: isAISuggested
                      ? "rgba(139,92,246,0.15)"
                      : isSelected
                        ? "rgba(139,92,246,0.1)"
                        : "rgba(139,92,246,0.05)",
                    border: `1px solid ${
                      isAISuggested
                        ? "rgba(139,92,246,0.5)"
                        : isSelected
                          ? "rgba(139,92,246,0.35)"
                          : "rgba(139,92,246,0.15)"
                    }`,
                    borderRadius: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  {isAISuggested && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "12px",
                        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                        color: "white",
                        fontSize: "9px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontWeight: 500,
                      }}
                    >
                      AI Pick
                    </span>
                  )}
                  <p
                    style={{
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 500,
                      marginBottom: "4px",
                    }}
                  >
                    {spec.name}
                  </p>
                  <p
                    style={{
                      color: "rgba(167,139,250,0.4)",
                      fontSize: "11px",
                      marginBottom: "8px",
                    }}
                  >
                    {spec.desc}
                  </p>
                  <p style={{ color: "#a78bfa", fontSize: "11px" }}>
                    {availableDocs.length} doctor
                    {availableDocs.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              );
            })}
          </div>
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
        textarea::placeholder { color: rgba(167,139,250,0.3); }
      `}</style>
    </div>
  );
};

export default SpecialistSuggester;
