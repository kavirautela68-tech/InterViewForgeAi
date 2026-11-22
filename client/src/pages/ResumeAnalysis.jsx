import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalysis = () => {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD ANALYSIS
  // ============================================================

  useEffect(() => {
    const savedAnalysis =
      localStorage.getItem("resumeAnalysis");

    if (!savedAnalysis) {
      setLoading(false);
      return;
    }

    try {
      const parsedAnalysis =
        JSON.parse(savedAnalysis);

      console.log(
        "Resume Analysis Loaded:",
        parsedAnalysis
      );

      setAnalysis(parsedAnalysis);

    } catch (error) {
      console.error(
        "Failed to parse resume analysis:",
        error
      );

      localStorage.removeItem("resumeAnalysis");
    }

    setLoading(false);
  }, []);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-5" />

          <p className="text-slate-300">
            Loading resume analysis...
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // NO ANALYSIS
  // ============================================================

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <div className="text-6xl mb-5">
            📄
          </div>

          <h2 className="text-2xl font-bold mb-3">
            No Resume Analysis Found
          </h2>

          <p className="text-slate-400 mb-6">
            Please upload a resume first to generate
            your AI-powered analysis.
          </p>

          <button
            onClick={() =>
              navigate("/resume-upload")
            }
            className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
          >
            Upload Resume
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // DYNAMIC DATA
  // ============================================================

  const resumeScore =
    Number(analysis.resumeScore) || 0;

  const candidateName =
    analysis.candidateName ||
    "Candidate";

  const primaryRole =
    analysis.primaryRole ||
    "Not specified";

  const experience =
    analysis.experience ||
    "Not specified";

  const summary =
    analysis.summary ||
    "No professional summary was detected.";

  const skills =
    Array.isArray(analysis.skills)
      ? analysis.skills
      : [];

  const projects =
    Array.isArray(analysis.projects)
      ? analysis.projects
      : [];

  const strengths =
    Array.isArray(analysis.strengths)
      ? analysis.strengths
      : [];

  const improvements =
    Array.isArray(analysis.improvements)
      ? analysis.improvements
      : [];

  const suggestedRoles =
    Array.isArray(analysis.suggestedRoles)
      ? analysis.suggestedRoles
      : [];

  const fileName =
    analysis.file?.name ||
    localStorage.getItem("resumeFileName") ||
    "Resume";

  const fileSize =
    analysis.file?.size ||
    Number(localStorage.getItem("resumeFileSize")) ||
    0;

  // ============================================================
  // SCORE LABEL
  // ============================================================

  const getScoreLabel = () => {
    if (resumeScore >= 85) {
      return "Excellent Resume";
    }

    if (resumeScore >= 70) {
      return "Strong Resume";
    }

    if (resumeScore >= 55) {
      return "Good Resume";
    }

    return "Needs Improvement";
  };

  // ============================================================
  // SCORE COLOR
  // ============================================================

  const getScoreColor = () => {
    if (resumeScore >= 85) {
      return "text-green-400";
    }

    if (resumeScore >= 70) {
      return "text-cyan-400";
    }

    if (resumeScore >= 55) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  // ============================================================
  // FILE SIZE
  // ============================================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ============================================================
  // NEW ANALYSIS
  // ============================================================

  const handleNewAnalysis = () => {
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("resumeFileName");
    localStorage.removeItem("resumeFileSize");

    navigate("/resume-upload");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >

            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-slate-950">
              IF
            </div>

            <div>
              <h1 className="font-bold text-lg">
                InterviewForge AI
              </h1>

              <p className="text-xs text-slate-400">
                AI Career Assistant
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={handleNewAnalysis}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            >
              New Analysis
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
            >
              Dashboard
            </button>

          </div>

        </div>

      </nav>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4">
                ✨ AI Resume Analysis
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">
                Resume Analysis
              </h2>

              <p className="text-slate-400 mt-2">
                Personalized insights generated from your uploaded resume.
              </p>

            </div>

            <button
              onClick={handleNewAnalysis}
              className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
            >
              Analyze Another Resume
            </button>

          </div>

        </div>

        {/* ====================================================
            RESUME INFO
        ==================================================== */}

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          {/* FILE */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Resume
            </p>

            <p
              className="font-medium text-white mt-2 truncate"
              title={fileName}
            >
              {fileName}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {formatFileSize(fileSize)}
            </p>

          </div>

          {/* SCORE */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Resume Score
            </p>

            <p
              className={`text-3xl font-bold mt-2 ${getScoreColor()}`}
            >
              {resumeScore}/100
            </p>

          </div>

          {/* SKILLS */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Skills Detected
            </p>

            <p className="text-3xl font-bold text-white mt-2">
              {skills.length}
            </p>

          </div>

          {/* PROJECTS */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Projects Detected
            </p>

            <p className="text-3xl font-bold text-white mt-2">
              {projects.length}
            </p>

          </div>

        </div>

        {/* ====================================================
            SCORE + CANDIDATE
        ==================================================== */}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* SCORE CARD */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8">

            <p className="text-slate-400 mb-5">
              Overall Resume Score
            </p>

            <div className="flex items-center gap-7">

              <div
                className={`w-32 h-32 rounded-full border-8 border-cyan-500/20 flex items-center justify-center ${getScoreColor()}`}
              >

                <div className="text-center">

                  <div className="text-4xl font-bold">
                    {resumeScore}
                  </div>

                  <div className="text-xs text-slate-500">
                    / 100
                  </div>

                </div>

              </div>

              <div>

                <h3 className="text-xl font-semibold">
                  {getScoreLabel()}
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  Based on the actual content detected
                  in your resume.
                </p>

              </div>

            </div>

          </div>

          {/* CANDIDATE */}

          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-3xl p-8">

            <div className="flex items-start gap-5">

              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
                👤
              </div>

              <div className="flex-1">

                <p className="text-sm text-slate-500">
                  Candidate
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  {candidateName}
                </h3>

                <div className="flex flex-wrap gap-3 mt-4">

                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm">
                    💼 {primaryRole}
                  </span>

                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm">
                    ⏳ {experience}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            PROFESSIONAL SUMMARY
        ==================================================== */}

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7 mb-8">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              📝
            </div>

            <div>

              <h3 className="text-xl font-semibold">
                Professional Summary
              </h3>

              <p className="text-sm text-slate-500">
                AI-generated summary from your resume
              </p>

            </div>

          </div>

          <p className="text-slate-300 leading-7">
            {summary}
          </p>

        </div>

        {/* ====================================================
            SKILLS
        ==================================================== */}

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7 mb-8">

          <div className="flex items-center justify-between mb-7">

            <div>

              <h3 className="text-xl font-semibold">
                Skills Analysis
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Skills detected from your resume
              </p>

            </div>

            <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">
              {skills.length} Skills
            </span>

          </div>

          {skills.length > 0 ? (

            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">

              {skills.map((skill, index) => {

                const score =
                  Math.min(
                    100,
                    Math.max(
                      0,
                      Number(skill.score) || 0
                    )
                  );

                return (
                  <div
                    key={`${skill.name}-${index}`}
                  >

                    <div className="flex justify-between mb-2">

                      <span className="text-slate-200 font-medium">
                        {skill.name}
                      </span>

                      <span className="text-cyan-400 font-semibold">
                        {score}%
                      </span>

                    </div>

                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="text-center py-8 text-slate-500">
              No skills were detected in this resume.
            </div>

          )}

        </div>

        {/* ====================================================
            PROJECTS
        ==================================================== */}

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7 mb-8">

          <div className="mb-7">

            <h3 className="text-xl font-semibold">
              Projects
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Projects detected from the uploaded resume
            </p>

          </div>

          {projects.length > 0 ? (

            <div className="grid md:grid-cols-2 gap-5">

              {projects.map((project, index) => (

                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5"
                >

                  <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
                      💻
                    </div>

                    <div className="flex-1">

                      <h4 className="font-semibold text-lg">
                        {project.title ||
                          "Untitled Project"}
                      </h4>

                      {project.technology && (
                        <p className="text-cyan-400 text-sm mt-1">
                          {project.technology}
                        </p>
                      )}

                    </div>

                  </div>

                  {project.description && (
                    <p className="text-slate-400 text-sm leading-6 mt-4">
                      {project.description}
                    </p>
                  )}

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-8 text-slate-500">
              No projects were detected in this resume.
            </div>

          )}

        </div>

        {/* ====================================================
            STRENGTHS + IMPROVEMENTS
        ==================================================== */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* STRENGTHS */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                💪
              </div>

              <div>

                <h3 className="text-xl font-semibold">
                  Strengths
                </h3>

                <p className="text-sm text-slate-500">
                  What your resume does well
                </p>

              </div>

            </div>

            {strengths.length > 0 ? (

              <div className="space-y-4">

                {strengths.map((item, index) => (

                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <span className="w-6 h-6 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0 text-sm">
                      ✓
                    </span>

                    <p className="text-slate-300 text-sm leading-6">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-slate-500">
                No strengths detected.
              </p>

            )}

          </div>

          {/* IMPROVEMENTS */}

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                🎯
              </div>

              <div>

                <h3 className="text-xl font-semibold">
                  Improvements
                </h3>

                <p className="text-sm text-slate-500">
                  Areas you can improve
                </p>

              </div>

            </div>

            {improvements.length > 0 ? (

              <div className="space-y-4">

                {improvements.map((item, index) => (

                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <span className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center flex-shrink-0 text-sm">
                      !
                    </span>

                    <p className="text-slate-300 text-sm leading-6">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-slate-500">
                No improvement suggestions available.
              </p>

            )}

          </div>

        </div>

        {/* ====================================================
            SUGGESTED ROLES
        ==================================================== */}

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-7 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              🚀
            </div>

            <div>

              <h3 className="text-xl font-semibold">
                Suggested Career Roles
              </h3>

              <p className="text-sm text-slate-500">
                Roles relevant to the skills found in your resume
              </p>

            </div>

          </div>

          {suggestedRoles.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {suggestedRoles.map((role, index) => (

                <div
                  key={index}
                  className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                >
                  💼 {role}
                </div>

              ))}

            </div>

          ) : (

            <p className="text-slate-500">
              No suitable roles could be detected.
            </p>

          )}

        </div>

        {/* ====================================================
            FOOTER ACTION
        ==================================================== */}

        <div className="text-center pb-10">

          <button
            onClick={handleNewAnalysis}
            className="px-7 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
          >
            Analyze Another Resume
          </button>

          <p className="text-xs text-slate-600 mt-4">
            Analysis is generated using the content of your uploaded resume.
          </p>

        </div>

      </main>

    </div>
  );
};

export default ResumeAnalysis;