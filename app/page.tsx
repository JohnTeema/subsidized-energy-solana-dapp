"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import {
  Zap,
  Shield,
  TrendingUp,
  Sun,
  ArrowRight,
  Globe,
  Cpu,
  Coins,
  ChevronRight,
} from "lucide-react";
import { mockStats } from "@/lib/mockData";
import { Navbar } from "@/components/Navbar";

const steps = [
  {
    icon: <Sun size={20} />,
    title: "Connect Inverter",
    desc: "Link your solar inverter — SolarEdge, Growatt, Huawei, or Deye.",
  },
  {
    icon: <Shield size={20} />,
    title: "Verify Production",
    desc: "Energy output is verified on-chain via Solana smart contracts.",
  },
  {
    icon: <Coins size={20} />,
    title: "Earn SRE Tokens",
    desc: "Every verified kWh earns Subsidized Renewable Energy tokens.",
  },
];

const tokens = [
  {
    symbol: "SUB",
    name: "Subsidized",
    desc: "Governance & utility token for the SubEnergy protocol",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    address: "CRHuF...Epe",
  },
  {
    symbol: "SRE",
    name: "Renewable Energy",
    desc: "Redeemable proof of verified solar energy production",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    address: "HMcX5...Mea",
  },
];

export default function LandingPage() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const handleLaunch = () => {
    if (connected) {
      router.push("/dashboard");
    } else {
      setVisible(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-4">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-600/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/[0.04] rounded-full blur-3xl" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Live on Solana Devnet
          </div>

          {/* Hero text */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-6">
            Solar Energy.
            <br />
            <span className="gradient-text">Verified. Rewarded.</span>
          </h1>
          <p className="text-lg text-white/40 max-w-lg mx-auto mb-10 leading-relaxed">
            Turn every kilowatt-hour into verifiable on-chain proof.
            <br className="hidden sm:block" />
            Powered by Solana.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunch}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-amber-500/25"
            >
              Launch App
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
            <a
              href={`https://explorer.solana.com/address/E93p3yX6mxswv1yBn6gcZvsPCqckyupUVQKuk6YLNyYR?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/60 font-medium text-sm hover:bg-white/[0.08] hover:text-white transition-all"
            >
              View on Explorer
              <Globe size={14} />
            </a>
          </div>
        </div>

        {/* Floating metrics */}
        <div className="absolute bottom-12 left-0 right-0 px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3 sm:gap-6">
            {[
              {
                label: "Total kWh Verified",
                value: "1.84M",
                icon: <Zap size={14} />,
              },
              {
                label: "Active Producers",
                value: "3,241",
                icon: <Sun size={14} />,
              },
              {
                label: "Carbon Offset (t)",
                value: "924.6",
                icon: <Globe size={14} />,
              },
            ].map((m) => (
              <div
                key={m.label}
                className="glass border border-white/[0.08] rounded-2xl p-4 text-center hover:border-amber-500/20 transition-all"
              >
                <div className="flex items-center justify-center gap-1.5 text-amber-400/60 text-xs mb-2">
                  {m.icon}
                  <span className="hidden sm:inline">{m.label}</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {m.value}
                </p>
                <p className="sm:hidden text-[10px] text-white/30 mt-0.5">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Protocol
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="glass border border-white/[0.08] rounded-2xl p-6 hover:border-amber-500/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-white/20 text-sm font-mono">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <ChevronRight
                    size={16}
                    className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokens */}
      <section className="py-24 px-4 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Tokens
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Two-Token Economy
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tokens.map((t) => (
              <div
                key={t.symbol}
                className={`glass ${t.bg} border ${t.border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-lg bg-gradient-to-r ${t.color} text-black text-xs font-bold`}
                  >
                    {t.symbol}
                  </div>
                  <Cpu size={16} className="text-white/20" />
                </div>
                <h3 className="text-white font-semibold mb-1">{t.name}</h3>
                <p className="text-white/40 text-sm mb-4">{t.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-xs font-mono">
                    {t.address}
                  </span>
                  <a
                    href={`https://explorer.solana.com/address/${t.symbol === "SUB" ? "CRHuFAkCseXnvYy6HLUqky9GrPj5Livg64qodmPFFEpe" : "HMcX5TQ7fFTr6JzLnMQySTUch7qw4saQHL5BBXxioMea"}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/20 hover:text-amber-400 transition-colors"
                  >
                    <Globe size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass border border-amber-500/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30 animate-float">
                <Zap size={28} className="text-black" fill="black" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Start earning today
              </h2>
              <p className="text-white/40 mb-8">
                Connect your solar inverter and turn sunshine into tokens.
              </p>
              <button
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-xl shadow-amber-500/30"
              >
                Launch App
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Zap size={14} className="text-black" fill="black" />
            </div>
            <span className="text-white/60 text-sm font-medium">
              Sub<span className="text-amber-400">Energy</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-white/30 text-xs">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
            <Link href="/marketplace" className="hover:text-white/60 transition-colors">Marketplace</Link>
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Solana</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all text-xs font-mono"
            >
              GH
            </a>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9945FF]" />
              <span className="text-white/30 text-xs">Solana Devnet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
