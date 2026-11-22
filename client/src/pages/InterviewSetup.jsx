import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const InterviewSetup = () => {
  const navigate = useNavigate();

  // ================= STATES =================
  const [jobRole, setJobRole] = useState("Frontend Developer");
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questions, setQuestions] = useState("10");
  const [duration, setDuration] = useState("20");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= START INTERVIEW =================
  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const prompt = `
You are an expert AI interviewer.

Create a personalized mock interview based on the following details:

Job Role: ${jobRole}
Interview Type: ${interviewType}
Difficulty Level: ${difficulty}
Number of Questions: ${questions}
Interview Duration: ${duration} minutes

Instructions:
- Generate exactly ${questions} interview questions.
- Questions must match the selected job role and interview type.
- Keep the difficulty level ${difficulty}.
- Include practical and relevant questions where appropriate.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use \`\`\`json.
- Do not add any explanation.

Return this exact structure:

{
  "questions": [
    {
      "id": 1,
      "question": "Your question here"
    }
  ]
}
`;

      // ================= GEMINI API CALL =================
      const response = await api.post("/ai/chat", {
        message: prompt,
      });

      const aiResponse = response.data.reply;

      console.log("Gemini Response:", aiResponse);

      // ================= CLEAN JSON =================
      const cleanedResponse = aiResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      // ================= PARSE JSON =================
      const parsedData = JSON.parse(cleanedResponse);

      console.log("Generated Questions:", parsedData.questions);

      // ================= NAVIGATE =================
      navigate("/mock-interview", {
        state: {
          interviewData: {
            jobRole,
            interviewType,
            difficulty,
            duration,
            questions: parsedData.questions,
          },
        },
      });

    } catch (error) {
      console.error("Interview Generation Error:", error);

      setError(
        error.response?.data?.message ||
        "AI interview generate nahi ho paya. Please try again."
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

          <button
            onClick={() => navigate("/dashboard")}
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

          </button>


          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}
      <main className="relative z-10 px-6 py-12">

        <div className="mx-auto w-full max-w-4xl">

          {/* ================= HEADER ================= */}
          <div className="text-center">

            <h1 className="text-3xl font-bold sm:text-4xl">
              Setup Your AI Interview
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Customize your interview preferences and let AI create a
              personalized interview experience for you.
            </p>

          </div>


          {/* ================= ERROR ================= */}
          {error && (
            <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}


          {/* ================= INTERVIEW FORM ================= */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">

            {/* ================= JOB ROLE ================= */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Target Job Role
              </label>

              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="Example: Frontend Developer"
                className="w-full rounded-xl border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

            </div>


            {/* ================= INTERVIEW TYPE ================= */}
            <div className="mt-7">

              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Interview Type
              </label>

              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >

                <option>Technical Interview</option>
                <option>HR Interview</option>
                <option>Behavioral Interview</option>
                <option>Mixed Interview</option>

              </select>

            </div>


            {/* ================= DIFFICULTY ================= */}
            <div className="mt-7">

              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Difficulty Level
              </label>

              <div className="grid gap-4 sm:grid-cols-3">

                {["Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`rounded-xl border px-4 py-4 text-sm transition ${
                        difficulty === level
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                          : "border-slate-700 bg-[#080e1a] text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}

              </div>

            </div>


            {/* ================= QUESTIONS ================= */}
            <div className="mt-7">

              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Number of Questions
              </label>

              <select
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >

                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>

              </select>

            </div>


            {/* ================= DURATION ================= */}
            <div className="mt-7">

              <label className="mb-3 block text-sm font-semibold text-slate-200">
                Interview Duration
              </label>

              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#080e1a] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >

                <option value="10">10 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>

              </select>

            </div>


            {/* ================= AI INFO ================= */}
            <div className="mt-8 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">

              <h3 className="text-sm font-semibold text-indigo-300">
                ✨ AI-Powered Interview
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Gemini AI will generate personalized questions based on your
                job role, interview type and selected difficulty level.
              </p>

            </div>


            {/* ================= START BUTTON ================= */}
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-semibold shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "AI is preparing your interview..."
                : "Start AI Interview →"}

            </button>


            <p className="mt-4 text-center text-xs text-slate-600">
              Your interview will be personalized using your preferences.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default InterviewSetup;