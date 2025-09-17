"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream text-foreground">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-md mx-4 rounded-xl bg-cream shadow-xl border border-accent">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-1 text-primary">Login</h2>
            <p className="text-sm mb-5 text-foreground/80">
              Welcome back. Please sign in.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full rounded-md bg-primary text-background px-4 py-2 font-semibold hover:opacity-90 transition"
              >
                Continue with Google
              </button>
            </div>
          </div>

          <div className="px-6 py-3 bg-accent/40 rounded-b-xl flex items-center justify-between">
            <div className="text-xs text-foreground/60">TravelShield</div>
          </div>
        </div>
      </div>
    </div>
  );
}
