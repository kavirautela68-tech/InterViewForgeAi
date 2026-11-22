import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  saveInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
} from "../controllers/interviewController.js";


const router = express.Router();


// ================= SAVE =================

router.post(
  "/",
  authMiddleware,
  saveInterview
);


// ================= GET ALL =================

router.get(
  "/",
  authMiddleware,
  getMyInterviews
);


// ================= GET ONE =================

router.get(
  "/:id",
  authMiddleware,
  getInterviewById
);


// ================= DELETE =================

router.delete(
  "/:id",
  authMiddleware,
  deleteInterview
);


export default router;