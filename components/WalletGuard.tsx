"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function WalletGuard({ children }: { children: ReactNode }) {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  if (connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#10B981] flex items-center justify-center animate-pulse-glow overflow-hidden">
            <Image src="/logo-mark.svg" alt="SubEnergy" width={24} height={24} />
          </div>
          <Loader2 size={20} className="text-teal-400 animate-spin" />
          <p className="text-white/40 text-sm">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1A] relative overflow-hidden">
        {/* Background teal ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/[0.06] rounded-full blur-3xl" />
        </div>

        <div className="relative text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#10B981] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30 overflow-hidden">
            <Image src="/logo-mark.svg" alt="SubEnergy" width={32} height={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
          <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
            Connect your Solana wallet to access the SubEnergy dashboard
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setVisible(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
            >
              Connect Wallet
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/70 font-medium hover:bg-teal-500/[0.12] transition-all"
            >
              Back to Home
            </button>
          </div>
          <p className="text-white/25 text-xs mt-6">
            Mobile? Use{" "}
            <a
              href="https://phantom.app/ul/browse/https://subenergy.app"
              className="text-teal-400/60 hover:text-teal-400 underline transition-colors"
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
