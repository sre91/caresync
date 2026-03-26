import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../lib/axios";
import toast from "react-hot-toast";

const SPECIALIZATIONS = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedist",
  "Gastroenterologist",
  "Pulmonologist",
  "General Physician",
];

const DoctorSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");

  const handleSubmit = async () => {
    if (!specialization || !experience || !fees) {
      toast.error("Please fill all required fields!");
      return;
    }
    try {
      setLoading(true);
      await API.post("/doctors", {
        userId: user?.id,
        specialization,
        experience: parseInt(experience),
        fees: parseInt(fees),
        about,
      });
      toast.success("Doctor profile created!");
      navigate("/doctor/dashboard");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to create profile!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(139,92,246,0.08)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "sans-serif",
  };

  const labelStyle = {
    color: "rgba(167,139,250,0.8)",
    fontSize: "13px",
    display: "block" as const,
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06001a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Nebula Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(120,40,200,0.4) 0%, transparent 55%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 85% 20%, rgba(200,40,120,0.3) 0%, transparent 55%)",
        }}
      />

      {[
        {
          top: "10%",
          left: "15%",
          size: 4,
          color: "rgba(167,139,250,0.7)",
          delay: "0s",
          dur: "3s",
        },
        {
          top: "20%",
          left: "80%",
          size: 3,
          color: "rgba(236,72,153,0.6)",
          delay: "1s",
          dur: "4s",
        },
        {
          top: "70%",
          left: "10%",
          size: 5,
          color: "rgba(96,165,250,0.5)",
          delay: "0.5s",
          dur: "3.5s",
        },
        {
          top: "80%",
          left: "85%",
          size: 3,
          color: "rgba(167,139,250,0.6)",
          delay: "2s",
          dur: "2.5s",
        },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            animation: `float ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          animation: "fadeUp 0.8s ease forwards",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 500,
              background: "linear-gradient(90deg, #a78bfa, #ec4899, #60a5fa)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            CareSync AI
          </div>
          <div
            style={{
              color: "rgba(167,139,250,0.5)",
              fontSize: "13px",
              marginTop: "6px",
            }}
          >
            Complete Your Doctor Profile
          </div>
        </div>

        <div
          style={{
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "24px",
            padding: "36px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(124,58,237,0.15)",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "22px",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Doctor Profile Setup
          </h2>
          <p
            style={{
              color: "rgba(167,139,250,0.5)",
              fontSize: "13px",
              marginBottom: "28px",
            }}
          >
            Welcome Dr. {user?.name}! Complete your profile to start accepting
            patients.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Specialization *</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{
                ...inputStyle,
                cursor: "pointer",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.2)")
              }
            >
              <option value="" style={{ background: "#06001a" }}>
                Select your specialization...
              </option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s} style={{ background: "#06001a" }}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Years of Experience *</label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min="0"
              max="50"
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.2)")
              }
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Consultation Fees (Rs.) *</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              min="0"
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.2)")
              }
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>About You (optional)</label>
            <textarea
              placeholder="Brief description about your expertise and experience..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                resize: "none",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.6)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139,92,246,0.2)")
              }
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(124,58,237,0.4)"
                : "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              color: "white",
              fontSize: "15px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 30px rgba(124,58,237,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 50px rgba(124,58,237,0.7)";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 30px rgba(124,58,237,0.4)";
            }}
          >
            {loading ? "Creating Profile..." : "Complete Setup"}
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "14px 20px",
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "rgba(167,139,250,0.5)",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            Your profile will be visible to patients after setup. You can update
            your details anytime from your dashboard.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder, textarea::placeholder {
          color: rgba(167,139,250,0.3);
        }
        select option {
          background: #06001a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default DoctorSetup;
