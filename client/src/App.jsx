import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import InterviewSetup from "./pages/InterviewSetup";
import MockInterview from "./pages/MockInterview";
import Performance from "./pages/Performance";
import InterviewResult from "./pages/InterviewResult";
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ================= RESUME ================= */}

        <Route
          path="/resume"
          element={<ResumeUpload />}
        />

        <Route
          path="/resume-analysis"
          element={<ResumeAnalysis />}
        />


        {/* ================= INTERVIEW ================= */}

        <Route
          path="/interview-setup"
          element={<InterviewSetup />}
        />

        <Route
          path="/mock-interview"
          element={<MockInterview />}
        />

        <Route
          path="/interview-result"
          element={<InterviewResult />}
        />

        <Route
          path="/history"
          element={<InterviewHistory />}
        />


        {/* ================= PERFORMANCE ================= */}

        <Route
          path="/performance"
          element={<Performance />}
        />


        {/* ================= PROFILE ================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;