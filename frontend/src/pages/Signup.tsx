import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Validation Schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters!"),
  email: z.email("Please enter a valid email!"),
  password: z.string().min(6, "Password must be at least 6 characters!"),
  role: z.enum(["patient", "doctor"]),
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "patient" },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setLoading(true);
      const response = await authService.signup(data);
      login(response.token, response.user);
      toast.success("Welcome to CareSync AI!");

      if (response.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">CareSync AI</h1>
          <p className="text-gray-400 mt-2">AI Powered Healthcare</p>
        </div>

        {/* Signup Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-400">
              Join CareSync AI today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@gmail.com"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">I am a</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="patient"
                      {...register("role")}
                      className="accent-blue-500"
                    />
                    <span className="text-gray-300">Patient</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="doctor"
                      {...register("role")}
                      className="accent-blue-500"
                    />
                    <span className="text-gray-300">Doctor</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-gray-400 mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
