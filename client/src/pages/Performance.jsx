
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Performance = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all interviews of logged-in user
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/interviews");

        const data = response.data;

        const interviewList = Array.isArray(data)
          ? data
          : data?.interviews || data?.data || [];

        // Sort latest interview first
        const sortedInterviews = [...interviewList].sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setInterviews(sortedInterviews);
      } catch (err) {
        console.error("Performance Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to fetch your performance data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
          <p className="mt-4 text-sm text-slate-400">
            Calculating your overall performance...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold">
            Unable to Load Performance
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            {error}
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-xs font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // No interviews
  if (interviews.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">
        <div className="max-w-md rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
          <div className="text-4xl">📊</div>

          <h2 className="mt-4 text-xl font-bold">
            No Performance Data Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            You have not completed any interviews yet.
            Complete your first mock interview to see your
            overall performance.
          </p>

          <Link
            to="/interview-setup"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-xs font-semibold hover:bg-indigo-500"
          >
            Start Interview →
          </Link>
        </div>
      </div>
    );
  }

  // =====================================
  // CALCULATE OVERALL USER PERFORMANCE
  // =====================================

  const scoredInterviews = interviews.filter(
    (interview) =>
      Number.isFinite(Number(interview.overallScore)) &&
      interview.overallScore !== null &&
      interview.overallScore !== undefined
  );

  const totalScore = scoredInterviews.reduce(
    (sum, interview) =>
      sum + Number(interview.overallScore),
    0
  );

  const averageScore =
    scoredInterviews.length > 0
      ? Math.round(totalScore / scoredInterviews.length)
      : 0;

  const bestScore =
    scoredInterviews.length > 0
      ? Math.max(
          ...scoredInterviews.map((item) =>
            Number(item.overallScore)
          )
        )
      : 0;

  const totalQuestions = interviews.reduce(
    (sum, interview) =>
      sum +
      (Array.isArray(interview.questions)
        ? interview.questions.length
        : 0),
    0
  );

  const answeredQuestions = interviews.reduce(
    (sum, interview) => {
      const questions = Array.isArray(interview.questions)
        ? interview.questions
        : [];

      return (
        sum +
        questions.filter(
          (question) =>
            typeof question.answer === "string" &&
            question.answer.trim().length > 0
        ).length
      );
    },
    0
  );

  // =====================================
  // SKILL-WISE AVERAGE
  // =====================================

  const skillMap = {};

  interviews.forEach((interview) => {
    const skills = Array.isArray(interview.skills)
      ? interview.skills
      : [];

    skills.forEach((skill) => {
      if (!skill.name) return;

      const score = Number(skill.score);

      if (!Number.isFinite(score)) return;

      if (!skillMap[skill.name]) {
        skillMap[skill.name] = {
          name: skill.name,
          total: 0,
          count: 0,
        };
      }

      skillMap[skill.name].total += score;
      skillMap[skill.name].count += 1;
    });
  });

  const skillAnalysis = Object.values(skillMap)
    .map((skill) => ({
      name: skill.name,
      score: Math.round(skill.total / skill.count),
    }))
    .sort((a, b) => b.score - a.score);

  const bestSkill =
    skillAnalysis.length > 0
      ? skillAnalysis[0]
      : null;

  const improvementSkill =
    skillAnalysis.length > 0
      ? skillAnalysis[skillAnalysis.length - 1]
      : null;

  // =====================================
  // COMBINE STRENGTHS AND IMPROVEMENTS
  // =====================================

  const allStrengths = [
    ...new Set(
      interviews.flatMap((interview) =>
        Array.isArray(interview.strengths)
          ? interview.strengths
          : []
      )
    ),
  ];

  const allImprovements = [
    ...new Set(
      interviews.flatMap((interview) =>
        Array.isArray(interview.improvements)
          ? interview.improvements
          : []
      )
    ),
  ];

  // Performance message
  const getPerformanceMessage = () => {
    if (averageScore >= 90) {
      return "Outstanding! Your average performance shows strong interview readiness.";
    }

    if (averageScore >= 75) {
      return "Great progress! You have a strong foundation. Keep practicing to improve further.";
    }

    if (averageScore >= 60) {
      return "Good effort! Focus on your weaker skills and continue practicing.";
    }

    if (averageScore >= 40) {
      return "You are making progress. Regular practice can help improve your interview performance.";
    }

    return "Keep practicing. Focus on understanding concepts and communicating your answers clearly.";
  };

  const getScoreLabel = () => {
    if (averageScore >= 90) return "Excellent";
    if (averageScore >= 75) return "Very Good";
    if (averageScore >= 60) return "Good";
    if (averageScore >= 40) return "Needs Practice";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* NAVBAR */}
      <header className="border-b border-slate-800 bg-[#070b14]">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold">
              IF
            </div>

            <span className="font-bold">
              Interview
              <span className="text-indigo-400">Forge</span> AI
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="text-xs text-slate-500 transition hover:text-white"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">

          {/* HEADING */}
          <div className="text-center">

            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              YOUR COMPLETE PERFORMANCE
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Overall Performance Analysis
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Your performance is calculated using all your
              completed and saved mock interviews.
            </p>

          </div>

          {/* MAIN STATS */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* AVERAGE SCORE */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
              <p className="text-[10px] font-bold tracking-wider text-slate-500">
                AVERAGE SCORE
              </p>

              <h2 className="mt-4 text-4xl font-extrabold text-indigo-400">
                {averageScore}
                <span className="text-lg text-slate-600">/100</span>
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Across all scored interviews
              </p>
            </div>

            {/* TOTAL INTERVIEWS */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-[10px] font-bold tracking-wider text-slate-500">
                TOTAL INTERVIEWS
              </p>

              <h2 className="mt-4 text-4xl font-extrabold text-white">
                {interviews.length}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Saved interview sessions
              </p>
            </div>

            {/* QUESTIONS ANSWERED */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-[10px] font-bold tracking-wider text-slate-500">
                QUESTIONS ANSWERED
              </p>

              <h2 className="mt-4 text-4xl font-extrabold text-cyan-400">
                {answeredQuestions}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Out of {totalQuestions} total questions
              </p>
            </div>

            {/* BEST SCORE */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-[10px] font-bold tracking-wider text-slate-500">
                BEST SCORE
              </p>

              <h2 className="mt-4 text-4xl font-extrabold text-green-400">
                {bestScore}
                <span className="text-lg text-slate-600">/100</span>
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Highest interview score
              </p>
            </div>

          </div>

          {/* OVERALL SUMMARY */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">

            {/* SCORE CARD */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-slate-900/40 p-8 text-center">

              <p className="text-[10px] font-bold tracking-[3px] text-slate-500">
                YOUR OVERALL RATING
              </p>

              <div className="mt-5">
                <span className="text-7xl font-extrabold text-indigo-400">
                  {averageScore}
                </span>

                <span className="text-xl text-slate-600">
                  /100
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-green-400">
                {getScoreLabel()}
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700"
                  style={{
                    width: `${averageScore}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Based on {scoredInterviews.length} scored interviews
              </p>

            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">

              <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
                PERFORMANCE SUMMARY
              </p>

              <h2 className="mt-4 text-xl font-bold">
                Your Overall Progress
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {getPerformanceMessage()}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                  <p className="text-[9px] font-bold tracking-wider text-green-400">
                    STRONGEST SKILL
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {bestSkill?.name || "Not Available"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {bestSkill?.score ?? 0}% Average
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                  <p className="text-[9px] font-bold tracking-wider text-yellow-400">
                    FOCUS AREA
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {improvementSkill?.name || "Not Available"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {improvementSkill?.score ?? 0}% Average
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* SKILL ANALYSIS */}
          <div className="mt-10">

            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              OVERALL SKILL ANALYSIS
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your Skill Performance
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Average score of each skill across all your interviews.
            </p>

            {skillAnalysis.length > 0 ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {skillAnalysis.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
                  >

                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        {skill.name}
                      </h3>

                      <span className="text-2xl font-bold text-indigo-400">
                        {skill.score}%
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, skill.score)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-4 flex justify-between text-[10px] text-slate-600">
                      <span>
                        {index === 0
                          ? "Strongest Skill"
                          : "Skill Performance"}
                      </span>

                      <span>Average Score</span>
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-500">
                Skill analysis will appear when your saved
                interviews contain skill scores.
              </p>
            )}

          </div>

          {/* STRENGTHS AND IMPROVEMENTS */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">

            {/* STRENGTHS */}
            <div className="rounded-2xl border border-green-500/10 bg-slate-900/40 p-7">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Your Overall Strengths
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Strengths identified across interviews
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                {allStrengths.length > 0 ? (
                  allStrengths.slice(0, 8).map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-lg border border-slate-800 bg-[#080e1a] p-4"
                    >
                      <span className="text-green-400">✓</span>

                      <p className="text-xs leading-6 text-slate-400">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No strengths data available yet.
                  </p>
                )}

              </div>
            </div>

            {/* IMPROVEMENTS */}
            <div className="rounded-2xl border border-yellow-500/10 bg-slate-900/40 p-7">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Areas to Improve
                  </p>

                  <p className="text-[10px] text-slate-600">
                    Improvement areas from all interviews
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                {allImprovements.length > 0 ? (
                  allImprovements.slice(0, 8).map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-lg border border-slate-800 bg-[#080e1a] p-4"
                    >
                      <span className="text-yellow-400">!</span>

                      <p className="text-xs leading-6 text-slate-400">
                        {item}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No improvement data available yet.
                  </p>
                )}

              </div>
            </div>

          </div>

          {/* INTERVIEW HISTORY */}
          <div className="mt-10">

            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              YOUR ACTIVITY
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Recent Interviews
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">

              {interviews.slice(0, 5).map((interview, index) => (
                <div
                  key={interview._id || index}
                  className="flex flex-col gap-3 border-b border-slate-800 p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      {interview.jobRole || "Mock Interview"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {interview.interviewType || "General"} ·{" "}
                      {interview.difficulty || "Not specified"}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      {interview.createdAt
                        ? new Date(interview.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-indigo-400">
                      {interview.overallScore ?? 0}
                      <span className="text-xs text-slate-600">
                        /100
                      </span>
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Interview Score
                    </p>
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/interview-setup"
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3 text-center text-xs font-semibold transition hover:from-indigo-500 hover:to-purple-500"
            >
              Take Another Interview →
            </Link>

            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-700 px-7 py-3 text-center text-xs font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-white"
            >
              Back to Dashboard
            </Link>

          </div>

          <p className="mt-10 text-center text-[10px] text-slate-700">
            Keep practicing. Every interview is an opportunity to improve.
          </p>

        </div>
      </main>
    </div>
  );
};

export default Performance;
