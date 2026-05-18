"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold">Login</h1>

        <input
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-white text-slate-950 rounded-lg p-3 font-semibold">
          Login
        </button>

        {message && (
          <p className="text-sm text-red-400 text-center">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}