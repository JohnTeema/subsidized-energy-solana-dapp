"use client";

import { FormEvent, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Mail, ShieldCheck, Wallet, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function SignInDialog() {
  const { closeSignIn, isSignInOpen, signInWithEmail } = useAuth();
  const { setVisible } = useWalletModal();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isSignInOpen) return null;

  const handleEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    signInWithEmail(email);
    setEmail("");
  };

  const handleWallet = () => {
    closeSignIn();
    setVisible(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close sign in"
        onClick={closeSignIn}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md glass rounded-2xl border border-teal-500/[0.16] p-6 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Sign in to SubEnergy</h2>
            <p className="text-white/40 text-sm mt-1">
              Use email or connect an existing Solana wallet.
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

        <form onSubmit={handleEmail} className="flex flex-col gap-3">
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
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
          >
            Continue with Email
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

        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-teal-500/[0.05] border border-teal-500/[0.12] p-3">
          <ShieldCheck size={15} className="text-teal-400 mt-0.5 flex-shrink-0" />
          <p className="text-teal-400/75 text-xs leading-relaxed">
            Email sign-in creates a Solana wallet address for your account. You
            can connect your own wallet anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
