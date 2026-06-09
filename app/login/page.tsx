"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const DEMO_EMAIL = "guest@auralith.app";
const DEMO_PASSWORD = "auralith-guest-2026";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Invalid credentials");
      return;
    }

    window.location.href = "/";
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setMessage("");

    const result = await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Demo account is temporarily unavailable. Try registering instead.");
      setDemoLoading(false);
      return;
    }

    window.location.href = "/";
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
        onSubmit={handleLogin}
        className="bg-slate-950/80 border border-cyan-500/20 rounded-3xl p-8 w-full max-w-md space-y-5 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Welcome back
          </h1>

          <p className="text-cyan-300/70 mt-2">
            Sign in to continue analyzing your datasets.
          </p>
        </div>

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
          Login
        </button>

        {message && (
          <p className="text-sm text-red-400 text-center">{message}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-cyan-300/40 uppercase tracking-wider">
          <div className="flex-1 h-px bg-cyan-500/20" />
          <span>or</span>
          <div className="flex-1 h-px bg-cyan-500/20" />
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={demoLoading}
          className="w-full bg-slate-950 border border-cyan-500/40 text-cyan-200 rounded-xl p-3 font-semibold hover:border-cyan-400 hover:text-cyan-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {demoLoading ? "Loading demo…" : "Try the demo (no signup)"}
        </button>

        <p className="text-xs text-cyan-300/50 text-center -mt-1">
          Explore Auralith with a pre-loaded dataset.
        </p>

        <p className="text-sm text-cyan-300/70 text-center">
          New to Auralith?{" "}
          <a
            href="/register"
            className="text-cyan-300 hover:text-cyan-100 transition"
          >
            Create an account
          </a>
        </p>
      </form>
    </main>
  );
}