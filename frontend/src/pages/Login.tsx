import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";

const loginSchema = z.object({
  email: z.email("Please enter a valid email!"),
  password: z.string().min(6, "Password must be at least 6 characters!"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      login(response.token, response.user);
      toast.success("Welcome back to CareSync AI!");
      if (response.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 95%, rgba(40,100,200,0.25) 0%, transparent 55%)",
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
          top: "60%",
          left: "10%",
          size: 5,
          color: "rgba(96,165,250,0.5)",
          delay: "0.5s",
          dur: "3.5s",
        },
        {
          top: "70%",
          left: "85%",
          size: 3,
          color: "rgba(167,139,250,0.6)",
          delay: "2s",
          dur: "2.5s",
        },
        {
          top: "40%",
          left: "90%",
          size: 4,
          color: "rgba(236,72,153,0.5)",
          delay: "1.5s",
          dur: "4s",
        },
        {
          top: "85%",
          left: "25%",
          size: 3,
          color: "rgba(96,165,250,0.6)",
          delay: "0.8s",
          dur: "3s",
        },
        {
          top: "30%",
          left: "5%",
          size: 4,
          color: "rgba(167,139,250,0.5)",
          delay: "2.5s",
          dur: "3.5s",
        },
        {
          top: "55%",
          left: "60%",
          size: 3,
          color: "rgba(236,72,153,0.4)",
          delay: "1.2s",
          dur: "4s",
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
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          border: "1px solid rgba(139,92,246,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "1px solid rgba(236,72,153,0.08)",
        }}
      />

      {/* Login Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          animation: "fadeUp 0.8s ease forwards",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
              letterSpacing: "1px",
            }}
          >
            AI Powered Healthcare
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
            animation: "border-glow 3s ease-in-out infinite",
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
            Welcome Back
          </h2>
          <p
            style={{
              color: "rgba(167,139,250,0.5)",
              fontSize: "13px",
              marginBottom: "28px",
            }}
          >
            Login to your CareSync AI account
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  color: "rgba(167,139,250,0.8)",
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="john@gmail.com"
                {...register("email")}
                style={{
                  width: "100%",
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.2)")
                }
              />
              {errors.email && (
                <p
                  style={{
                    color: "#f472b6",
                    fontSize: "12px",
                    marginTop: "6px",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  color: "rgba(167,139,250,0.8)",
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                style={{
                  width: "100%",
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.6)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.2)")
                }
              />
              {errors.password && (
                <p
                  style={{
                    color: "#f472b6",
                    fontSize: "12px",
                    marginTop: "6px",
                  }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "rgba(167,139,250,0.5)",
              fontSize: "13px",
              marginTop: "24px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#a78bfa",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          {["AI Powered", "Secure", "Free to Use"].map((b, i) => (
            <div
              key={i}
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "20px",
                padding: "4px 14px",
                fontSize: "11px",
                color: "rgba(167,139,250,0.6)",
              }}
            >
              {b}
            </div>
          ))}
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
        @keyframes border-glow {
          0%, 100% { border-color: rgba(139,92,246,0.25); }
          50% { border-color: rgba(236,72,153,0.4); }
        }
        input::placeholder { color: rgba(167,139,250,0.3); }
      `}</style>
    </div>
  );
};

export default Login;
