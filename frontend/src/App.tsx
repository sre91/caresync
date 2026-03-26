import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Doctors from "./pages/Doctors";
import SymptomChecker from "./pages/SymptomChecker";
import SpecialistSuggester from "./pages/SpecialistSuggester";
import HealthSummary from "./pages/HealthSummary";
import DoctorSetup from "./pages/DoctorSetup";

// Fixed particles
const PARTICLES = [
  {
    top: "8%",
    left: "12%",
    size: 4,
    color: "rgba(167,139,250,0.7)",
    delay: "0s",
    dur: "3s",
  },
  {
    top: "15%",
    left: "85%",
    size: 3,
    color: "rgba(236,72,153,0.6)",
    delay: "1s",
    dur: "4s",
  },
  {
    top: "25%",
    left: "40%",
    size: 3,
    color: "rgba(96,165,250,0.5)",
    delay: "0.5s",
    dur: "3.5s",
  },
  {
    top: "50%",
    left: "8%",
    size: 5,
    color: "rgba(167,139,250,0.5)",
    delay: "2s",
    dur: "2.5s",
  },
  {
    top: "60%",
    left: "90%",
    size: 3,
    color: "rgba(236,72,153,0.5)",
    delay: "1.5s",
    dur: "4s",
  },
  {
    top: "70%",
    left: "55%",
    size: 4,
    color: "rgba(96,165,250,0.4)",
    delay: "0.8s",
    dur: "3s",
  },
  {
    top: "80%",
    left: "20%",
    size: 3,
    color: "rgba(167,139,250,0.6)",
    delay: "2.5s",
    dur: "3.5s",
  },
  {
    top: "35%",
    left: "70%",
    size: 4,
    color: "rgba(236,72,153,0.4)",
    delay: "1.2s",
    dur: "4s",
  },
  {
    top: "90%",
    left: "75%",
    size: 3,
    color: "rgba(96,165,250,0.5)",
    delay: "0.3s",
    dur: "3s",
  },
  {
    top: "45%",
    left: "30%",
    size: 3,
    color: "rgba(167,139,250,0.4)",
    delay: "1.8s",
    dur: "4s",
  },
  {
    top: "20%",
    left: "60%",
    size: 4,
    color: "rgba(236,72,153,0.5)",
    delay: "0.7s",
    dur: "3.5s",
  },
  {
    top: "75%",
    left: "45%",
    size: 3,
    color: "rgba(96,165,250,0.6)",
    delay: "2.2s",
    dur: "2.5s",
  },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Symptom Checker",
    desc: "Describe symptoms and get instant AI analysis",
  },
  {
    icon: "🏥",
    title: "Find Specialists",
    desc: "AI recommends the right doctor for you",
  },
  { icon: "📅", title: "Easy Booking", desc: "Book appointments in seconds" },
  {
    icon: "📊",
    title: "Health Summary",
    desc: "AI generated personal health reports",
  },
];

const STATS = [
  { num: "100+", label: "Happy Patients" },
  { num: "10+", label: "Expert Doctors" },
  { num: "99%", label: "Satisfaction Rate" },
  { num: "24/7", label: "AI Available" },
];

// Landing Page
const Landing = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06001a",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      // nebula background
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.35) 0%, transparent 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(200,40,120,0.25) 0%, transparent 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 90%, rgba(40,100,200,0.2) 0%, transparent 50%)",
        }}
      />
      // floating particles
      {PARTICLES.map((p, i) => (
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
      // navbar
      <nav
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: 500,
            background: "linear-gradient(90deg, #a78bfa, #ec4899, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CareSync AI
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href="/login"
            style={{
              background: "rgba(139,92,246,0.1)",
              color: "#a78bfa",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: "8px",
              padding: "8px 20px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            Login
          </a>
          <a
            href="/signup"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            Get Started
          </a>
        </div>
      </nav>
      // hero section
      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: "80px 20px 60px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.4)",
            color: "#a78bfa",
            fontSize: "12px",
            padding: "6px 16px",
            borderRadius: "20px",
            marginBottom: "24px",
            animation: "pulse 2s infinite",
          }}
        >
          ✦ Integrated with Groq API
        </div>
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 500,
            color: "white",
            lineHeight: 1.2,
            maxWidth: "700px",
            margin: "0 auto 20px",
          }}
        >
          Your Health,{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reimagined
          </span>{" "}
          with AI
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
            maxWidth: "500px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Book appointments, check symptoms with AI, get specialist
          recommendations and personalized health summaries — all in one place.
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/signup"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              color: "white",
              borderRadius: "10px",
              padding: "14px 32px",
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(124,58,237,0.4)",
              display: "inline-block",
            }}
          >
            Sign Up
          </a>
          <a
            href="/login"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              padding: "14px 32px",
              fontSize: "15px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Login
          </a>
        </div>
      </div>
      // cards
      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={i}
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              transition: "transform 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(-4px)";
              el.style.borderColor = "rgba(139,92,246,0.5)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "translateY(0)";
              el.style.borderColor = "rgba(139,92,246,0.2)";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>
              {f.icon}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#e9d5ff",
                marginBottom: "8px",
              }}
            >
              {f.title}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(167,139,250,0.5)",
                lineHeight: 1.5,
              }}
            >
              {f.desc}
            </div>
          </div>
        ))}
      </div>
      // stats
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          gap: "60px",
          padding: "40px 20px",
          borderTop: "1px solid rgba(139,92,246,0.1)",
          flexWrap: "wrap",
        }}
      >
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 500,
                background: "linear-gradient(90deg, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(167,139,250,0.5)",
                marginTop: "4px",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      // Footer
      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: "20px",
          borderTop: "1px solid rgba(139,92,246,0.1)",
          color: "rgba(167,139,250,0.3)",
          fontSize: "12px",
        }}
      >
        Created By Sreenath
      </div>
      // CSS Animations
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(139,92,246,0.25); }
          50% { border-color: rgba(236,72,153,0.4); }
        }
      `}</style>
    </div>
  );
};

// Main App
function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#06001a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 500,
              background: "linear-gradient(90deg, #a78bfa, #ec4899, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "12px",
            }}
          >
            CareSync AI
          </div>
          <div style={{ color: "rgba(167,139,250,0.5)", fontSize: "13px" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/specialist-suggester" element={<SpecialistSuggester />} />
        <Route path="/health-summary" element={<HealthSummary />} />
        <Route path="/doctor/setup" element={<DoctorSetup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
