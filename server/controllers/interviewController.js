
import Interview from "../models/Interview.js";

// =====================================================
// SAVE INTERVIEW
// POST /api/interviews
// =====================================================

export const saveInterview = async (req, res) => {
  try {
    const {
      jobRole,
      interviewType,
      difficulty,
      duration,
      questions,
      overallScore,
      performance,
      skills,
      strengths,
      improvements,
      feedback,
      questionEvaluations,
    } = req.body;

    // =========================================
    // VALIDATION
    // =========================================

    if (
      !jobRole ||
      !interviewType ||
      !difficulty ||
      overallScore === undefined
    ) {
      return res.status(400).json({
        message: "Required interview data is missing",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Interview questions are required",
      });
    }

    // =========================================
    // FORMAT QUESTIONS
    // =========================================

    const formattedQuestions = questions.map((item) => ({
      question: item.question || "",
      category: item.category || "",
      answer: item.answer || "",
      expectedAnswer: item.expectedAnswer || "",
    }));

    // =========================================
    // FORMAT QUESTION EVALUATIONS
    // =========================================

    const formattedEvaluations = Array.isArray(questionEvaluations)
      ? questionEvaluations.map((item) => ({
          question: item.question || "",
          category: item.category || "",
          score: Math.min(
            100,
            Math.max(0, Number(item.score) || 0)
          ),
          feedback: item.feedback || "",
        }))
      : [];

    // =========================================
    // CREATE INTERVIEW
    // =========================================

    const interview = await Interview.create({
      user: req.user.userId,

      jobRole,
      interviewType,
      difficulty,

      duration: Number(duration) || 20,

      totalQuestions: formattedQuestions.length,

      questions: formattedQuestions,

      overallScore: Number(overallScore),

      performance: performance || "",

      skills: Array.isArray(skills) ? skills : [],

      strengths: Array.isArray(strengths) ? strengths : [],

      improvements: Array.isArray(improvements)
        ? improvements
        : [],

      feedback: feedback || "",

      questionEvaluations: formattedEvaluations,
    });

    return res.status(201).json({
      message: "Interview saved successfully",
      interview,
    });

  } catch (error) {
    console.error("SAVE INTERVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to save interview",
      error: error.message,
    });
  }
};


// =====================================================
// GET LOGGED-IN USER INTERVIEWS
// GET /api/interviews
// =====================================================

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    console.error("GET INTERVIEWS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch interviews",
    });
  }
};


// =====================================================
// GET SINGLE INTERVIEW
// GET /api/interviews/:id
// =====================================================

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      interview,
    });

  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch interview",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE INTERVIEW
// DELETE /api/interviews/:id
// =====================================================

export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      message: "Interview deleted successfully",
    });

  } catch (error) {
    console.error("DELETE INTERVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete interview",
      error: error.message,
    });
  }
};
