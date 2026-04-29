"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";

const EMAIL_ACCOUNTS_KEY = "subenergy_email_wallet_accounts";
const EMAIL_SESSION_KEY = "subenergy_email_wallet_session";

interface EmailWalletAccount {
  email: string;
  walletAddress: string;
  createdAt: number;
}

interface AuthContextValue {
  accountAddress: string;
  accountLabel: string;
  authMethod: "email" | "wallet" | null;
  connecting: boolean;
  email: string | null;
  isSignedIn: boolean;
  isSignInOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  signInWithEmail: (email: string) => EmailWalletAccount;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getEmailAccounts(): EmailWalletAccount[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(EMAIL_ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function getEmailSession() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_SESSION_KEY);
}

function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const [emailSession, setEmailSession] = useState<string | null>(() =>
    getEmailSession()
  );
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const emailAccount = useMemo(() => {
    if (!emailSession) return null;
    return (
      getEmailAccounts().find((account) => account.email === emailSession) ??
      null
    );
  }, [emailSession]);

  const walletAddress = publicKey?.toBase58() ?? "";
  const accountAddress = walletAddress || emailAccount?.walletAddress || "";
  const authMethod = walletAddress ? "wallet" : emailAccount ? "email" : null;
  const accountLabel =
    authMethod === "email" && emailSession
      ? emailSession
      : accountAddress
      ? shortAddress(accountAddress)
      : "";

  const signInWithEmail = useCallback((rawEmail: string) => {
    const email = normalizeEmail(rawEmail);
    if (!email) throw new Error("Email is required");

    const existing = getEmailAccounts();
    const account =
      existing.find((item) => item.email === email) ?? {
        email,
        walletAddress: Keypair.generate().publicKey.toBase58(),
        createdAt: Date.now(),
      };

    const next = [
      account,
      ...existing.filter((item) => item.email !== email),
    ];

    localStorage.setItem(EMAIL_ACCOUNTS_KEY, JSON.stringify(next));
    localStorage.setItem(EMAIL_SESSION_KEY, email);
    setEmailSession(email);
    setIsSignInOpen(false);
    return account;
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(EMAIL_SESSION_KEY);
    setEmailSession(null);
    if (connected) {
      await disconnect();
    }
    setIsSignInOpen(false);
  }, [connected, disconnect]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accountAddress,
      accountLabel,
      authMethod,
      connecting,
      email: emailSession,
      isSignedIn: !!accountAddress,
      isSignInOpen,
      openSignIn: () => setIsSignInOpen(true),
      closeSignIn: () => setIsSignInOpen(false),
      signInWithEmail,
      signOut,
    }),
    [
      accountAddress,
      accountLabel,
      authMethod,
      connecting,
      emailSession,
      isSignInOpen,
      signInWithEmail,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
