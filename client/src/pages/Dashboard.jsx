
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Dashboard = () => {
  const savedUser = localStorage.getItem("user");

  let user = null;
  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch {
    user = null;
  }

  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@example.com";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [interviews, setInterviews] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user's interviews
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/interviews");

        const data = response.data;
        const interviewList = Array.isArray(data)
          ? data
          : data.interviews || data.data || [];

        setInterviews(interviewList);

        // Resume analysis saved after successful upload
        const savedResume = localStorage.getItem("resumeAnalysis");

        if (savedResume) {
          try {
            setResume(JSON.parse(savedResume));
          } catch {
            setResume(null);
          }
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sort interviews by latest date
  const sortedInterviews = useMemo(() => {
    return [...interviews].sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || 0) -
        new Date(a.createdAt || a.updatedAt || 0)
    );
  }, [interviews]);

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const totalInterviews = interviews.length;

    const scores = interviews
      .map((item) => Number(item.overallScore))
      .filter((score) => Number.isFinite(score) && score >= 0);

    const averageScore = scores.length
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0;

    const bestScore = scores.length ? Math.max(...scores) : 0;

    const questionsAnswered = interviews.reduce((total, interview) => {
      const questions = interview.questions || [];

      return (
        total +
        questions.filter(
          (question) =>
            typeof question.answer === "string" &&
            question.answer.trim().length > 0
        ).length
      );
    }, 0);

    // Calculate practice streak using interview dates
    const uniqueDates = [
      ...new Set(
        interviews
          .map((item) => {
            const date = item.createdAt || item.updatedAt;
            return date ? new Date(date).toDateString() : null;
          })
          .filter(Boolean)
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      uniqueDates.length &&
      new Date(uniqueDates[0]).getTime() >= yesterday.getTime()
    ) {
      let expectedDate = new Date(uniqueDates[0]);

      for (const dateString of uniqueDates) {
        const currentDate = new Date(dateString);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate.getTime() === expectedDate.getTime()) {
          streak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (currentDate < expectedDate) {
          break;
        }
      }
    }

    return [
      {
        title: "Interviews Completed",
        value: totalInterviews,
        subtitle: "Total practice sessions",
        icon: "🎯",
      },
      {
        title: "Average Score",
        value: `${averageScore}%`,
        subtitle: "Across completed interviews",
        icon: "📈",
      },
      {
        title: "Questions Answered",
        value: questionsAnswered,
        subtitle: "Total answered questions",
        icon: "💡",
      },
      {
        title: "Best Score",
        value: `${bestScore}%`,
        subtitle: `Practice streak: ${streak} day${streak === 1 ? "" : "s"}`,
        icon: "🔥",
      },
    ];
  }, [interviews]);

  // Calculate average skill scores from saved interviews
  const performanceSkills = useMemo(() => {
    const skillMap = {};

    interviews.forEach((interview) => {
      (interview.skills || []).forEach((skill) => {
        const name = skill.name;
        const score = Number(skill.score);

        if (name && Number.isFinite(score)) {
          if (!skillMap[name]) {
            skillMap[name] = { total: 0, count: 0 };
          }

          skillMap[name].total += score;
          skillMap[name].count++;
        }
      });
    });

    return Object.entries(skillMap)
      .map(([name, data]) => ({
        name,
        score: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [interviews]);

  const getStatus = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };

  const getStatusColor = (score) => {
    if (score >= 85) return "text-green-400 bg-green-500/10";
    if (score >= 70) return "text-blue-400 bg-blue-500/10";
    if (score >= 50) return "text-yellow-400 bg-yellow-500/10";
    return "text-orange-400 bg-orange-500/10";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resumeScore = Number(resume?.resumeScore || 0);
  const resumeFileName =
    localStorage.getItem("resumeFileName") ||
    resume?.file?.name ||
    "Resume uploaded";

  const resumeFileSize = Number(
    localStorage.getItem("resumeFileSize") ||
    resume?.file?.size ||
    0
  );

  const formattedFileSize = resumeFileSize
    ? `${(resumeFileSize / 1024 / 1024).toFixed(2)} MB`
    : "File information unavailable";

  const recommendations = [
    {
      icon: "⚛️",
      title: "React Fundamentals",
      description: "Practice hooks, components, state management and React concepts.",
      type: "technical",
    },
    {
      icon: "🟢",
      title: "Node.js & Express",
      description: "Improve your backend development and API knowledge.",
      type: "technical",
    },
    {
      icon: "🧠",
      title: "Problem Solving",
      description: "Improve your logical thinking and problem-solving skills.",
      type: "technical",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-[#080d18] lg:block">
        <div className="flex h-[74px] items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold">
            IF
          </div>

          <span className="text-lg font-bold">
            Interview<span className="text-indigo-400">Forge</span>
          </span>
        </div>

        <div className="px-4 py-6">
          <p className="px-3 pb-3 text-[10px] font-bold tracking-[2px] text-slate-600">
            MAIN MENU
          </p>

          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-indigo-600/10 px-3 py-3 text-sm font-medium text-indigo-400"
            >
              ▦ Dashboard
            </Link>

            <Link
              to="/resume"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              📄 My Resume
            </Link>

            <Link
              to="/interview-setup"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              🎯 Practice Interview
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              🕘 Interview History
            </Link>

            <Link
              to="/performance"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              📊 Performance
            </Link>
          </nav>

          <p className="px-3 pb-3 pt-8 text-[10px] font-bold tracking-[2px] text-slate-600">
            ACCOUNT
          </p>

          <nav className="space-y-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              👤 Profile
            </Link>

            <Link
              to="/about"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              ℹ️ About
            </Link>
          </nav>
        </div>

        {/* USER PROFILE */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{userName}</p>
              <p className="truncate text-[10px] text-slate-500">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-64">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-slate-800 bg-[#070b14]/90 px-6 backdrop-blur-xl lg:px-8">
          <div>
            <p className="text-xs text-slate-500">Dashboard</p>
            <h1 className="text-lg font-semibold">Overview</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold">{userName}</p>
              <p className="text-[10px] text-slate-500">{userEmail}</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        <div className="px-6 py-8 lg:px-8">

          {/* WELCOME */}
          <section className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 lg:p-8">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-medium text-indigo-400">
                  WELCOME BACK 👋
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Welcome back, {userName}!
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Track your interview progress, practice new questions and
                  improve your performance with AI-powered feedback.
                </p>
              </div>

              <Link
                to="/interview-setup"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
              >
                Start New Interview →
              </Link>
            </div>
          </section>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* STATS */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{stat.title}</p>
                    <h3 className="mt-2 text-2xl font-bold">
                      {loading ? "..." : stat.value}
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-lg">
                    {stat.icon}
                  </div>
                </div>

                <p className="mt-4 text-[10px] text-slate-500">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </section>

          {/* RECENT INTERVIEWS + RESUME */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            {/* RECENT INTERVIEWS */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/40 xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 p-5">
                <div>
                  <h2 className="text-sm font-semibold">Recent Interviews</h2>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Your latest practice sessions
                  </p>
                </div>

                <Link
                  to="/history"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  View All →
                </Link>
              </div>

              <div className="divide-y divide-slate-800">
                {loading ? (
                  <p className="p-8 text-center text-sm text-slate-500">
                    Loading interviews...
                  </p>
                ) : sortedInterviews.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="text-3xl">🎯</div>
                    <p className="mt-3 text-sm font-semibold">
                      No interviews yet
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Start your first mock interview to see your progress here.
                    </p>
                    <Link
                      to="/interview-setup"
                      className="mt-4 inline-block text-xs text-indigo-400"
                    >
                      Start Practicing →
                    </Link>
                  </div>
                ) : (
                  sortedInterviews.slice(0, 4).map((interview, index) => {
                    const score = Number(interview.overallScore || 0);

                    return (
                      <div
                        key={interview._id || index}
                        className="flex flex-col gap-4 p-5 transition hover:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                            💻
                          </div>

                          <div>
                            <h3 className="text-xs font-semibold">
                              {interview.jobRole || "Mock Interview"}
                            </h3>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {interview.interviewType || "Interview"}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-600">
                              {formatDate(
                                interview.createdAt || interview.updatedAt
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-400">
                              {score}%
                            </p>
                            <p className="text-[9px] text-slate-600">
                              AI Score
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-[9px] font-medium ${getStatusColor(score)}`}
                          >
                            {getStatus(score)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* RESUME CARD */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Your Resume</h2>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Resume analysis status
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] ${
                    resume
                      ? "bg-green-500/10 text-green-400"
                      : "bg-slate-700/30 text-slate-400"
                  }`}
                >
                  {resume ? "Analyzed" : "Not Uploaded"}
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-[#080e1a] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10 text-lg">
                    📄
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">
                      {resume ? resumeFileName : "No resume uploaded"}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-600">
                      {resume ? formattedFileSize : "Upload PDF or DOCX"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Resume Score
                  </span>

                  <span className="text-xs font-bold text-indigo-400">
                    {resume ? `${resumeScore}%` : "--"}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, resumeScore))}%`,
                    }}
                  />
                </div>
              </div>

              <Link
                to={resume ? "/resume-analysis" : "/resume"}
                className="mt-5 block rounded-lg border border-slate-700 py-2.5 text-center text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white"
              >
                {resume ? "View Resume Analysis" : "Upload Resume"}
              </Link>
            </section>
          </div>

          {/* PERFORMANCE + QUICK START */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* PERFORMANCE */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">
                    Performance Overview
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Average scores by skill
                  </p>
                </div>

                <Link
                  to="/performance"
                  className="text-xs text-indigo-400"
                >
                  Details →
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {loading ? (
                  <p className="text-xs text-slate-500">
                    Loading performance...
                  </p>
                ) : performanceSkills.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-500">
                    Your skill performance will appear after completing
                    evaluated interviews.
                  </p>
                ) : (
                  performanceSkills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-400">{skill.name}</span>
                        <span className="font-semibold text-indigo-400">
                          {skill.score}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${
                            index === 0
                              ? "bg-indigo-500"
                              : index === 1
                              ? "bg-purple-500"
                              : index === 2
                              ? "bg-cyan-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(0, skill.score))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* QUICK START */}
            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div>
                <h2 className="text-sm font-semibold">Quick Start</h2>
                <p className="mt-1 text-[10px] text-slate-600">
                  Choose your practice session
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: "💻",
                    title: "Technical",
                    description: "Coding and technical questions",
                  },
                  {
                    icon: "🗣️",
                    title: "Behavioral",
                    description: "HR and behavioral questions",
                  },
                  {
                    icon: "📄",
                    title: "Resume Based",
                    description: "Questions from your resume",
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    to="/interview-setup"
                    className="rounded-xl border border-slate-800 bg-[#080e1a] p-4 transition hover:-translate-y-1 hover:border-indigo-500/50"
                  >
                    <div className="text-xl">{item.icon}</div>

                    <h3 className="mt-3 text-xs font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[9px] leading-5 text-slate-600">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* AI RECOMMENDATIONS */}
          <section className="mt-6">
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-[2px] text-indigo-400">
                PRACTICE SUGGESTIONS
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Recommended Practice
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {recommendations.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-sm font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[10px] leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <Link
                    to="/interview-setup"
                    className="mt-5 inline-block text-xs font-medium text-indigo-400 transition group-hover:text-indigo-300"
                  >
                    Practice Now →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12 border-t border-slate-800 pt-6 text-center">
            <p className="text-[10px] text-slate-700">
              © 2026 InterviewForge AI · AI-powered interview preparation
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
