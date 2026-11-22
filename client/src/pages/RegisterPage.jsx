import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  // ================= PASSWORD VISIBILITY =================
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================= FORM STATES =================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ================= UI STATES =================
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Backend API Call
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Registration response:", response.data);

      // Save token
      localStorage.setItem("token", response.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess("Registration successful!");

      // Redirect after registration
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute bottom-[5%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

      </div>

      {/* ================= GRID BACKGROUND ================= */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-10 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-xl">

        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold shadow-lg shadow-indigo-500/20">
              IF
            </div>

            <span className="text-lg font-bold">
              Interview
              <span className="text-indigo-400">
                Forge
              </span>{" "}
              AI
            </span>
          </a>

          {/* Back */}
          <a
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Home
          </a>

        </div>

      </nav>

      {/* ================= REGISTER SECTION ================= */}
      <main className="relative z-10 flex min-h-[calc(100vh-74px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* ================= REGISTER CARD ================= */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">

            {/* ================= HEADER ================= */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-extrabold shadow-lg shadow-indigo-500/20">
                IF
              </div>

              <h1 className="mt-6 text-2xl font-bold">
                Create Your Account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Start your journey to interview success.
              </p>

            </div>

            {/* ================= ERROR MESSAGE ================= */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* ================= SUCCESS MESSAGE ================= */}
            {success && (
              <div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {success}
              </div>
            )}

            {/* ================= FORM ================= */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* ================= FULL NAME ================= */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

              </div>

              {/* ================= EMAIL ================= */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-slate-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

              </div>

              {/* ================= PASSWORD ================= */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-[#080e1a] px-4 py-3 pr-16 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 transition hover:text-indigo-400"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <p className="mt-2 text-[10px] text-slate-600">
                  Password must contain at least 6 characters.
                </p>

              </div>

              {/* ================= CONFIRM PASSWORD ================= */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-medium text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#080e1a] px-4 py-3 pr-16 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 transition hover:text-indigo-400"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* ================= TERMS ================= */}
              <div className="flex items-start gap-2">

                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 accent-indigo-600"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-slate-500"
                >
                  I agree to the{" "}

                  <a
                    href="/terms"
                    className="text-indigo-400 transition hover:text-indigo-300"
                  >
                    Terms of Service
                  </a>{" "}

                  and{" "}

                  <a
                    href="/privacy"
                    className="text-indigo-400 transition hover:text-indigo-300"
                  >
                    Privacy Policy
                  </a>
                  .

                </label>

              </div>

              {/* ================= REGISTER BUTTON ================= */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account →"}
              </button>

            </form>

            {/* ================= DIVIDER ================= */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-[10px] uppercase tracking-wider text-slate-600">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            {/* ================= LOGIN ================= */}
            <p className="mt-7 text-center text-xs text-slate-500">

              Already have an account?{" "}

              <a
                href="/login"
                className="font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Login
              </a>

            </p>

          </div>

          {/* ================= BOTTOM TEXT ================= */}
          <p className="mt-6 text-center text-[10px] text-slate-600">
            Secure your future with smarter interview preparation.
          </p>

        </div>

      </main>

    </div>
  );
};

export default RegisterPage;