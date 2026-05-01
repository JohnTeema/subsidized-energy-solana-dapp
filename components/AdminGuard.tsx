"use client";

import { useAdminGuard } from "@/lib/useAdminGuard";
import { Shield, Lock } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isSignedIn } = useAdminGuard();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/[0.06] border border-teal-500/15 flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-teal-500/40" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-white/40 text-sm">
            Connect an admin wallet to access this area.
          </p>
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
            Not authorized
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
