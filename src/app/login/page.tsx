"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Hook up real auth here
    alert(`Logging in as ${username}`);
    // Redirect to dashboard after successful login
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream text-foreground">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <div className="relative z-10 w-full max-w-md mx-4 rounded-xl bg-cream shadow-xl border border-accent">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-1 text-primary">Login</h2>
            <p className="text-sm mb-5 text-foreground/80">
              Welcome back. Please sign in.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-accent/70 bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-accent/70 bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-md bg-primary text-background px-4 py-2 font-semibold hover:opacity-90 transition"
              >
                Login
              </button>
            </form>
          </div>

          <div className="px-6 py-3 bg-accent/40 rounded-b-xl flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <div className="text-xs text-foreground/60">TravelShield</div>
          </div>
        </div>
      </div>
    </div>
  );
}
