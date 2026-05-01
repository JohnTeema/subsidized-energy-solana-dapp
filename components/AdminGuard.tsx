"use client";

import { useAdminGuard } from "@/lib/useAdminGuard";
import { useAuth } from "@/lib/auth";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Shield, Lock, Mail } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isSignedIn, accountAddress } = useAdminGuard();
  const { openSignIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/[0.06] border border-teal-500/15 flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-teal-500/40" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Admin access</h1>
          <p className="text-white/40 text-sm mb-8">
            Connect an admin wallet to access this area.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <WalletMultiButton />
            <div className="flex items-center gap-3 w-full max-w-[200px]">
              <div className="flex-1 h-px bg-teal-500/[0.12]" />
              <span className="text-xs text-white/20">or</span>
              <div className="flex-1 h-px bg-teal-500/[0.12]" />
            </div>
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-teal-500/[0.15] text-sm text-white/70 hover:text-white hover:bg-teal-500/[0.08] transition-all w-full max-w-[200px] justify-center"
            >
              <Mail size={14} />
              Email sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/[0.06] border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <Shield size={28} className="text-red-400/60" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/40 text-sm mb-4">
            Your wallet does not have admin privileges.
          </p>
          <p className="text-white/20 text-xs font-mono break-all px-4">
            {accountAddress}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
