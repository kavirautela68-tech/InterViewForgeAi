import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authroutes.js";
import aiRoutes from "./routes/airoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";


const app = express();


// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());


// ================= DATABASE =================

connectDB();


// ================= ROUTES =================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/interviews",
  interviewRoutes
);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {

  res.json({
    message:
      "InterviewForge AI Backend Running",
  });

});


// ================= SERVER =================

const PORT =
  process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});