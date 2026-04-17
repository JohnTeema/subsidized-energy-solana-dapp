"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Zap,
  Sun,
  Copy,
  CheckCircle2,
  ExternalLink,
  Send,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";
import { mockTransactions, mockStats } from "@/lib/mockData";
import { PROGRAM_IDS } from "@/lib/constants";

const txIcons: Record<string, React.ReactNode> = {
  mint: <Zap size={14} className="text-teal-400" />,
  transfer: <Send size={14} className="text-blue-400" />,
  purchase: <ShoppingCart size={14} className="text-purple-400" />,
};

const txColors: Record<string, string> = {
  mint: "bg-teal-500/10 border-teal-500/20",
  transfer: "bg-blue-500/10 border-blue-500/20",
  purchase: "bg-purple-500/10 border-purple-500/20",
};

function WalletContent() {
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const address = publicKey?.toBase58() ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setAmount("");
      setRecipient("");
      setTimeout(() => setSent(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Wallet</h1>
          <p className="text-white/30 text-sm mt-0.5">Manage your $SUB and $SRE tokens</p>
        </div>

        {/* Wallet address */}
        <div className="glass rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-teal-400/60 text-xs font-medium uppercase tracking-wider mb-1">Wallet Address</p>
            <p className="text-white font-mono text-sm truncate">{address || "Not connected"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/60 text-xs hover:bg-teal-500/[0.12] hover:text-white transition-all"
            >
              {copied ? <><CheckCircle2 size={12} className="text-teal-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
            <a
              href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/60 text-xs hover:bg-teal-500/[0.12] hover:text-white transition-all"
            >
              <ExternalLink size={12} />
              Explorer
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Token balances */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* SUB */}
            <div className="glass border border-teal-500/20 bg-teal-500/[0.02] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center">
                    <Zap size={18} className="text-teal-400" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">$SUB Token</p>
                    <p className="text-white/30 text-xs">Subsidized · Governance</p>
                  </div>
                </div>
                <a
                  href={`https://explorer.solana.com/address/${PROGRAM_IDS.SUB_TOKEN}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/20 hover:text-teal-400 transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-4xl font-bold text-teal-400 mb-1">
                {mockStats.subBalance.toLocaleString()}
              </p>
              <p className="text-white/30 text-sm">≈ $2,118.63 USD</p>
              <div className="mt-4 pt-4 border-t border-teal-500/[0.08] flex items-center gap-2 text-xs text-white/25">
                <span className="font-mono">{PROGRAM_IDS.SUB_TOKEN.slice(0, 8)}...{PROGRAM_IDS.SUB_TOKEN.slice(-6)}</span>
              </div>
            </div>

            {/* SRE */}
            <div className="glass border border-emerald-500/20 bg-emerald-500/[0.02] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <Sun size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">$SRE Token</p>
                    <p className="text-white/30 text-xs">Subsidized Renewable Energy</p>
                  </div>
                </div>
                <a
                  href={`https://explorer.solana.com/address/${PROGRAM_IDS.SRE_TOKEN}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/20 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-4xl font-bold text-emerald-400 mb-1">
                {mockStats.sreBalance.toLocaleString()}
              </p>
              <p className="text-white/30 text-sm">≈ 8,320.5 kWh verified</p>
              <div className="mt-4 pt-4 border-t border-emerald-500/[0.08] flex items-center gap-2 text-xs text-white/25">
                <span className="font-mono">{PROGRAM_IDS.SRE_TOKEN.slice(0, 8)}...{PROGRAM_IDS.SRE_TOKEN.slice(-6)}</span>
              </div>
            </div>
          </div>

          {/* Transfer panel */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Transfer $SRE</h2>
            <p className="text-white/30 text-xs mb-5">Send renewable energy credits</p>

            {sent ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} className="text-teal-400" />
                </div>
                <p className="text-white font-medium">Transfer sent!</p>
                <p className="text-white/30 text-xs mt-1">Transaction submitted to Devnet</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    placeholder="Solana wallet address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Amount ($SRE)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0.01"
                      max={mockStats.sreBalance}
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all pr-16"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setAmount(String(mockStats.sreBalance))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-teal-400 text-xs font-medium hover:bg-teal-500/10 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-white/25 text-xs mt-1">Balance: {mockStats.sreBalance.toLocaleString()} $SRE</p>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {sending ? (
                    <><span className="animate-pulse">Sending...</span></>
                  ) : (
                    <><Send size={14} />Send $SRE</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Transaction history */}
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Transaction History</h2>
            <div className="flex items-center gap-1.5 text-white/30 text-xs">
              <Clock size={12} />
              Mock data · Devnet
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-teal-500/[0.02] border border-teal-500/[0.07] hover:bg-teal-500/[0.04] transition-all"
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${txColors[tx.type]}`}>
                  {txIcons[tx.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium capitalize">{tx.type}</p>
                  <p className="text-white/30 text-xs font-mono truncate">{tx.hash}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${tx.type === "transfer" ? "text-red-400" : "text-teal-400"}`}>
                    {tx.type === "transfer" ? "-" : "+"}{tx.amount} {tx.token}
                  </p>
                  <p className="text-white/25 text-xs">{tx.time}</p>
                </div>
                <a
                  href={`https://explorer.solana.com/tx/${tx.hash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/15 hover:text-teal-400 transition-colors flex-shrink-0"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <WalletGuard>
      <WalletContent />
    </WalletGuard>
  );
}
