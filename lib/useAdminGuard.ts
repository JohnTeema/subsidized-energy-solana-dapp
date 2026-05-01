"use client";

import { useAuth } from "@/lib/auth";

const RAW = process.env.NEXT_PUBLIC_ADMIN_WALLETS ?? "6N8UZJ8GAGTd7RzoctFbHYzFYzkL2fWK13t811qQqahz";

export const ADMIN_WALLETS: string[] = RAW.split(",")
  .map((w) => w.trim())
  .filter(Boolean);

export function useAdminGuard(): { isAdmin: boolean; isSignedIn: boolean; accountAddress: string } {
  const { accountAddress, isSignedIn } = useAuth();
  const isAdmin = ADMIN_WALLETS.includes(accountAddress);
  return { isAdmin, isSignedIn, accountAddress };
}
