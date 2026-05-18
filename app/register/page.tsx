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
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    console.log(data);

    setMessage(data.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <form
        onSubmit={handleRegister}
        className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold">Create Account</h1>

        <input
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </button>
        {message && (
            <p className="text-sm text-slate-300 text-center">
                {message}
            </p>
        )}
      </form>
    </main>
  );
}