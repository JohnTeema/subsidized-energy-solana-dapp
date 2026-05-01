// cache bust
"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";

const EMAIL_ACCOUNTS_KEY = "subenergy_email_wallet_accounts";
const EMAIL_SESSION_KEY = "subenergy_email_wallet_session";
const AUTH_TOKEN_KEY = "subenergy_auth_token";

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
  token: string | null;
  openSignIn: () => void;
  closeSignIn: () => void;
  registerWithEmail: (email: string, password: string) => Promise<{ needsVerification: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
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

function getEmailSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_SESSION_KEY);
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const [emailSession, setEmailSession] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const emailAccount = useMemo(() => {
    if (!emailSession) return null;
    return getEmailAccounts().find((account) => account.email === emailSession) ?? null;
  }, [emailSession]);

  const walletAddress = publicKey?.toBase58() ?? "";
  const accountAddress = walletAddress || emailAccount?.walletAddress || "";
  const authMethod = walletAddress ? "wallet" : emailSession ? "email" : null;

  const accountLabel =
    authMethod === "email" && emailSession
      ? emailSession
      : accountAddress
      ? shortAddress(accountAddress)
      : "";

  // Restore session from localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedEmail = getEmailSession();
    if (storedToken) setToken(storedToken);
    if (storedEmail) setEmailSession(storedEmail);
  }, []);

  const registerWithEmail = useCallback(async (rawEmail: string, password: string) => {
    const email = normalizeEmail(rawEmail);
    if (!email) throw new Error("Email is required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    // Check if email already registered locally (for duplicate check)
    const existing = getEmailAccounts();
    if (existing.find((item) => item.email === email)) {
      throw new Error("Email already registered. Please sign in instead.");
    }

    // Generate a new Solana keypair for this user (in memory only for now)
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toBase58();
    const secretKeyUint8 = keypair.secretKey; // Uint8Array

    // Register with backend first (no local writes yet)
    console.log("[register] Preparing payload:", { email, password, walletAddress: walletAddress.slice(0, 20) + "...", walletLen: walletAddress.length });
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, walletAddress }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Registration failed");
    }

    const data = await res.json();

    // Backend succeeded — now store private key and account mapping locally
    localStorage.setItem(`wallet_privkey_${walletAddress}`, JSON.stringify(Array.from(secretKeyUint8)));
    const account = { email, walletAddress, createdAt: Date.now() };
    const next = [account, ...existing];
    localStorage.setItem(EMAIL_ACCOUNTS_KEY, JSON.stringify(next));

    // Save JWT and session
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(EMAIL_SESSION_KEY, email);
    setToken(data.token);
    setEmailSession(email);
    setIsSignInOpen(false);

    // Registration succeeded — user must verify email before full access
    return { needsVerification: true };
  }, []);

  const signInWithEmail = useCallback(async (rawEmail: string, password: string) => {
    const email = normalizeEmail(rawEmail);
    if (!email) throw new Error("Email is required");

    // Check local accounts first to know which wallet belongs to this email
    const accounts = getEmailAccounts();
    const account = accounts.find((a) => a.email === email);
    if (!account) {
      throw new Error("No account found for this email. Please register first.");
    }

    // Verify with backend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Invalid credentials");
    }

    const data = await res.json();

    // Ensure returned walletAddress matches locally stored wallet for this email
    if (data.walletAddress !== account.walletAddress) {
      console.error("[auth] Wallet address mismatch between local and server");
      throw new Error("Wallet mismatch. You may need to recover your wallet.");
    }

    // Save JWT and session
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(EMAIL_SESSION_KEY, email);
    setToken(data.token);
    setEmailSession(email);
    setIsSignInOpen(false);
    // Successful login — no return value needed
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(EMAIL_SESSION_KEY);
    setToken(null);
    setEmailSession(null);
    if (connected) {
      await disconnect();
    }
    setIsSignInOpen(false);
  }, [connected, disconnect]);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${baseUrl}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Verification failed");
    }
    // consume body to free memory, but don't return anything
    await res.json();
  }, []);

  const resendVerificationCode = useCallback(async (email: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${baseUrl}/api/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to resend code");
    }
    // Consume body, no return
    await res.json();
  }, []);

  const exportWallet = useCallback(() => {
    const walletAddress = accountAddress;
    if (!walletAddress) {
      throw new Error("No wallet connected");
    }
    const privKeyStr = localStorage.getItem(`wallet_privkey_${walletAddress}`);
    if (!privKeyStr) {
      throw new Error("Private key not found in localStorage. You may need to sign out and sign back in.");
    }
    const privateKey = JSON.parse(privKeyStr);
    const backup = {
      address: walletAddress,
      privateKey,
      exportedAt: new Date().toISOString(),
      network: 'solana-mainnet-beta', // TODO: detect network
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-backup-${new Date().toISOString().slice(0,10)}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [accountAddress]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accountAddress,
      accountLabel,
      authMethod,
      connecting,
      email: emailSession,
      isSignedIn: !!accountAddress,
      isSignInOpen,
      token,
      openSignIn: () => setIsSignInOpen(true),
      closeSignIn: () => setIsSignInOpen(false),
      signInWithEmail,
      registerWithEmail,
      verifyEmail,
      resendVerificationCode,
      signOut,
    }),
    [
      accountAddress,
      accountLabel,
      emailSession,
      connecting,
      token,
      isSignInOpen,
      connected,
      disconnect,
      signInWithEmail,
      registerWithEmail,
      verifyEmail,
      resendVerificationCode,
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
