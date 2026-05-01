"use client";

import { FormEvent, useState, useEffect } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Mail, ShieldCheck, Wallet, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function SignInDialog() {
  const { closeSignIn, isSignInOpen, registerWithEmail, signInWithEmail } = useAuth();
  const { setVisible } = useWalletModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  // Verification state
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  if (!isSignInOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // If in verification mode
    if (verifyingEmail) {
      try {
        await verifyEmail(verifyingEmail, verificationCode);
        setVerifyingEmail(null);
        setVerificationCode("");
        // Auto-switch to login after verify
        setIsRegister(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Verification failed";
        setError(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        const result = await registerWithEmail(email, password);
        // If registration succeeds but email verification required
        if (result && result.needsVerification) {
          setVerifyingEmail(email);
          setError("");
          // Start resend cooldown
          startResendCooldown();
        }
      } else {
        await signInWithEmail(email, password);
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleWallet = () => {
    closeSignIn();
    setVisible(true);

  };
  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const startResendCooldown = () => {
    setResendCooldown(30);
    setCanResend(false);
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close sign in"
        onClick={closeSignIn}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />


      {/* Email verification panel */}
      {verifyingEmail && (
        <div className="mb-6 p-4 rounded-lg bg-teal-900/20 border border-teal-500/30">
          <h3 className="text-white font-semibold mb-2">Verify your email</h3>
          <p className="text-white/60 text-sm mb-3">
            We sent a 6-digit code to <span className="text-teal-400">{verifyingEmail}</span>
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            className="w-full px-4 py-2 bg-black/30 border border-teal-500/30 rounded-lg text-white text-center text-lg tracking-widest placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 mb-3"
          />
          <button
            type="submit"
            disabled={verificationCode.length !== 6 || loading}
            className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:bg-teal-900/30 disabled:text-white/30 text-white font-medium transition-colors"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
          <div className="mt-3 text-center">
            <button
              type="button"
              disabled={!canResend}
              onClick={async () => {
                try {
                  await resendVerificationCode(verifyingEmail);
                  setError("");
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : "Failed to resend code";
                  setError(msg);
                }
              }}
              className="text-sm text-teal-400 hover:text-teal-300 disabled:text-teal-700 disabled:cursor-not-allowed"
            >
              {canResend ? "Resend code" : `Resend in ${resendCooldown}s`}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setVerifyingEmail(null);
              setVerificationCode("");
              setError("");
            }}
            className="mt-2 w-full text-center text-sm text-white/40 hover:text-white"
          >
            Use different email
          </button>
        </div>
      )}

      <div className="relative w-full max-w-md glass rounded-2xl border border-teal-500/[0.16] p-6 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isRegister ? "Create Account" : "Sign in to SubEnergy"}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {isRegister
                ? "Create an email account — a Solana wallet will be generated for you."
                : "Use email or connect an existing Solana wallet."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close sign in"
            onClick={closeSignIn}
            className="w-10 h-10 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                aria-hidden
              />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-white/25 text-xs">or</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <button
          type="button"
          onClick={handleWallet}
          className="w-full min-h-11 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/80 text-sm font-semibold hover:bg-teal-500/[0.12] hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Wallet size={16} />
          Continue with Wallet
        </button>

        <div className="mt-5 text-center">
          <p className="text-white/30 text-xs">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            {" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-teal-400 hover:text-teal-300 underline transition-colors"
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-teal-500/[0.05] border border-teal-500/[0.12] p-3">
          <ShieldCheck size={15} className="text-teal-400 mt-0.5 flex-shrink-0" />
          <p className="text-teal-400/75 text-xs leading-relaxed">
            Email sign-in creates a Solana wallet address for your account. You can connect your own wallet anytime.
            Your private key is stored locally. Please back it up.
          </p>
        </div>
      </div>
    </div>
  );
}
