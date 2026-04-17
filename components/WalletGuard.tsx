"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Zap, Loader2 } from "lucide-react";

export function WalletGuard({ children }: { children: ReactNode }) {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  if (connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-pulse-glow">
            <Zap size={24} className="text-black" fill="black" />
          </div>
          <Loader2 size={20} className="text-amber-400 animate-spin" />
          <p className="text-white/40 text-sm">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/5 via-transparent to-transparent" />

        <div className="relative text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
            <Zap size={32} className="text-black" fill="black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
          <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
            Connect your Solana wallet to access the SubEnergy dashboard
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setVisible(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
            >
              Connect Wallet
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 font-medium hover:bg-white/[0.1] transition-all"
            >
              Back to Home
            </button>
          </div>
          <p className="text-white/25 text-xs mt-6">
            Mobile? Use{" "}
            <a
              href="https://phantom.app/ul/browse/https://subenergy.app"
              className="text-amber-400/60 hover:text-amber-400 underline transition-colors"
            >
              Phantom deep link
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
