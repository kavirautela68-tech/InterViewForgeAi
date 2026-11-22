import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[5%] top-[8%] h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[150px]" />

        <div className="absolute bottom-[10%] right-[5%] h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[150px]" />

        <div className="absolute left-[45%] top-[45%] h-[300px] w-[300px] rounded-full bg-cyan-600/5 blur-[140px]" />

      </div>

      {/* ================= GRID ================= */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#070b14]/85 backdrop-blur-xl">

        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold shadow-lg shadow-indigo-500/20">
              IF
            </div>

            <span className="text-lg font-bold">
              Interview
              <span className="text-indigo-400">Forge</span>
              <span className="ml-1 text-white">AI</span>
            </span>

          </Link>

          {/* NAVIGATION */}
          <div className="hidden items-center gap-7 md:flex">

            <Link
              to="/"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Home
            </Link>

            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-indigo-400 transition hover:text-white"
            >
              About
            </a>

            <a
              href="#team"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Our Team
            </a>

            <a
              href="#technology"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Technology
            </a>

            <Link
              to="/login"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500"
            >
              Get Started
            </Link>

          </div>
        </div>

      </nav>

      {/* ================= MAIN ================= */}
      <main className="relative z-10">

        {/* ================= HERO ================= */}
        <section className="px-6 pb-20 pt-24 lg:pb-28 lg:pt-32">

          <div className="mx-auto max-w-5xl text-center">

            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2">

              <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400" />

              <span className="text-xs font-semibold tracking-wide text-indigo-300">
                AI-POWERED INTERVIEW PREPARATION
              </span>

            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">

              Prepare Smarter.

              <br />

              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Interview Better.
              </span>

            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              InterviewForge AI is an intelligent interview preparation
              platform designed to help students and job seekers practice
              interviews, improve their communication, and build confidence
              before facing real-world interviews.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1 hover:from-indigo-500 hover:to-purple-500"
              >
                Start Practicing →
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-slate-700 bg-slate-900/50 px-7 py-3 text-sm font-semibold text-slate-300 transition hover:-translate-y-1 hover:border-indigo-500/50 hover:text-white"
              >
                Explore Features
              </a>

            </div>

          </div>

        </section>

        {/* ================= ABOUT ================= */}
        <section
          id="about"
          className="scroll-mt-24 px-6 py-16"
        >

          <div className="mx-auto max-w-6xl">

            <div className="grid gap-8 lg:grid-cols-2">

              {/* LEFT */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl shadow-black/20 backdrop-blur-xl">

                <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                  ABOUT INTERVIEWFORGE AI
                </p>

                <h2 className="mt-4 text-3xl font-bold">
                  Your Personal AI Interview Coach
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  Preparing for an interview can be stressful, especially when
                  you don't have someone to practice with. InterviewForge AI
                  provides an intelligent environment where users can simulate
                  interview experiences and practice answering questions.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Instead of simply reading interview questions, users can
                  actively practice, analyze their performance, identify
                  weaknesses, and continuously improve their interview skills.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Our goal is simple: make interview preparation more
                  accessible, practical, personalized, and effective.
                </p>

              </div>

              {/* RIGHT */}
              <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-8">

                <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                  OUR MISSION
                </p>

                <h2 className="mt-4 text-3xl font-bold">
                  Build Confidence Before the Interview
                </h2>

                <div className="mt-7 space-y-5">

                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl">
                      🤖
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Intelligent Practice
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Practice with AI-powered interview experiences.
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                      📊
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Meaningful Feedback
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Understand where you are strong and where you need
                        improvement.
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
                      🎯
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Career Focused
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Prepare for technical, HR, behavioral, and
                        resume-based interviews.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="scroll-mt-24 px-6 py-20"
        >

          <div className="mx-auto max-w-6xl">

            <div className="mb-12 text-center">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                FEATURES
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Everything You Need to Prepare
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                InterviewForge AI combines intelligent practice and useful
                insights to help you become a better interview candidate.
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {/* AI MOCK INTERVIEWS */}
              <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
                  🤖
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  AI Mock Interviews
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Experience realistic interview practice powered by AI and
                  prepare yourself before the actual interview.
                </p>

              </div>

              {/* RESUME */}
              <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
                  📄
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Resume-Based Questions
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Practice questions related to your resume, projects,
                  technical skills, and experience.
                </p>

              </div>

              {/* PERSONALIZED */}
              <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                  🎯
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Personalized Practice
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Prepare according to your role, experience, technical
                  knowledge, and career goals.
                </p>

              </div>

              {/* PERFORMANCE */}
              <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-2 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                  📊
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Performance Analysis
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Analyze your interview performance and discover areas that
                  need improvement.
                </p>

              </div>

              {/* PROGRESS */}
              <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-2 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-2xl">
                  📈
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Progress Tracking
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Keep practicing and track your improvement as you become
                  more confident.
                </p>

              </div>

              {/* FEEDBACK */}
              <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition duration-300 hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-2xl">
                  💬
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Instant Feedback
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Get actionable feedback to improve your communication,
                  confidence, and interview answers.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="px-6 py-20">

          <div className="mx-auto max-w-6xl">

            <div className="mb-12 text-center">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                HOW IT WORKS
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Prepare in Three Simple Steps
              </h2>

            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* STEP 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-xl font-bold text-indigo-400">
                  01
                </div>

                <h3 className="mt-5 font-bold">
                  Choose Your Interview
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Select the interview type and prepare according to your
                  career requirements.
                </p>

              </div>

              {/* STEP 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-xl font-bold text-purple-400">
                  02
                </div>

                <h3 className="mt-5 font-bold">
                  Practice With AI
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Answer realistic questions and experience an interactive
                  interview environment.
                </p>

              </div>

              {/* STEP 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-xl font-bold text-cyan-400">
                  03
                </div>

                <h3 className="mt-5 font-bold">
                  Analyze & Improve
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Review your performance and use feedback to improve your
                  future interviews.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= TEAM ================= */}
        <section
          id="team"
          className="scroll-mt-24 px-6 py-20"
        >

          <div className="mx-auto max-w-6xl">

            <div className="mb-12 text-center">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                OUR TEAM
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Meet the Team
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                The team behind InterviewForge AI
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {/* ================= KAVINDRA ================= */}
              <div className="relative rounded-2xl border border-indigo-500/30 bg-slate-900/50 p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10">

                <div className="absolute right-3 top-3 rounded-full bg-indigo-500/10 px-3 py-1 text-[9px] font-semibold text-indigo-400">
                  LEADER
                </div>

                <div className="mx-auto h-36 w-36 overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-800">

                  <img
                    src="/kavindra.jpg"
                    alt="Kavindra Singh Rautela"
                    className="h-full w-full object-cover"
                  />

                </div>

                <h3 className="mt-5 text-sm font-bold">
                  Kavindra Singh Rautela
                </h3>

                <p className="mt-2 text-xs font-medium text-indigo-400">
                  Team Leader
                </p>

                <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

              </div>

              {/* ================= NEERAJ ================= */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">

                <div className="mx-auto h-36 w-36 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">

                  <img
                    src="/neeraj.jpg"
                    alt="Neeraj Aswal"
                    className="h-full w-full object-cover"
                  />

                </div>

                <h3 className="mt-5 text-sm font-bold">
                  Neeraj Aswal
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Team Member
                </p>

                <div className="mx-auto mt-4 h-px w-12 bg-slate-700" />

              </div>

              {/* ================= SAURAV ================= */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">

                <div className="mx-auto h-36 w-36 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">

                  <img
                    src="/saurav.jpg"
                    alt="Saurav Bhatt"
                    className="h-full w-full object-cover"
                  />

                </div>

                <h3 className="mt-5 text-sm font-bold">
                  Saurav Bhatt
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Team Member
                </p>

                <div className="mx-auto mt-4 h-px w-12 bg-slate-700" />

              </div>

              {/* ================= NAYAN ================= */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">

                <div className="mx-auto h-36 w-36 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">

                  <img
                    src="/nayan.jpg"
                    alt="Nayan Daushani"
                    className="h-full w-full object-cover"
                  />

                </div>

                <h3 className="mt-5 text-sm font-bold">
                  Nayan Daushani
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Team Member
                </p>

                <div className="mx-auto mt-4 h-px w-12 bg-slate-700" />

              </div>

            </div>

          </div>

        </section>

        {/* ================= TECHNOLOGY ================= */}
        <section
          id="technology"
          className="scroll-mt-24 px-6 py-20"
        >

          <div className="mx-auto max-w-6xl">

            <div className="mb-12 text-center">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                TECHNOLOGY
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Built With Modern Technology
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                InterviewForge AI uses modern web technologies to provide a
                smooth, scalable, and interactive interview preparation
                experience.
              </p>

            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {/* MONGODB */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">

                <div className="text-5xl">
                  🍃
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  MongoDB
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Database
                </p>

              </div>

              {/* EXPRESS */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-slate-500/50 hover:shadow-xl hover:shadow-slate-500/10">

                <div className="text-5xl">
                  ⚙️
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Express.js
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Backend Framework
                </p>

              </div>

              {/* REACT */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">

                <div className="text-5xl">
                  ⚛️
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  React.js
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Frontend Library
                </p>

              </div>

              {/* NODE */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">

                <div className="text-5xl">
                  🟢
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Node.js
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Runtime Environment
                </p>

              </div>

            </div>

            {/* MERN STACK */}
            <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/5 p-7 text-center">

              <h3 className="text-xl font-bold">
                MERN Stack
              </h3>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                MongoDB, Express.js, React.js, and Node.js work together to
                power the core InterviewForge AI application.
              </p>

            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 py-24">

          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/5 p-10 text-center sm:p-14">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl">
              🚀
            </div>

            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
              Ready for Your Next Interview?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Stop worrying about interview preparation. Start practicing,
              improve your skills, and walk into your next interview with
              confidence.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-1 hover:from-indigo-500 hover:to-purple-500"
            >
              Get Started With InterviewForge AI →
            </Link>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-slate-800 px-6 py-10">

        <div className="mx-auto max-w-6xl text-center">

          <div className="flex items-center justify-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold">
              IF
            </div>

            <span className="font-bold">
              Interview
              <span className="text-indigo-400">Forge</span> AI
            </span>

          </div>

          <p className="mt-4 text-xs text-slate-600">
            © 2026 InterviewForge AI. All rights reserved.
          </p>

          <p className="mt-2 text-[10px] text-slate-700">
            Built with ❤️ by the InterviewForge AI Team
          </p>

        </div>

      </footer>

    </div>
  );
};

export default AboutPage;
