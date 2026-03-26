import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { aiService } from "../services/ai.service";
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

const SymptomChecker = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [specialist, setSpecialist] = useState<{
    specialist: string;
    reason: string;
    urgency: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out!");
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms!");
      return;
    }
    try {
      setLoading(true);
      setAnalysis("");
      setSpecialist(null);
      const [analysisRes, specialistRes] = await Promise.all([
        aiService.analyzeSymptoms(symptoms),
        aiService.getSpecialist(symptoms),
      ]);
      setAnalysis(analysisRes.analysis);
      setSpecialist(specialistRes.suggestion);
    } catch {
      toast.error("AI service unavailable! Please try again.");
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
              AI Symptom Checker
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
            padding: "28px",
            backdropFilter: "blur(10px)",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Describe Your Symptoms
          </h2>
          <p
            style={{
              color: "rgba(167,139,250,0.5)",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            Tell us how you are feeling and our AI will analyze your symptoms
          </p>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: I have been having chest pain for 2 days, shortness of breath when climbing stairs, and mild fever..."
            rows={5}
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
              lineHeight: 1.6,
              marginBottom: "16px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(139,92,246,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(139,92,246,0.2)")
            }
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(124,58,237,0.3)"
                : "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              color: "white",
              fontSize: "15px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 30px rgba(124,58,237,0.4)",
              transition: "all 0.2s",
              marginBottom: "12px",
            }}
          >
            {loading ? "AI is analyzing..." : "Analyze Symptoms"}
          </button>

          <p
            style={{
              color: "rgba(167,139,250,0.3)",
              fontSize: "11px",
              textAlign: "center",
            }}
          >
            AI analysis is for guidance only. Always consult a real doctor for
            medical advice.
          </p>
        </div>

        {loading && (
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
                fontSize: "48px",
                marginBottom: "16px",
                animation: "float 1.5s ease-in-out infinite",
              }}
            >
              🤖
            </div>
            <p style={{ color: "#a78bfa", fontSize: "15px", fontWeight: 500 }}>
              AI is analyzing your symptoms...
            </p>
            <p
              style={{
                color: "rgba(167,139,250,0.4)",
                fontSize: "12px",
                marginTop: "6px",
              }}
            >
              This usually takes 2-3 seconds
            </p>
          </div>
        )}

        {specialist && !loading && (
          <div
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.3)",
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
              Recommended Specialist
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "#a78bfa",
                    fontSize: "26px",
                    fontWeight: 500,
                  }}
                >
                  {specialist.specialist}
                </h2>
                <p
                  style={{
                    color: "rgba(167,139,250,0.6)",
                    fontSize: "13px",
                    marginTop: "6px",
                  }}
                >
                  {specialist.reason}
                </p>
              </div>
              <div
                style={{
                  ...getUrgencyStyle(specialist.urgency),
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                  flexShrink: 0,
                  background: getUrgencyStyle(specialist.urgency).bg,
                  color: getUrgencyStyle(specialist.urgency).color,
                  border: `1px solid ${getUrgencyStyle(specialist.urgency).border}`,
                }}
              >
                {specialist.urgency} Urgency
              </div>
            </div>

            <button
              onClick={() => navigate("/doctors")}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                marginTop: "16px",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              Book Appointment with {specialist.specialist}
            </button>
          </div>
        )}

        {analysis && !loading && (
          <div
            style={{
              background: "rgba(139,92,246,0.07)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "20px",
              padding: "24px",
              backdropFilter: "blur(10px)",
              animation: "fadeUp 0.5s ease forwards",
            }}
          >
            <h3
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "16px",
              }}
            >
              AI Health Analysis
            </h3>

            <div
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "24px", flexShrink: 0 }}>🤖</div>
                <div>
                  <p
                    style={{
                      color: "#a78bfa",
                      fontSize: "12px",
                      fontWeight: 500,
                      marginBottom: "8px",
                    }}
                  >
                    CareSync AI Analysis
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "13px",
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {analysis}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.2)",
                borderRadius: "10px",
              }}
            >
              <p
                style={{
                  color: "rgba(251,191,36,0.7)",
                  fontSize: "11px",
                  lineHeight: 1.5,
                }}
              >
                Disclaimer: This AI analysis is for informational purposes only
                and does not constitute medical advice. Please consult a
                qualified healthcare professional.
              </p>
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
        textarea::placeholder { color: rgba(167,139,250,0.3); }
      `}</style>
    </div>
  );
};

export default SymptomChecker;
