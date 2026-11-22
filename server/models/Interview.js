
import mongoose from "mongoose";

/* =========================================================
   QUESTION SCHEMA
========================================================= */

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "",
    },

    // Candidate's submitted answer
    answer: {
      type: String,
      default: "",
    },

    // AI-generated expected answer
    expectedAnswer: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   SKILL SCHEMA
========================================================= */

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   INTERVIEW SCHEMA
========================================================= */

const interviewSchema = new mongoose.Schema(
  {
    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Interview details
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    interviewType: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      default: "Intermediate",
    },

    duration: {
      type: Number,
      default: 20,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    // Questions with candidate and AI answers
    questions: {
      type: [questionSchema],
      default: [],
    },

    // Overall performance
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    performance: {
      type: String,
      default: "",
    },

    // Skill analysis
    skills: {
      type: [skillSchema],
      default: [],
    },

    // Feedback
    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   MODEL EXPORT
========================================================= */

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

export default Interview;
