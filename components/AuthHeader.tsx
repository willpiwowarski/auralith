"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between mb-10 border border-cyan-500/20 bg-slate-950/70 backdrop-blur rounded-2xl px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      <Link href="/" className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">InsightForge</span>
        <span className="text-xs text-cyan-400/70">
          Cloud-native AI analytics
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <Link href="/" className="hover:text-white">
          Dashboard
        </Link>
        <span className="text-slate-600">Datasets</span>
        <span className="text-slate-600">AI Insights</span>
      </nav>

      <div className="flex items-center gap-3">
        {session?.user?.email ? (
          <>
            <span className="hidden sm:inline text-sm text-slate-400">
              {session.user.email}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-white text-slate-950 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}