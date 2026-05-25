"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, CheckCircle, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const API_BASE = "https://subsidized-energy-backend.onrender.com";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send reset code");
        return;
      }
      setStep("reset");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }
      setStep("done");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0F1A]">
      <div className="w-full max-w-md glass rounded-2xl border border-teal-500/[0.16] p-8 shadow-2xl shadow-black/60">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        {/* Step 1 — Enter email */}
        {step === "email" && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                <Mail size={20} />
              </div>
              <h1 className="text-xl font-bold text-white">Forgot your password?</h1>
              <p className="text-white/40 text-sm mt-1">
                Enter your email and we&apos;ll send you a reset code.
              </p>
            </div>

            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" aria-hidden />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="min-h-11 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Send Reset Code
              </button>
            </form>
          </>
        )}

        {/* Step 2 — Enter code + new password */}
        {step === "reset" && (
          <>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                <KeyRound size={20} />
              </div>
              <h1 className="text-xl font-bold text-white">Reset your password</h1>
              <p className="text-white/40 text-sm mt-1">
                We sent a code to{" "}
                <span className="text-teal-400">{email}</span>.
                Enter it below along with your new password.
              </p>
            </div>

            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">
                  Reset Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white text-center text-xl tracking-[0.5em] placeholder-white/20 focus:outline-none focus:border-teal-500/40 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                  required
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="min-h-11 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Reset Password
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); setCode(""); }}
                className="text-sm text-white/30 hover:text-white/60 transition-colors text-center"
              >
                Use a different email
              </button>
            </form>
          </>
        )}

        {/* Step 3 — Success */}
        {step === "done" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-6">
              <CheckCircle size={28} />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Password reset!</h1>
            <p className="text-white/40 text-sm mb-8">
              Your password has been updated. Sign in with your new password.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
