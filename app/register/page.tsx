"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Registration failed");
      return;
    }

    setMessage("Account created successfully");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f172a,#020617_45%,#000000)] text-white flex items-center justify-center p-8">
      <a
        href="/"
        className="absolute top-8 left-8 text-4xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent"
      >
        Auralith
      </a>
      
      <form
        onSubmit={handleRegister}
        className="bg-slate-950/80 border border-cyan-500/20 rounded-3xl p-8 w-full max-w-md space-y-5 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Create your Auralith account
          </h1>

          <p className="text-cyan-300/70 mt-2">
            Start analyzing datasets with AI-powered insights.
          </p>
        </div>

        <input
          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-xl p-3 font-semibold hover:opacity-90 transition shadow-[0_0_25px_rgba(34,211,238,0.2)]"
        >
          Create Account
        </button>

        {message && (
          <p className="text-sm text-center text-cyan-300">{message}</p>
        )}

        <p className="text-sm text-cyan-300/70 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-300 hover:text-cyan-100 transition"
          >
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}