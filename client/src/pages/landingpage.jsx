import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold shadow-lg shadow-indigo-500/20">
              IF
            </div>

            <span className="text-lg font-bold">
              Interview
              <span className="text-indigo-400">Forge</span> AI
            </span>

          </Link>

          {/* NAV LINKS */}
          <div className="hidden items-center gap-7 md:flex">

            <Link
              to="/"
              className="text-sm font-medium text-indigo-400 transition hover:text-white"
            >
              Home
            </Link>

            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </a>

            <Link
              to="/about"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              About
            </Link>

            <a
              href="#technology"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Technology
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How It Works
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


      {/* =====================================================
          HERO SECTION
          BACKGROUND IMAGE SIRF YAHAN HOGI
      ===================================================== */}

      <section className="relative min-h-[calc(100vh-74px)] overflow-hidden">

        {/* CLASS PHOTO */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/class-photo.jpg')",
          }}
        />

        {/* LIGHT DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#070b14]/35" />

        {/* GRADIENT */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,11,20,0.20) 0%, rgba(7,11,20,0.20) 55%, rgba(7,11,20,0.95) 100%)",
          }}
        />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* GLOW */}
        <div className="absolute left-[5%] top-[10%] h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute right-[5%] top-[30%] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-[140px]" />


        {/* HERO CONTENT */}
        <div className="relative z-10 flex min-h-[calc(100vh-74px)] items-center px-6 py-20">

          <div className="mx-auto max-w-6xl text-center">

            {/* BADGE */}
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-indigo-400/30 bg-[#080d1a]/60 px-5 py-2 backdrop-blur-md">

              <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />

              <span className="text-xs font-semibold tracking-wide text-indigo-300">
                AI-POWERED INTERVIEW PREPARATION
              </span>

            </div>


            {/* HEADING */}
            <h1 className="mt-8 text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">

              Practice Smarter.

              <br />

              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Interview Better.
              </span>

            </h1>


            {/* DESCRIPTION */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">

              Prepare for your next interview with InterviewForge AI.
              Practice realistic interviews, improve your communication,
              analyze your performance, and build the confidence you need
              to succeed.

            </p>


            {/* BUTTONS */}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-sm font-semibold shadow-xl shadow-indigo-500/30 transition hover:-translate-y-1 hover:from-indigo-500 hover:to-purple-500"
              >
                Start Practicing →
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-white/20 bg-[#080d1a]/60 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:-translate-y-1 hover:border-indigo-400/50 hover:text-white"
              >
                Explore Features
              </a>

            </div>


            {/* STATS */}
            <div className="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-7 rounded-2xl border border-white/10 bg-[#070b14]/55 px-6 py-5 backdrop-blur-xl">

              <div>
                <p className="text-xl font-bold">
                  AI
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Powered Practice
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-xl font-bold">
                  24/7
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Practice Anytime
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-xl font-bold">
                  100%
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Personalized
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          REST OF PAGE - NORMAL DARK BACKGROUND
      ===================================================== */}

      <main className="bg-[#070b14]">


        {/* =====================================================
            FEATURES
        ===================================================== */}

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
                Powerful tools designed to make your interview preparation
                smarter, easier, and more effective.
              </p>

            </div>


            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


              {/* FEATURE 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-500/50">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
                  🤖
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  AI Mock Interviews
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Practice realistic interview sessions with AI and prepare
                  yourself for real-world interview situations.
                </p>

              </div>


              {/* FEATURE 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-500/50">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
                  📄
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Resume-Based Questions
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Practice questions based on your resume, projects,
                  experience, and technical skills.
                </p>

              </div>


              {/* FEATURE 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-500/50">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                  🎯
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Personalized Practice
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Prepare according to your role, experience, technical
                  knowledge, and career goals.
                </p>

              </div>


              {/* FEATURE 4 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-green-500/50">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
                  📊
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Performance Analysis
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Analyze your performance and discover areas where you can
                  improve.
                </p>

              </div>


              {/* FEATURE 5 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-yellow-500/50">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-2xl">
                  📈
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Progress Tracking
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Track your progress and continuously improve your interview
                  performance.
                </p>

              </div>


              {/* FEATURE 6 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-pink-500/50">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-2xl">
                  💬
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Instant Feedback
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Get useful feedback to improve your communication and
                  interview answers.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            ABOUT / WHY SECTION
        ===================================================== */}

        <section className="px-6 py-20">

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">


            {/* MISSION */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl shadow-black/20">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                OUR MISSION
              </p>

              <h2 className="mt-4 text-3xl font-bold">
                Making Interview Preparation Better
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Traditional interview preparation often lacks realistic
                practice and personalized feedback. InterviewForge AI aims
                to solve this problem by providing an intelligent platform
                where students and job seekers can practice interviews and
                understand their performance.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Our goal is to help users improve technical knowledge,
                communication skills, confidence, and overall interview
                performance.
              </p>

            </div>


            {/* WHAT WE OFFER */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                WHAT WE OFFER
              </p>

              <div className="mt-6 space-y-6">


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-lg">
                    🤖
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      AI-Powered Interviews
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Practice realistic interview questions with intelligent
                      AI interaction.
                    </p>
                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-lg">
                    📊
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Performance Analysis
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Track your performance and identify areas where you
                      can improve.
                    </p>
                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-lg">
                    🎯
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Personalized Practice
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Practice technical, behavioral, and resume-based
                      interview questions.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            TEAM SECTION
        ===================================================== */}

        <section
          id="team"
          className="scroll-mt-24 px-6 py-20"
        >

          <div className="mx-auto max-w-6xl">


            {/* TEAM HEADING */}
            <div className="mb-12 text-center">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                OUR TEAM
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Meet the Team
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                The people behind InterviewForge AI
              </p>

            </div>


            {/* TEAM MEMBERS */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


              {/* KAVINDRA */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-900/50 p-6 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-indigo-500 hover:shadow-indigo-500/10">

                {/* TEAM LEADER BADGE */}
                <div className="absolute right-3 top-3 rounded-full bg-indigo-500/10 px-3 py-1 text-[9px] font-semibold text-indigo-400">
                  TEAM LEADER
                </div>


                {/* IMAGE */}
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-800">

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


              {/* NEERAJ */}
              <div className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-indigo-500/50">

                <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">

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


              {/* SAURAV */}
              <div className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-purple-500/50">

                <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">

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


              {/* NAYAN */}
              <div className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-cyan-500/50">

                <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">

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


        {/* =====================================================
            TECHNOLOGY
        ===================================================== */}

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
                Built With Modern Technologies
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                InterviewForge AI is built using the MERN stack.
              </p>

            </div>


            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


              {/* MONGODB */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center shadow-xl transition hover:-translate-y-1 hover:border-green-500/50">

                <div className="text-4xl">
                  🍃
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  MongoDB
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Database
                </p>

              </div>


              {/* EXPRESS */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center shadow-xl transition hover:-translate-y-1 hover:border-slate-500">

                <div className="text-4xl">
                  ⚙️
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  Express.js
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Backend Framework
                </p>

              </div>


              {/* REACT */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center shadow-xl transition hover:-translate-y-1 hover:border-cyan-500/50">

                <div className="text-4xl">
                  ⚛️
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  React.js
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Frontend Library
                </p>

              </div>


              {/* NODE */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7 text-center shadow-xl transition hover:-translate-y-1 hover:border-green-500/50">

                <div className="text-4xl">
                  🟢
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  Node.js
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Runtime Environment
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          id="how-it-works"
          className="scroll-mt-24 px-6 py-20"
        >

          <div className="mx-auto max-w-6xl">

            <div className="mb-12 text-center">

              <p className="text-xs font-bold tracking-[3px] text-indigo-400">
                HOW IT WORKS
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Prepare in Three Simple Steps
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Start practicing today and improve your interview skills.
              </p>

            </div>


            <div className="grid gap-6 md:grid-cols-3">


              {/* STEP 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center shadow-xl">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-lg font-bold text-indigo-400">
                  01
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Choose Your Interview
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Select the interview type and begin your personalized
                  preparation.
                </p>

              </div>


              {/* STEP 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center shadow-xl">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-lg font-bold text-purple-400">
                  02
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Practice With AI
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Answer realistic questions and experience an interactive
                  interview environment.
                </p>

              </div>


              {/* STEP 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center shadow-xl">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-lg font-bold text-cyan-400">
                  03
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Analyze & Improve
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Review your performance and use feedback to improve future
                  interviews.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="px-6 py-20">

          <div className="mx-auto max-w-4xl rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-10 text-center">

            <h2 className="text-3xl font-bold">
              Ready to Improve Your Interview Skills?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Start practicing with InterviewForge AI and prepare yourself
              for your next opportunity.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500"
            >
              Get Started →
            </Link>

          </div>

        </section>


      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-800 bg-[#070b14] px-6 py-8 text-center">

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
          Built by the InterviewForge AI Team
        </p>

      </footer>

    </div>
  );
};

export default LandingPage;
