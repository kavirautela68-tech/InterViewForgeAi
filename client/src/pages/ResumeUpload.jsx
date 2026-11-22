import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ResumeUpload = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // FILE VALIDATION
  // ============================================================

  const validateFile = (file) => {
    if (!file) {
      return "Please select a resume.";
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF and DOCX files are allowed.";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5 MB.";
    }

    return "";
  };

  // ============================================================
  // FILE SELECT
  // ============================================================

  const handleFileSelect = (file) => {
    setError("");
    setUploaded(false);

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // ============================================================
  // DRAG EVENTS
  // ============================================================

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // ============================================================
  // UPLOAD + AI ANALYSIS
  // ============================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setError("");
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", selectedFile);

      console.log("Uploading resume:", selectedFile.name);

      const response = await api.post(
        "/ai/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Resume Analysis Response:",
        response.data
      );

      // ========================================================
      // SAVE ANALYSIS
      // ========================================================

      localStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "resumeFileName",
        selectedFile.name
      );

      localStorage.setItem(
        "resumeFileSize",
        selectedFile.size.toString()
      );

      // ========================================================
      // SUCCESS
      // ========================================================

      setUploading(false);
      setUploaded(true);

      // Move to analysis page
      navigate("/resume-analysis");

    } catch (error) {
      console.error(
        "Resume Upload Error:",
        error
      );

      setUploading(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Resume analysis failed. Please try again.";

      setError(errorMessage);
    }
  };

  // ============================================================
  // REMOVE FILE
  // ============================================================

  const removeFile = () => {
    setSelectedFile(null);
    setUploaded(false);
    setError("");
  };

  // ============================================================
  // FORMAT FILE SIZE
  // ============================================================

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
          >
            Dashboard
          </button>

        </div>
      </nav>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-5">
            <span>✨</span>
            AI Resume Analyzer
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Analyze Your Resume
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload your resume and let AI analyze your skills,
            projects, strengths, improvements and suitable
            career roles.
          </p>

        </div>

        {/* ====================================================
            UPLOAD CARD
        ==================================================== */}

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 shadow-2xl">

          {/* DROP AREA */}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
              dragActive
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-slate-700 hover:border-cyan-500/50"
            }`}
          >

            {!selectedFile ? (

              <>
                {/* ICON */}

                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-4xl">
                  📄
                </div>

                <h3 className="text-2xl font-semibold mb-3">
                  Upload your resume
                </h3>

                <p className="text-slate-400 mb-6">
                  Drag & drop your resume here or choose a file
                </p>

                <label className="inline-flex cursor-pointer px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition">
                  Choose Resume

                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-slate-500 mt-4">
                  Supported formats: PDF, DOCX • Maximum size: 5 MB
                </p>
              </>

            ) : (

              /* ==================================================
                 SELECTED FILE
                 ================================================== */

              <div className="max-w-xl mx-auto">

                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-green-500/10 flex items-center justify-center text-4xl">
                  📄
                </div>

                <h3 className="text-xl font-semibold">
                  {selectedFile.name}
                </h3>

                <p className="text-slate-400 mt-2">
                  {formatFileSize(selectedFile.size)}
                </p>

                <div className="flex items-center justify-center gap-3 mt-6">

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-7 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {uploading
                      ? "Analyzing Resume..."
                      : "Analyze Resume"}
                  </button>

                  {!uploading && (
                    <button
                      onClick={removeFile}
                      className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                    >
                      Remove
                    </button>
                  )}

                </div>

              </div>

            )}

          </div>

          {/* ==================================================
              LOADING
              ================================================== */}

          {uploading && (
            <div className="mt-6 p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">

              <div className="flex items-center gap-4">

                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />

                <div>
                  <p className="font-medium text-white">
                    AI is analyzing your resume...
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Extracting resume information and generating
                    personalized insights.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================
              ERROR
              ================================================== */}

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
              <div className="flex gap-3">
                <span>⚠️</span>

                <div>
                  <p className="font-medium">
                    Upload failed
                  </p>

                  <p className="text-sm mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              SUCCESS
              ================================================== */}

          {uploaded && !error && (
            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300">
              Resume analyzed successfully.
            </div>
          )}

        </div>

        {/* ====================================================
            HOW IT WORKS
        ==================================================== */}

        <div className="grid md:grid-cols-3 gap-5 mt-10">

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">
              📤
            </div>

            <h3 className="font-semibold text-lg mb-2">
              1. Upload
            </h3>

            <p className="text-sm text-slate-400">
              Upload your PDF or DOCX resume securely.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">
              🤖
            </div>

            <h3 className="font-semibold text-lg mb-2">
              2. AI Analysis
            </h3>

            <p className="text-sm text-slate-400">
              AI extracts and evaluates the actual content
              of your resume.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">
              📊
            </div>

            <h3 className="font-semibold text-lg mb-2">
              3. Get Insights
            </h3>

            <p className="text-sm text-slate-400">
              View your resume score, skills, projects,
              strengths and improvements.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default ResumeUpload;