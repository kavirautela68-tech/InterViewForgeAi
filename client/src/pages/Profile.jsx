import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // ================= GET CURRENT USER =================
  const savedUser = localStorage.getItem("user");

  const currentUser = savedUser
    ? JSON.parse(savedUser)
    : null;

  // ================= STATES =================
  const [name, setName] = useState(
    currentUser?.name || ""
  );

  const [email, setEmail] = useState(
    currentUser?.email || ""
  );

  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState("");

  // ================= USER DETAILS =================
  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GU";

  // ================= SAVE PROFILE =================
  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required");
      return;
    }

    // Old user data
    const updatedUser = {
      ...currentUser,
      name: name,
      email: email,
    };

    // Update localStorage
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setMessage("Profile updated successfully!");
    setIsEditing(false);

    // Message after 3 seconds hide
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ================= CANCEL EDIT =================
  const handleCancel = () => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");

    setIsEditing(false);
    setMessage("");
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute bottom-[5%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

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
      <nav className="relative z-10 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-xl">

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
              AI
            </span>

          </Link>


          {/* Back */}
          <Link
            to="/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </nav>


      {/* ================= MAIN ================= */}
      <main className="relative z-10 px-6 py-10">

        <div className="mx-auto max-w-4xl">


          {/* ================= HEADER ================= */}
          <div className="mb-8">

            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your personal information and account.
            </p>

          </div>


          {/* ================= SUCCESS / ERROR MESSAGE ================= */}
          {message && (

            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">

              {message}

            </div>

          )}


          {/* ================= PROFILE CARD ================= */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur-xl">


            {/* ================= PROFILE HEADER ================= */}
            <div className="border-b border-slate-800 p-6 sm:p-8">

              <div className="flex flex-col items-center gap-6 sm:flex-row">


                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold shadow-lg shadow-indigo-500/20">

                  {initials}

                </div>


                {/* User Details */}
                <div className="text-center sm:text-left">

                  <h2 className="text-2xl font-bold">

                    {name || "Guest User"}

                  </h2>


                  <p className="mt-2 text-sm text-slate-500">

                    {email || "guest@example.com"}

                  </p>


                  <div className="mt-3 inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">

                    Member

                  </div>

                </div>

              </div>

            </div>


            {/* ================= FORM ================= */}
            <form
              onSubmit={handleSave}
              className="p-6 sm:p-8"
            >


              {/* ================= TITLE ================= */}
              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Update your personal details.
                  </p>

                </div>


                {!isEditing && (

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/20"
                  >
                    Edit Profile
                  </button>

                )}

              </div>


              {/* ================= NAME ================= */}
              <div className="mb-5">

                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-slate-300"
                >
                  Full Name
                </label>


                <input
                  id="name"
                  type="text"
                  value={name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                    isEditing
                      ? "border-slate-700 bg-[#080e1a] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      : "cursor-not-allowed border-slate-800 bg-slate-800/50 text-slate-400"
                  }`}
                />

              </div>


              {/* ================= EMAIL ================= */}
              <div className="mb-6">

                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-slate-300"
                >
                  Email Address
                </label>


                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                    isEditing
                      ? "border-slate-700 bg-[#080e1a] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      : "cursor-not-allowed border-slate-800 bg-slate-800/50 text-slate-400"
                  }`}
                />

              </div>


              {/* ================= ACCOUNT INFO ================= */}
              <div className="mb-6 rounded-xl border border-slate-800 bg-[#080e1a] p-5">

                <h3 className="text-sm font-semibold">
                  Account Information
                </h3>


                <div className="mt-4 grid gap-4 sm:grid-cols-2">


                  <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Account ID
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-300">
                      {currentUser?.id || currentUser?._id || "Not available"}
                    </p>

                  </div>


                  <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Account Type
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      {currentUser?.role || "User"}
                    </p>

                  </div>

                </div>

              </div>


              {/* ================= SAVE BUTTONS ================= */}
              {isEditing && (

                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="submit"
                    className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-purple-500"
                  >
                    Save Changes
                  </button>


                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-400 transition hover:border-slate-500 hover:text-white"
                  >
                    Cancel
                  </button>

                </div>

              )}

            </form>

          </div>


          {/* ================= SECURITY SECTION ================= */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-8">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>

                <h3 className="text-lg font-semibold">
                  Account Security
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your account security and login.
                </p>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Logout
              </button>

            </div>

          </div>


          {/* ================= BOTTOM ================= */}
          <p className="mt-6 text-center text-[10px] text-slate-600">

            InterviewForge AI · Your AI-powered interview preparation platform.

          </p>

        </div>

      </main>

    </div>
  );
};

export default Profile;