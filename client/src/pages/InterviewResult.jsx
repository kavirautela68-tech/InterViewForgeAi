
import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../api";

const InterviewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [questionDetails, setQuestionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interviewId, setInterviewId] = useState(null);

  // Prevent duplicate processing in React StrictMode
  const processingPromiseRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // =========================================
    // LOAD SAVED INTERVIEW (HISTORY MODE)
    // =========================================

    const loadSavedInterview = async (savedInterviewId) => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/interviews/${savedInterviewId}`,
          { timeout: 120000 }
        );

        const interview = response.data?.interview;

        if (!interview) {
          throw new Error("Interview record not found.");
        }

        if (!isMounted) return;

        setInterviewData(interview);
        setInterviewId(interview._id);

        setResult({
          overallScore: interview.overallScore,
          performance: interview.performance,
          skills: interview.skills || [],
          strengths: interview.strengths || [],
          improvements: interview.improvements || [],
          feedback: interview.feedback || "",
          questionEvaluations:
            interview.questionEvaluations || [],
        });

        setQuestionDetails(
          (interview.questions || []).map((item) => ({
            question: item.question || "",
            category: item.category || "",
            answer: item.answer || "",
            expectedAnswer: item.expectedAnswer || "",
          }))
        );
      } catch (err) {
        console.error("FETCH INTERVIEW ERROR:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load interview history."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // =========================================
    // EVALUATE AND SAVE NEW INTERVIEW
    // =========================================

    const evaluateAndSaveInterview = async (data) => {
      if (!data) {
        throw new Error(
          "Interview data not found. Please complete the interview again."
        );
      }

      const questions = data.questions;

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("No interview questions found.");
      }

      const completedQuestions = [];
      const evaluations = [];

      // =========================================
      // GENERATE EXPECTED ANSWERS AND EVALUATE
      // =========================================

      for (const item of questions) {
        const questionText = item.question || "";
        const answerText = item.answer || "";

        if (!questionText.trim()) continue;

        const category =
          item.category || data.interviewType || "General";

        // -----------------------------------------
        // GENERATE EXPECTED ANSWER
        // -----------------------------------------

        let expectedAnswer = "";

        try {
          const expectedResponse = await api.post(
            "/ai/expected-answer",
            {
              question: questionText,
              jobRole: data.jobRole || "General",
              interviewType: data.interviewType || "General",
              difficulty: data.difficulty || "Intermediate",
            },
            { timeout: 120000 }
          );

          expectedAnswer =
            expectedResponse.data?.expectedAnswer || "";
        } catch (expectedError) {
          console.error(
            "EXPECTED ANSWER ERROR:",
            expectedError.response?.data ||
              expectedError.message
          );

          expectedAnswer =
            "Expected answer could not be generated. Please try again later.";
        }

        // Save question, user answer and expected answer
        completedQuestions.push({
          question: questionText,
          category,
          answer: answerText,
          expectedAnswer,
        });

        // -----------------------------------------
        // EVALUATE USER ANSWER
        // -----------------------------------------

        if (!answerText.trim()) {
          evaluations.push({
            question: questionText,
            category,
            score: 0,
            feedback: "No answer was provided.",
          });

          continue;
        }

        try {
          const evaluationResponse = await api.post(
            "/ai/evaluate",
            {
              question: questionText,
              answer: answerText,
              jobRole: data.jobRole || "General",
            },
            { timeout: 120000 }
          );

          const evaluation = evaluationResponse.data || {};

          evaluations.push({
            question: questionText,
            category,
            score: Math.min(
              100,
              Math.max(
                0,
                Number(
                  evaluation.score ??
                    evaluation.overallScore ??
                    0
                ) || 0
              )
            ),
            feedback:
              evaluation.feedback ||
              evaluation.comment ||
              "No feedback available.",
          });
        } catch (evaluationError) {
          console.error(
            "QUESTION EVALUATION ERROR:",
            evaluationError.response?.data ||
              evaluationError.message
          );

          evaluations.push({
            question: questionText,
            category,
            score: 0,
            feedback: "This question could not be evaluated.",
          });
        }
      }

      if (completedQuestions.length === 0) {
        throw new Error("No valid interview questions found.");
      }

      if (evaluations.length === 0) {
        throw new Error("No questions could be evaluated.");
      }

      // =========================================
      // CALCULATE OVERALL SCORE
      // =========================================

      const totalScore = evaluations.reduce(
        (total, item) => total + Number(item.score || 0),
        0
      );

      const overallScore = Math.round(
        totalScore / evaluations.length
      );

      // =========================================
      // PERFORMANCE
      // =========================================

      let performance = "Needs Improvement";

      if (overallScore >= 80) {
        performance = "Excellent Performance";
      } else if (overallScore >= 70) {
        performance = "Good Performance";
      } else if (overallScore >= 50) {
        performance = "Average Performance";
      }

      // =========================================
      // SKILL ANALYSIS
      // =========================================

      const categoryScores = {};

      evaluations.forEach((item) => {
        const category = item.category || "General";

        if (!categoryScores[category]) {
          categoryScores[category] = {
            total: 0,
            count: 0,
          };
        }

        categoryScores[category].total +=
          Number(item.score || 0);

        categoryScores[category].count += 1;
      });

      const skills = Object.entries(categoryScores).map(
        ([name, value]) => ({
          name,
          score: Math.round(value.total / value.count),
        })
      );

      // =========================================
      // STRENGTHS
      // =========================================

      const strengths = evaluations
        .filter((item) => item.score >= 80)
        .map(
          (item) =>
            `Strong performance on: ${item.question}`
        )
        .slice(0, 4);

      if (strengths.length === 0) {
        strengths.push(
          "You attempted the interview questions and completed the evaluation."
        );
      }

      // =========================================
      // IMPROVEMENTS
      // =========================================

      const improvements = evaluations
        .filter((item) => item.score < 60)
        .map(
          (item) =>
            `Improve your answer for: ${item.question}`
        )
        .slice(0, 4);

      if (improvements.length === 0) {
        improvements.push(
          "Continue practicing technical concepts and answer structure."
        );
      }

      // =========================================
      // FEEDBACK
      // =========================================

      let feedback =
        "More practice is recommended. Focus on understanding the concepts and explaining answers step by step.";

      if (overallScore >= 80) {
        feedback =
          "You demonstrated strong interview performance. Continue practicing to maintain consistency and improve advanced concepts.";
      } else if (overallScore >= 70) {
        feedback =
          "You performed well. Focus on improving answer depth, clarity, and confidence.";
      } else if (overallScore >= 50) {
        feedback =
          "Your fundamentals are developing. Practice more questions and explain your answers with better structure.";
      }

      // =========================================
      // FINAL RESULT
      // =========================================

      const finalResult = {
        overallScore,
        performance,
        skills,
        strengths,
        improvements,
        feedback,
        questionEvaluations: evaluations,
      };

      // =========================================
      // SAVE INTERVIEW TO MONGODB
      // =========================================

      const saveData = {
        jobRole: data.jobRole || "Unknown Role",
        interviewType: data.interviewType || "Technical",
        difficulty: data.difficulty || "Intermediate",
        duration: Number(data.duration) || 20,

        totalQuestions: completedQuestions.length,

        questions: completedQuestions,

        overallScore,
        performance,
        skills,
        strengths,
        improvements,
        feedback,

        // Requires matching backend schema/controller fields
        questionEvaluations: evaluations,
      };

      const saveResponse = await api.post(
        "/interviews",
        saveData,
        { timeout: 120000 }
      );

      const savedId = saveResponse.data?.interview?._id;

      if (!savedId) {
        throw new Error(
          "Interview was processed, but the server did not return the saved interview ID."
        );
      }

      return {
        finalResult,
        completedQuestions,
        savedId,
      };
    };

    // =========================================
    // HISTORY MODE
    // =========================================

    if (id) {
      loadSavedInterview(id);
    }

    // =========================================
    // NEW INTERVIEW MODE
    // =========================================

    else {
      const data = location.state?.interviewData;

      // Create one shared Promise.
      // StrictMode's second effect setup reuses it.
      if (!processingPromiseRef.current) {
        processingPromiseRef.current =
          evaluateAndSaveInterview(data);
      }

      processingPromiseRef.current
        .then((response) => {
          if (!isMounted) return;

          setResult(response.finalResult);
          setInterviewData(data);
          setQuestionDetails(response.completedQuestions);
          setInterviewId(response.savedId);
        })
        .catch((err) => {
          console.error("INTERVIEW RESULT ERROR:", err);

          if (isMounted) {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Failed to generate or save interview result."
            );
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

          <h2 className="mt-6 text-lg font-semibold">
            AI is analyzing your interview...
          </h2>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Please wait while we evaluate your answers and
            generate your expected answers. This may take
            a little time.
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="text-4xl">⚠️</div>

          <h2 className="mt-4 text-xl font-bold">
            Evaluation Failed
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate("/interview-setup")}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-xs font-semibold transition hover:bg-indigo-500"
            >
              Try Again
            </button>

            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-700 px-6 py-3 text-xs font-semibold text-slate-300 transition hover:border-indigo-500"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // SAFETY
  // =========================================

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">
        <div className="text-center">
          <p className="text-sm text-slate-500">
            No evaluation result found.
          </p>

          <Link
            to="/interview-setup"
            className="mt-5 inline-block text-xs text-indigo-400 hover:text-indigo-300"
          >
            Start a new interview →
          </Link>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* NAVBAR */}

      <header className="border-b border-slate-800 bg-[#070b14]">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold shadow-lg shadow-indigo-500/20">
              IF
            </div>

            <span className="text-lg font-bold">
              Interview
              <span className="text-indigo-400">Forge</span>{" "}
              <span className="text-slate-500">AI</span>
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

      <main className="px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-5xl">

          {/* HEADING */}

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-400/10 text-2xl text-green-400">
              ✓
            </div>

            <p className="mt-5 text-[10px] font-bold tracking-[3px] text-indigo-400">
              INTERVIEW COMPLETED
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {id ? "Interview Report" : "Great Job! 🎉"}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Your AI-generated interview performance and answer review.
            </p>
          </div>

          {/* SCORE */}

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-slate-900/40 p-10 text-center">
            <p className="text-[10px] tracking-[3px] text-slate-500">
              OVERALL SCORE
            </p>

            <div className="mt-4">
              <span className="text-7xl font-extrabold text-indigo-400 sm:text-8xl">
                {result.overallScore ?? 0}
              </span>

              <span className="ml-2 text-xl text-slate-600">
                /100
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-green-400">
              {result.performance || "Performance Evaluated"}
            </p>

            <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(Number(result.overallScore) || 0, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* INTERVIEW INFO */}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <p className="text-[9px] tracking-widest text-slate-600">
                ROLE
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-300">
                {interviewData?.jobRole || "Not Available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <p className="text-[9px] tracking-widest text-slate-600">
                INTERVIEW TYPE
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-300">
                {interviewData?.interviewType || "Not Available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <p className="text-[9px] tracking-widest text-slate-600">
                DIFFICULTY
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-300">
                {interviewData?.difficulty || "Not Available"}
              </p>
            </div>
          </div>

          {/* SKILLS */}

          <div className="mt-10">
            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              PERFORMANCE BREAKDOWN
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your Skills
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {Array.isArray(result.skills) &&
              result.skills.length > 0 ? (
                result.skills.map((skill, index) => (
                  <div
                    key={skill.name || index}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-400">
                        {skill.name}
                      </span>

                      <span className="text-sm font-bold text-indigo-400">
                        {skill.score ?? 0}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                        style={{
                          width: `${Math.min(
                            Math.max(Number(skill.score) || 0, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-500">
                  Skill analysis is not available.
                </div>
              )}
            </div>
          </div>

          {/* STRENGTHS AND IMPROVEMENTS */}

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-green-500/10 bg-slate-900/40 p-6">
              <h2 className="font-semibold text-green-400">
                ✓ Your Strengths
              </h2>

              <div className="mt-5 space-y-3 text-xs leading-6 text-slate-400">
                {result.strengths?.map((strength, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <p>{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-500/10 bg-slate-900/40 p-6">
              <h2 className="font-semibold text-yellow-400">
                ! Areas to Improve
              </h2>

              <div className="mt-5 space-y-3 text-xs leading-6 text-slate-400">
                {result.improvements?.map((improvement, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-yellow-400">!</span>
                    <p>{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI FEEDBACK */}

          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              AI FEEDBACK
            </p>

            <h2 className="mt-3 font-semibold">
              Personalized Recommendation
            </h2>

            <p className="mt-3 text-xs leading-7 text-slate-400">
              {result.feedback ||
                "Keep practicing regularly and focus on improving your interview communication and answer structure."}
            </p>
          </div>

          {/* QUESTION-WISE ANSWER REVIEW */}

          <div className="mt-12">
            <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
              AI ANSWER REVIEW
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Questions & Expected Answers
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Compare your submitted answers with AI-generated sample answers
              to understand how you can improve.
            </p>

            <div className="mt-6 space-y-6">
              {questionDetails.map((item, index) => {
                // Match by index so duplicate question text
                // does not show another question's feedback.
                const evaluation =
                  result.questionEvaluations?.[index];

                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
                  >
                    {/* QUESTION HEADER */}

                    <div className="border-b border-slate-800 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[10px] font-bold tracking-widest text-indigo-400">
                          QUESTION {index + 1}
                        </span>

                        <div className="flex items-center gap-3">
                          {item.category && (
                            <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] text-slate-400">
                              {item.category}
                            </span>
                          )}

                          {evaluation && (
                            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold text-indigo-400">
                              Score: {evaluation.score}/100
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-4 text-base font-semibold leading-7 text-white">
                        {item.question}
                      </h3>
                    </div>

                    <div className="grid gap-4 p-5">

                      {/* USER ANSWER */}

                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">●</span>

                          <h4 className="text-xs font-bold tracking-wide text-blue-400">
                            YOUR ANSWER
                          </h4>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                          {item.answer?.trim()
                            ? item.answer
                            : "You did not provide an answer for this question."}
                        </p>
                      </div>

                      {/* EXPECTED ANSWER */}

                      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✦</span>

                          <h4 className="text-xs font-bold tracking-wide text-green-400">
                            AI EXPECTED ANSWER
                          </h4>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                          {item.expectedAnswer?.trim()
                            ? item.expectedAnswer
                            : "Expected answer is not available for this question."}
                        </p>
                      </div>

                      {/* EVALUATION FEEDBACK */}

                      {evaluation?.feedback && (
                        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                          <h4 className="text-xs font-bold tracking-wide text-yellow-400">
                            AI EVALUATION FEEDBACK
                          </h4>

                          <p className="mt-3 text-sm leading-7 text-slate-300">
                            {evaluation.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAVE STATUS */}

          {interviewId && (
            <div className="mt-8 text-center">
              <span className="rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 text-[10px] text-green-400">
                ✓ Interview result saved successfully
              </span>
            </div>
          )}

          {/* BUTTONS */}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/interview-setup"
              className="rounded-lg border border-slate-700 px-6 py-3 text-center text-xs font-semibold text-slate-300 transition hover:border-indigo-500"
            >
              ← Try Again
            </Link>

            <Link
              to="/performance"
              state={{ interviewId }}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-center text-xs font-semibold transition hover:bg-indigo-500"
            >
              View Performance →
            </Link>

            <Link
              to="/history"
              className="rounded-lg border border-slate-700 px-6 py-3 text-center text-xs font-semibold text-slate-300 transition hover:border-indigo-500"
            >
              Interview History
            </Link>

            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-700 px-6 py-3 text-center text-xs font-semibold text-slate-300 transition hover:border-indigo-500"
            >
              Dashboard
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default InterviewResult;
