
import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================================================
   MULTER CONFIGURATION
========================================================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only PDF and DOCX files are allowed."));
    }
  },
});

/* =========================================================
   TEST ROUTE
========================================================= */

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI route is working",
  });
});

/* =========================================================
   AI CHAT
========================================================= */

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: message,
    });

    res.status(200).json({
      success: true,
      reply: response.text,
    });

  } catch (error) {
    console.error("AI CHAT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI chat failed",
      error: error.message,
    });
  }
});

/* =========================================================
   INTERVIEW ANSWER EVALUATION
========================================================= */

router.post("/evaluate", async (req, res) => {
  try {
    const {
      question,
      answer,
      jobRole,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const prompt = `
You are an experienced professional interview evaluator.

Job Role:
${jobRole || "General"}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate answer according to its relevance,
accuracy, technical knowledge and clarity.

Return ONLY valid JSON.

Use exactly this format:

{
  "score": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "confidence": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}

Rules:
- All scores must be between 0 and 100.
- Give realistic and fair scores.
- Evaluate according to the given job role.
- Feedback should be short and useful.
- Do not use markdown.
- Return only JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    let text = response.text?.trim() || "";

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(text);

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error("EVALUATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Interview evaluation failed",
      error: error.message,
    });
  }
});

/* =========================================================
   GENERATE EXPECTED INTERVIEW ANSWER
========================================================= */

router.post("/expected-answer", async (req, res) => {
  try {
    const {
      question,
      jobRole,
      interviewType,
      difficulty,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Interview question is required",
      });
    }

    const prompt = `
You are an experienced professional interview coach.

Generate a strong, accurate and interview-ready sample answer.

Job Role:
${jobRole || "General"}

Interview Type:
${interviewType || "General"}

Difficulty:
${difficulty || "Intermediate"}

Interview Question:
${question}

IMPORTANT INSTRUCTIONS:

1. Give a clear and professional answer.
2. Keep the answer concise, ideally 50-80 words.
3. Make it relevant to the specified job role.
4. For technical questions, explain the correct technical concepts.
5. For behavioral questions, use a practical example or structured approach.
6. Avoid unnecessary introductions and filler sentences.
7. Do not pretend to know the candidate's personal experience.
8. Do not invent personal achievements for the candidate.
9. Make the answer easy to understand and speak in an interview.
10. Return only the answer text.
11. Do not use markdown headings.
12. Do not return JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const expectedAnswer = response.text?.trim();

    if (!expectedAnswer) {
      return res.status(500).json({
        success: false,
        message: "AI could not generate an expected answer.",
      });
    }

    return res.status(200).json({
      success: true,
      expectedAnswer,
    });

  } catch (error) {
    console.error("EXPECTED ANSWER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Expected answer generation failed",
      error: error.message,
    });
  }
});

/* =========================================================
   RESUME ANALYSIS
========================================================= */

router.post(
  "/analyze-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a PDF or DOCX resume.",
        });
      }

      console.log(
        "Resume received:",
        req.file.originalname
      );

      let resumeText = "";

      /* PDF */

      if (req.file.mimetype === "application/pdf") {
        const parser = new PDFParse({
          data: new Uint8Array(req.file.buffer),
        });

        const result = await parser.getText();

        resumeText = result.text;

        await parser.destroy();
      }

      /* DOCX */

      else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });

        resumeText = result.value;
      }

      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from this resume. Please upload a text-based PDF or DOCX.",
        });
      }

      resumeText = resumeText.trim();

      console.log(
        "Extracted resume characters:",
        resumeText.length
      );

      /* LIMIT LARGE RESUMES */

      if (resumeText.length > 40000) {
        resumeText = resumeText.substring(0, 40000);
      }

      /* GEMINI PROMPT */

      const prompt = `
You are an expert resume analyzer.

Analyze the following resume carefully.

IMPORTANT RULES:

1. Use ONLY information actually present in the resume.
2. Do NOT invent skills.
3. Do NOT invent projects.
4. Do NOT invent experience.
5. Do NOT assume technologies that are not mentioned.
6. If information is missing, return "Not specified".
7. Skills should be extracted from the resume.
8. Skill scores should represent how strongly the resume demonstrates that skill.
9. Resume score must be between 0 and 100.
10. Return ONLY valid JSON.
11. Do NOT use markdown.
12. Do NOT include explanations outside JSON.

Return exactly this structure:

{
  "resumeScore": 0,
  "candidateName": "",
  "primaryRole": "",
  "experience": "",
  "summary": "",
  "skills": [
    {
      "name": "",
      "score": 0
    }
  ],
  "projects": [
    {
      "title": "",
      "technology": "",
      "description": ""
    }
  ],
  "strengths": [],
  "improvements": [],
  "suggestedRoles": []
}

Resume:

${resumeText}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });

      let text = response.text?.trim() || "";

      console.log("Gemini raw response received");

      /* REMOVE MARKDOWN JSON FENCE */

      text = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      /* PARSE JSON */

      let result;

      try {
        result = JSON.parse(text);
      } catch (jsonError) {
        console.error("JSON PARSE ERROR:", jsonError);
        console.error("Gemini response:", text);

        return res.status(500).json({
          success: false,
          message: "AI returned invalid JSON.",
        });
      }

      /* SEND RESULT */

      res.status(200).json({
        success: true,

        file: {
          name: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
        },

        ...result,
      });

    } catch (error) {
      console.error("RESUME ANALYSIS ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Resume analysis failed.",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Resume file must be smaller than 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default router;
