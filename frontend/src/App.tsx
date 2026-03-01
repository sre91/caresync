import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-500 mb-4">
            CareSync AI
          </div>
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-blue-500 mb-4">
                  CareSync AI
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  AI Powered Healthcare Appointment System
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-6 py-3 border border-blue-600 text-blue-500 rounded-lg hover:bg-blue-950"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          }
        />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/patient/dashboard"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
              <h1 className="text-3xl text-white">
                Patient Dashboard - Coming Soon!
              </h1>
            </div>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
              <h1 className="text-3xl text-white">
                Doctor Dashboard - Coming Soon!
              </h1>
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
