import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MockInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // GET DATA FROM INTERVIEW SETUP PAGE
  // ==========================================

  const interviewData = location.state?.interviewData;

  const jobRole =
    interviewData?.jobRole || "Frontend Developer";

  const interviewType =
    interviewData?.interviewType || "Technical Interview";

  const difficulty =
    interviewData?.difficulty || "Intermediate";

  const duration =
    interviewData?.duration || "20";

  const questions =
    interviewData?.questions || [];

  // ==========================================
  // STATES
  // ==========================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  // Saare answers store honge
  const [answers, setAnswers] = useState({});

  const [isRecording, setIsRecording] =
    useState(false);

  const [timeLeft, setTimeLeft] = useState(
    Number(duration) * 60
  );

  const [showEndModal, setShowEndModal] =
    useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  const recognitionRef = useRef(null);

  const finalTranscriptRef = useRef("");

  // ==========================================
  // TOTAL QUESTIONS
  // ==========================================

  const totalQuestions = questions.length;

  const question = questions[currentQuestion];

  const currentAnswer =
    answers[currentQuestion] || "";

  // ==========================================
  // REDIRECT IF NO QUESTIONS
  // ==========================================

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate("/interview-setup");
    }
  }, [questions, navigate]);

  // ==========================================
  // LOAD CURRENT ANSWER INTO SPEECH REF
  // ==========================================

  useEffect(() => {
    finalTranscriptRef.current =
      answers[currentQuestion] || "";
  }, [currentQuestion]);

  // ==========================================
  // CHECK SPEECH RECOGNITION SUPPORT
  // ==========================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (timeLeft <= 0) {
      stopRecording();
      setShowEndModal(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ==========================================
  // CLEANUP SPEECH RECOGNITION
  // ==========================================

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // ==========================================
  // UPDATE ANSWER
  // ==========================================

  const updateAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: value,
    }));

    finalTranscriptRef.current = value;
  };

  // ==========================================
  // START RECORDING
  // ==========================================

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognition.continuous = true;

      recognition.interimResults = true;

      recognition.lang = "en-US";

      // Current answer preserve karo
      finalTranscriptRef.current =
        answers[currentQuestion] || "";

      recognition.onstart = () => {
        console.log("Speech recognition started");

        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";

        let interimTranscript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const transcript =
            event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current +=
            finalTranscript + " ";
        }

        const combinedText =
          finalTranscriptRef.current +
          interimTranscript;

        setAnswers((previous) => ({
          ...previous,
          [currentQuestion]: combinedText.trim(),
        }));
      };

      recognition.onerror = (event) => {
        console.error(
          "Speech recognition error:",
          event.error
        );

        setIsRecording(false);

        if (event.error === "not-allowed") {
          alert(
            "Microphone permission denied. Please allow microphone access in your browser."
          );
        }

        if (event.error === "audio-capture") {
          alert(
            "No microphone was found. Please check your microphone."
          );
        }

        if (event.error === "network") {
          alert(
            "Speech recognition needs an internet connection."
          );
        }
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");

        setIsRecording(false);
      };

      recognitionRef.current = recognition;

      recognition.start();
    } catch (error) {
      console.error(
        "Could not start speech recognition:",
        error
      );

      setIsRecording(false);
    }
  };

  // ==========================================
  // STOP RECORDING
  // ==========================================

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();

      recognitionRef.current = null;
    }

    setIsRecording(false);
  };

  // ==========================================
  // TOGGLE RECORDING
  // ==========================================

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ==========================================
  // PREPARE RESULT DATA
  // ==========================================

  const prepareResultData = () => {
    return questions.map((item, index) => ({
      question:
        item.question || item,

      category:
        item.category || interviewType,

      answer:
        answers[index] || "",
    }));
  };

  // ==========================================
  // GO TO RESULT PAGE
  // ==========================================

  const goToResult = () => {
    stopRecording();

    const resultData = prepareResultData();

    navigate("/interview-result", {
      state: {
        interviewData: {
          jobRole,
          interviewType,
          difficulty,
          duration,
          questions: resultData,
          totalQuestions,
        },
      },
    });
  };

  // ==========================================
  // NEXT QUESTION
  // ==========================================

  const handleNext = () => {
    stopRecording();

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    } else {
      goToResult();
    }
  };

  // ==========================================
  // PREVIOUS QUESTION
  // ==========================================

  const handlePrevious = () => {
    stopRecording();

    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  // ==========================================
  // CLEAR ANSWER
  // ==========================================

  const clearAnswer = () => {
    stopRecording();

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: "",
    }));

    finalTranscriptRef.current = "";
  };

  // ==========================================
  // END INTERVIEW
  // ==========================================

  const handleEndInterview = () => {
    setShowEndModal(false);

    goToResult();
  };

  // ==========================================
  // PROGRESS
  // ==========================================

  const progress =
    totalQuestions > 0
      ? ((currentQuestion + 1) /
          totalQuestions) *
        100
      : 0;

  // ==========================================
  // LOADING / SAFETY
  // ==========================================

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        <p className="text-sm text-slate-400">
          Loading interview...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* TOP NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#070b14]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* Logo */}

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

          {/* Interview Status */}

          <div className="hidden items-center gap-5 sm:flex">

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              Interview in progress

            </div>

            <div className="h-5 w-px bg-slate-800" />

            <div
              className={`font-mono text-sm font-semibold ${
                timeLeft < 60
                  ? "text-red-400"
                  : "text-slate-300"
              }`}
            >
              {formatTime(timeLeft)}
            </div>

          </div>

          {/* Finish Button */}

          <button
            onClick={() =>
              setShowEndModal(true)
            }
            className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
          >
            Finish Interview →
          </button>

        </div>

      </header>

      {/* MAIN CONTENT */}

      <main className="px-6 py-10 lg:px-10">

        <div className="mx-auto max-w-5xl">

          {/* Header */}

          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-bold tracking-[3px] text-indigo-400">
                AI MOCK INTERVIEW
              </p>

              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                {interviewType}
              </h1>

              <p className="mt-2 text-xs text-slate-500">
                {jobRole} · {difficulty}
              </p>

            </div>

            {/* Question Counter */}

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-center">

              <p className="text-[9px] tracking-widest text-slate-600">
                QUESTION
              </p>

              <p className="mt-1 text-sm font-bold">

                <span className="text-indigo-400">
                  {String(
                    currentQuestion + 1
                  ).padStart(2, "0")}
                </span>

                <span className="text-slate-600">
                  {" "}
                  /{" "}
                  {String(
                    totalQuestions
                  ).padStart(2, "0")}
                </span>

              </p>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="mb-8">

            <div className="mb-2 flex justify-between text-[10px] text-slate-600">

              <span>
                Interview Progress
              </span>

              <span className="text-indigo-400">
                {Math.round(progress)}%
              </span>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {/* QUESTION CARD */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl shadow-black/20 sm:p-8">

            {/* AI INTERVIEWER */}

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                  🤖
                </div>

                <div>

                  <p className="text-xs font-semibold">
                    AI Interviewer
                  </p>

                  <p className="text-[9px] text-slate-600">
                    {question.category ||
                      interviewType}
                  </p>

                </div>

              </div>

              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[9px] font-bold tracking-wider text-indigo-400">
                {interviewType
                  .replace(" Interview", "")
                  .toUpperCase()}
              </span>

            </div>

            {/* QUESTION */}

            <div className="mt-8 rounded-xl border border-slate-800 bg-[#080e1a] p-6 sm:p-8">

              <p className="text-[9px] font-bold tracking-[2px] text-indigo-400">
                QUESTION{" "}
                {String(
                  currentQuestion + 1
                ).padStart(2, "0")}
              </p>

              <h2 className="mt-4 text-xl font-semibold leading-9 text-slate-100 sm:text-2xl">
                {question.question || question}
              </h2>

            </div>

            {/* ANSWER */}

            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between">

                <label className="text-xs font-semibold text-slate-300">
                  Your Answer
                </label>

                <span className="text-[9px] text-slate-600">
                  {currentAnswer.length} characters
                </span>

              </div>

              <textarea
                value={currentAnswer}
                onChange={(event) =>
                  updateAnswer(
                    event.target.value
                  )
                }
                placeholder="Type your answer here or use the microphone to answer verbally..."
                className="min-h-[180px] w-full resize-none rounded-xl border border-slate-700 bg-[#080e1a] p-5 text-sm leading-7 text-slate-200 outline-none placeholder:text-slate-700 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />

            </div>

            {/* VOICE RECOGNITION */}

            <div
              className={`mt-5 rounded-xl border p-5 transition ${
                isRecording
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-slate-800 bg-[#080e1a]"
              }`}
            >

              <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

                <div className="flex items-center gap-4">

                  {/* Microphone */}

                  <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={!speechSupported}
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition ${
                      !speechSupported
                        ? "cursor-not-allowed bg-slate-800 text-slate-600"
                        : isRecording
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                    }`}
                  >

                    {isRecording ? (
                      <span className="text-lg">
                        ■
                      </span>
                    ) : (
                      <span className="text-xl">
                        🎙
                      </span>
                    )}

                    {isRecording && (
                      <span className="absolute inset-0 animate-ping rounded-full border border-red-400 opacity-30" />
                    )}

                  </button>

                  <div>

                    <p className="text-xs font-semibold">

                      {isRecording
                        ? "Listening..."
                        : "Answer with your voice"}

                    </p>

                    <p className="mt-1 text-[9px] text-slate-600">

                      {isRecording
                        ? "Speak clearly. Click the microphone to stop."
                        : speechSupported
                        ? "Click the microphone and start speaking."
                        : "Use Chrome or Edge for voice recognition."}

                    </p>

                  </div>

                </div>

                {/* Recording Indicator */}

                {isRecording && (

                  <div className="flex items-center gap-3">

                    <span className="text-[9px] font-medium text-red-400">
                      RECORDING
                    </span>

                    <div className="flex h-10 items-center gap-1">

                      {[
                        25,
                        50,
                        80,
                        45,
                        90,
                        60,
                        75,
                        35,
                        65,
                        85,
                        45,
                        70,
                      ].map(
                        (height, index) => (

                          <div
                            key={index}
                            className="w-1 animate-pulse rounded-full bg-gradient-to-t from-red-400 to-indigo-400"
                            style={{
                              height: `${height}%`,
                              animationDelay: `${
                                index * 80
                              }ms`,
                            }}
                          />

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* VOICE INFO */}

            {!speechSupported && (

              <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">

                <p className="text-[10px] leading-5 text-yellow-400">
                  ⚠️ Voice recognition is not supported by
                  your current browser. Please open this
                  page in Google Chrome or Microsoft Edge.
                </p>

              </div>

            )}

            {/* CONTROLS */}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

              {/* Previous */}

              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="rounded-lg border border-slate-700 px-5 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              <div className="flex gap-3">

                {/* Clear */}

                <button
                  type="button"
                  onClick={clearAnswer}
                  className="rounded-lg border border-slate-700 px-5 py-3 text-xs font-medium text-slate-500 transition hover:border-slate-600 hover:text-slate-300"
                >
                  Clear Answer
                </button>

                {/* Next */}

                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-xs font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500"
                >
                  {currentQuestion ===
                  totalQuestions - 1
                    ? "Finish Interview ✓"
                    : "Next Question →"}
                </button>

              </div>

            </div>

          </div>

          {/* INTERVIEW TIPS */}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">

              <div className="text-lg">
                💡
              </div>

              <p className="mt-2 text-xs font-semibold">
                Be Clear
              </p>

              <p className="mt-1 text-[9px] leading-5 text-slate-600">
                Explain your answer step by step.
              </p>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">

              <div className="text-lg">
                🎯
              </div>

              <p className="mt-2 text-xs font-semibold">
                Stay Focused
              </p>

              <p className="mt-1 text-[9px] leading-5 text-slate-600">
                Keep your answer relevant to the question.
              </p>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">

              <div className="text-lg">
                🧠
              </div>

              <p className="mt-2 text-xs font-semibold">
                Think First
              </p>

              <p className="mt-1 text-[9px] leading-5 text-slate-600">
                Take a moment before answering.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* END INTERVIEW MODAL */}

      {showEndModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0b111e] p-7 shadow-2xl">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-center text-lg font-bold">
              End Interview?
            </h2>

            <p className="mt-3 text-center text-xs leading-6 text-slate-500">
              Are you sure you want to end this interview?
              Your current questions and answers will be
              submitted for evaluation.
            </p>

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowEndModal(false)
                }
                className="flex-1 rounded-lg border border-slate-700 px-4 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-600 hover:text-white"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={handleEndInterview}
                className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-red-400"
              >
                End Interview
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MockInterview;