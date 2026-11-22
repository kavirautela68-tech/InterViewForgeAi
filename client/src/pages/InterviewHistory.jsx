import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api";


const InterviewHistory = () => {

  const navigate = useNavigate();

  // ================= STATES =================

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ================= FETCH INTERVIEWS =================

  useEffect(() => {

    const fetchInterviews = async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await api.get("/interviews");

        setInterviews(
          response.data.interviews || []
        );

      } catch (error) {

        console.error(
          "Fetch interview history error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to fetch interview history."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchInterviews();

  }, []);


  // ================= CALCULATE STATUS =================

  const getStatus = (score) => {

    if (score >= 80) {
      return "Excellent";
    }

    if (score >= 60) {
      return "Good";
    }

    return "Needs Work";

  };


  // ================= FORMAT DATE =================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ================= FORMAT DURATION =================

  const formatDuration = (
    duration
  ) => {

    if (!duration) {
      return "N/A";
    }

    return `${duration} min`;

  };


  // ================= FILTER INTERVIEWS =================

  const filteredInterviews =
    useMemo(() => {

      return interviews.filter(
        (interview) => {

          const type =
            interview.interviewType ||
            "";

          const role =
            interview.jobRole ||
            "";

          const matchesFilter =
            filter === "All" ||
            type
              .toLowerCase()
              .includes(
                filter.toLowerCase()
              );

          const matchesSearch =
            role
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchesFilter &&
            matchesSearch
          );

        }
      );

    }, [
      interviews,
      filter,
      search,
    ]);


  // ================= STATISTICS =================

  const totalInterviews =
    interviews.length;


  const averageScore =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce(
            (total, interview) =>
              total +
              (Number(
                interview.overallScore
              ) || 0),
            0
          ) / totalInterviews
        )
      : 0;


  const bestScore =
    totalInterviews > 0
      ? Math.max(
          ...interviews.map(
            (interview) =>
              Number(
                interview.overallScore
              ) || 0
          )
        )
      : 0;


  // ================= STATUS STYLE =================

  const getStatusStyle = (
    status
  ) => {

    if (status === "Excellent") {
      return "bg-green-400/10 text-green-400";
    }

    if (status === "Good") {
      return "bg-indigo-400/10 text-indigo-400";
    }

    return "bg-yellow-400/10 text-yellow-400";

  };


  // ================= VIEW RESULT =================

  const handleViewResult = (
    interviewId
  ) => {

    navigate(
      `/interview-result/${interviewId}`
    );

  };


  // ================= DELETE INTERVIEW =================

  const handleDelete = async (
    interviewId
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this interview?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/interviews/${interviewId}`
      );

      setInterviews(
        (previous) =>
          previous.filter(
            (interview) =>
              interview._id !==
              interviewId
          )
      );

    } catch (error) {

      console.error(
        "Delete interview error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete interview."
      );

    }

  };


  // ================= LOADING =================

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

          <p className="mt-5 text-sm text-slate-500">
            Loading interview history...
          </p>

        </div>

      </div>

    );

  }


  // ================= ERROR =================

  if (error) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">

        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <div className="text-4xl">
            ⚠️
          </div>

          <h2 className="mt-4 text-xl font-bold">
            Failed to Load History
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-xs font-semibold"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // ================= MAIN UI =================

  return (

    <div className="min-h-screen bg-[#070b14] text-white">


      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#070b14]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link
            to="/dashboard"
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

              <span className="text-slate-500">
                AI
              </span>

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


      {/* ================= MAIN ================= */}

      <main className="px-6 py-10 lg:px-10">

        <div className="mx-auto max-w-7xl">


          {/* ================= HEADER ================= */}

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
                INTERVIEW HISTORY
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Your Previous Interviews
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
                Review your previous interviews,
                scores, and AI feedback to track
                your progress.
              </p>

            </div>


            <Link
              to="/interview-setup"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-xs font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500"
            >
              Start New Interview →
            </Link>

          </div>


          {/* ================= STATS ================= */}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">


            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                  🎯
                </div>

                <span className="text-[9px] text-slate-600">
                  All Time
                </span>

              </div>

              <p className="mt-5 text-[10px] text-slate-600">
                TOTAL INTERVIEWS
              </p>

              <p className="mt-1 text-3xl font-bold">
                {totalInterviews}
              </p>

            </div>


            {/* AVERAGE */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg">
                  📈
                </div>

                <span className="text-[9px] text-slate-600">
                  Overall
                </span>

              </div>

              <p className="mt-5 text-[10px] text-slate-600">
                AVERAGE SCORE
              </p>

              <p className="mt-1 text-3xl font-bold">
                {averageScore}%
              </p>

            </div>


            {/* BEST */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

              <div className="flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10 text-lg">
                  🏆
                </div>

                <span className="text-[9px] text-slate-600">
                  Personal Best
                </span>

              </div>

              <p className="mt-5 text-[10px] text-slate-600">
                BEST SCORE
              </p>

              <p className="mt-1 text-3xl font-bold text-green-400">
                {bestScore}
              </p>

            </div>

          </div>


          {/* ================= SEARCH + FILTER ================= */}

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


              {/* SEARCH */}

              <div className="relative w-full lg:max-w-sm">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search by role..."
                  className="w-full rounded-lg border border-slate-800 bg-[#080e1a] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-700 transition focus:border-indigo-500"
                />

              </div>


              {/* FILTER */}

              <div className="flex flex-wrap gap-2">

                {[
                  "All",
                  "Technical",
                  "HR",
                  "Mixed",
                ].map(
                  (item) => (

                    <button
                      key={item}
                      onClick={() =>
                        setFilter(item)
                      }
                      className={`rounded-lg px-4 py-2.5 text-[10px] font-semibold transition ${
                        filter === item
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-800 bg-slate-900 text-slate-500 hover:border-indigo-500/50 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>

                  )
                )}

              </div>

            </div>

          </div>


          {/* ================= INTERVIEW LIST ================= */}

          <div className="mt-6">


            <div className="mb-4 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-bold tracking-[2px] text-indigo-400">
                  YOUR INTERVIEWS
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Recent Sessions
                </h2>

              </div>


              <span className="text-[10px] text-slate-600">

                {filteredInterviews.length} interviews

              </span>

            </div>


            {/* ================= DESKTOP TABLE ================= */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-800 md:block">

              <table className="w-full">

                <thead className="bg-slate-900">

                  <tr>

                    <th className="px-6 py-4 text-left text-[9px] font-medium tracking-wider text-slate-600">
                      INTERVIEW
                    </th>

                    <th className="px-4 py-4 text-left text-[9px] font-medium tracking-wider text-slate-600">
                      TYPE
                    </th>

                    <th className="px-4 py-4 text-left text-[9px] font-medium tracking-wider text-slate-600">
                      DATE
                    </th>

                    <th className="px-4 py-4 text-left text-[9px] font-medium tracking-wider text-slate-600">
                      DURATION
                    </th>

                    <th className="px-4 py-4 text-left text-[9px] font-medium tracking-wider text-slate-600">
                      SCORE
                    </th>

                    <th className="px-4 py-4 text-left text-[9px] font-medium tracking-wider text-slate-600">
                      STATUS
                    </th>

                    <th className="px-6 py-4 text-right text-[9px] font-medium tracking-wider text-slate-600">
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredInterviews.length > 0 ? (

                    filteredInterviews.map(
                      (interview, index) => {

                        const status =
                          getStatus(
                            interview.overallScore
                          );

                        return (

                          <tr
                            key={interview._id}
                            className="border-t border-slate-800 transition hover:bg-slate-900/60"
                          >


                            {/* ROLE */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-sm">
                                  💻
                                </div>

                                <div>

                                  <p className="text-xs font-semibold text-slate-300">

                                    {interview.jobRole}

                                  </p>

                                  <p className="mt-1 text-[9px] text-slate-700">

                                    Interview #
                                    {totalInterviews -
                                      index}

                                  </p>

                                </div>

                              </div>

                            </td>


                            {/* TYPE */}

                            <td className="px-4 py-5">

                              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[9px] text-slate-500">

                                {interview.interviewType}

                              </span>

                            </td>


                            {/* DATE */}

                            <td className="px-4 py-5 text-[10px] text-slate-500">

                              {formatDate(
                                interview.createdAt
                              )}

                            </td>


                            {/* DURATION */}

                            <td className="px-4 py-5 text-[10px] text-slate-500">

                              {formatDuration(
                                interview.duration
                              )}

                            </td>


                            {/* SCORE */}

                            <td className="px-4 py-5">

                              <span className="text-sm font-bold text-indigo-400">

                                {interview.overallScore}

                              </span>

                              <span className="text-[9px] text-slate-700">
                                /100
                              </span>

                            </td>


                            {/* STATUS */}

                            <td className="px-4 py-5">

                              <span
                                className={`rounded-full px-3 py-1 text-[8px] font-semibold ${getStatusStyle(
                                  status
                                )}`}
                              >

                                {status}

                              </span>

                            </td>


                            {/* ACTION */}

                            <td className="px-6 py-5 text-right">

                              <div className="flex justify-end gap-4">

                                <button
                                  onClick={() =>
                                    handleViewResult(
                                      interview._id
                                    )
                                  }
                                  className="text-[10px] font-semibold text-indigo-400 transition hover:text-indigo-300"
                                >
                                  View →
                                </button>


                                <button
                                  onClick={() =>
                                    handleDelete(
                                      interview._id
                                    )
                                  }
                                  className="text-[10px] font-semibold text-red-400 transition hover:text-red-300"
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>

                        );

                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="px-6 py-16 text-center"
                      >

                        <div className="text-3xl">
                          🔍
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          No interviews found
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          Try another search or filter.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>


            {/* ================= MOBILE CARDS ================= */}

            <div className="space-y-3 md:hidden">

              {filteredInterviews.length > 0 ? (

                filteredInterviews.map(
                  (interview) => {

                    const status =
                      getStatus(
                        interview.overallScore
                      );

                    return (

                      <div
                        key={interview._id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                              💻
                            </div>

                            <div>

                              <p className="text-xs font-semibold text-slate-300">

                                {interview.jobRole}

                              </p>

                              <p className="mt-1 text-[9px] text-slate-600">

                                {interview.interviewType}
                                {" · "}
                                {formatDate(
                                  interview.createdAt
                                )}

                              </p>

                            </div>

                          </div>


                          <div className="text-right">

                            <p className="text-xl font-bold text-indigo-400">

                              {interview.overallScore}

                            </p>

                            <p className="text-[8px] text-slate-700">
                              /100
                            </p>

                          </div>

                        </div>


                        <div className="mt-5 border-t border-slate-800 pt-4">

                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <span className="text-[9px] text-slate-600">

                                ⏱{" "}

                                {formatDuration(
                                  interview.duration
                                )}

                              </span>


                              <span
                                className={`rounded-full px-3 py-1 text-[8px] font-semibold ${getStatusStyle(
                                  status
                                )}`}
                              >

                                {status}

                              </span>

                            </div>

                          </div>


                          <div className="mt-4 flex gap-3">

                            <button
                              onClick={() =>
                                handleViewResult(
                                  interview._id
                                )
                              }
                              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-[10px] font-semibold"
                            >
                              View Result →
                            </button>


                            <button
                              onClick={() =>
                                handleDelete(
                                  interview._id
                                )
                              }
                              className="rounded-lg border border-red-500/20 px-4 py-2.5 text-[10px] font-semibold text-red-400"
                            >
                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    );

                  }
                )

              ) : (

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center">

                  <div className="text-3xl">
                    🔍
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    No interviews found
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Start a new interview to see
                    your history here.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* ================= BOTTOM CTA ================= */}

          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 p-8 text-center">

            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              READY FOR MORE?
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Improve Your Interview Score
            </h2>

            <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-slate-500">
              Keep practicing with personalized AI
              interviews and turn your weak areas
              into strengths.
            </p>

            <Link
              to="/interview-setup"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-xs font-semibold shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
            >
              Start New Interview →
            </Link>

          </div>


          <p className="mt-10 text-center text-[9px] text-slate-700">
            InterviewForge AI · Interview History
          </p>

        </div>

      </main>

    </div>

  );

};


export default InterviewHistory;