import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const LoginPage = () => {
  const navigate = useNavigate();

  // ================= STATES =================

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= CHECK EXISTING LOGIN =================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      const { token, user } = response.data;

      // ================= SAVE LOGIN DATA =================

      if (rememberMe) {
        localStorage.setItem("token", token);

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      } else {
        sessionStorage.setItem("token", token);

        sessionStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // ================= NAVIGATE =================

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[15%] top-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

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

          {/* LOGO */}

          <Link
            to="/"
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

          </Link>


          {/* BACK BUTTON */}

          <Link
            to="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Home
          </Link>

        </div>

      </nav>


      {/* ================= LOGIN SECTION ================= */}

      <main className="relative z-10 flex min-h-[calc(100vh-74px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">


          {/* ================= LOGIN CARD ================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">


            {/* ================= HEADER ================= */}

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-extrabold shadow-lg shadow-indigo-500/20">
                IF
              </div>

              <h1 className="mt-6 text-2xl font-bold">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Login to continue your interview preparation.
              </p>

            </div>


            {/* ================= ERROR MESSAGE ================= */}

            {error && (

              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                {error}

              </div>

            )}


            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >


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
                  disabled={loading}
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                />

              </div>


              {/* ================= PASSWORD ================= */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-400 transition hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>

                </div>


                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#080e1a] px-4 py-3 pr-16 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 transition hover:text-indigo-400"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* ================= REMEMBER ME ================= */}

              <div className="flex items-center gap-2">

                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-700 bg-slate-800 accent-indigo-600"
                />

                <label
                  htmlFor="remember"
                  className="text-xs text-slate-500"
                >
                  Remember me
                </label>

              </div>


              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Logging in..."
                  : "Login to InterviewForge →"}

              </button>

            </form>


            {/* ================= DIVIDER ================= */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-[10px] uppercase tracking-wider text-slate-600">
                Secure Login
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>


            {/* ================= REGISTER ================= */}

            <p className="text-center text-xs text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Create an account
              </Link>

            </p>

          </div>


          {/* ================= BOTTOM TEXT ================= */}

          <p className="mt-6 text-center text-[10px] text-slate-600">

            By continuing, you agree to our Terms of Service and Privacy Policy.

          </p>

        </div>

      </main>

    </div>
  );
};

export default LoginPage;