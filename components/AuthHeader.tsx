"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthHeader() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/" className="text-2xl font-bold">
        InsightForge
      </Link>

      <div className="flex items-center gap-4">
        {session?.user?.email ? (
          <>
            <span className="text-sm text-slate-400">
              {session.user.email}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-white text-slate-950 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-white text-slate-950 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}