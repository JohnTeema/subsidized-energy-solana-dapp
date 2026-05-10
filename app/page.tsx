"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Zap,
  Shield,
  Sun,
  ArrowRight,
  Globe,
  Cpu,
  Coins,
  ChevronRight,
  Leaf,
  TreePine,
  Car,
  Home,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchStats, type PlatformStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PROGRAM_IDS } from "@/lib/constants";

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
    title: "Earn SRE Points",
    desc: "Every verified kWh earns SRE Points.",
  },
];

const tokens = [
  {
    symbol: "SUB",
    name: "Daily Renewable Energy Certificate",
    desc: "A unique daily certificate proving your verified solar energy production. Each SUB carries the actual kWh data from your inverter. One certificate per producer per day.",
    color: "from-[#0D9488] to-[#10B981]",
    bg: "bg-teal-500/[0.05]",
    border: "border-teal-500/20",
    address: "CRHuF...Epe",
  },
  {
    symbol: "SRE",
    name: "Utility & Governance Token",
    desc: "The protocol's utility and governance token. Used for marketplace transactions, staking, voting, and platform access.",
    color: "from-emerald-400 to-[#10B981]",
    bg: "bg-emerald-500/[0.05]",
    border: "border-emerald-500/20",
    address: "HMcX5...Mea",
  },
];

function useCountUp(target: number, started: boolean, duration = 2000): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return value;
}

function FloatingMetrics({ stats }: { stats: PlatformStats }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const kwh = useCountUp(stats.totalKwh, started);
  const producers = useCountUp(stats.activeProducers, started);
  const carbon = useCountUp(stats.carbonOffset, started);

  const kwhDisplay = stats.totalKwh >= 1_000_000
    ? `${(kwh / 1_000_000).toFixed(2)}M`
    : stats.totalKwh >= 1_000
    ? `${(kwh / 1_000).toFixed(1)}K`
    : kwh.toFixed(1);

  const metrics = [
    {
      label: "Total kWh Verified",
      display: kwhDisplay,
      icon: <Zap size={14} />,
    },
    {
      label: "Active Producers",
      display: Math.floor(producers).toLocaleString(),
      icon: <Sun size={14} />,
    },
    {
      label: "Carbon Offset (t)",
      display: carbon.toFixed(1),
      icon: <Globe size={14} />,
    },
  ];

  return (
    <div ref={ref} className="max-w-3xl mx-auto grid grid-cols-3 gap-3 sm:gap-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="glass rounded-2xl p-4 text-center hover:border-teal-500/25 transition-all"
        >
          <div className="flex items-center justify-center gap-1.5 text-teal-500/60 text-xs mb-2">
            {m.icon}
            <span className="hidden sm:inline">{m.label}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{m.display}</p>
          <p className="sm:hidden text-[10px] text-white/30 mt-0.5">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

function RealImpact({ stats }: { stats: PlatformStats }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalKwh = stats.totalKwh;
  const co2kg = totalKwh * 0.43;

  const co2 = useCountUp(co2kg / 1000, started);           // → "794.3t"
  const trees = useCountUp(Math.floor(co2kg / 21), started); // → "37,825"
  const driving = useCountUp(co2kg / 0.21 / 1_000_000, started); // → "3.8M km"
  const homes = useCountUp(Math.floor(totalKwh / 900), started);  // → "2,052"

  const items = [
    {
      icon: <Leaf size={16} />,
      display: `${co2.toFixed(1)}t`,
      label: "CO₂ Avoided",
      sub: "Nigeria grid factor",
    },
    {
      icon: <TreePine size={16} />,
      display: Math.floor(trees).toLocaleString(),
      label: "Trees Equivalent",
      sub: "Planted for a year",
    },
    {
      icon: <Car size={16} />,
      display: `${driving.toFixed(1)}M km`,
      label: "Driving Offset",
      sub: "Avg. passenger vehicle",
    },
    {
      icon: <Home size={16} />,
      display: Math.floor(homes).toLocaleString(),
      label: "Homes Powered",
      sub: "Avg. Nigerian household",
    },
  ];

  return (
    <section className="py-24 px-4 border-t border-teal-500/[0.06]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Impact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Real Impact
          </h2>
          <p className="text-white/30 text-sm mt-3 max-w-sm mx-auto">
            Network-wide environmental benefit from verified solar production
          </p>
        </div>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="glass rounded-2xl p-5 text-center hover:border-teal-500/25 hover:-translate-y-1 transition-all duration-300 group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(16,185,129,0.02) 100%)",
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-3 group-hover:bg-teal-500/20 transition-colors">
                {item.icon}
              </div>
              <p className="text-2xl font-bold text-teal-400 tracking-tight">{item.display}</p>
              <p className="text-xs font-medium text-white/60 mt-1">{item.label}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { isSignedIn, openSignIn } = useAuth();
  const router = useRouter();
  const [platformStats, setPlatformStats] = useState<PlatformStats>({ totalKwh: 0, activeProducers: 0, carbonOffset: 0 });

  useEffect(() => {
    fetchStats().then(setPlatformStats);
  }, []);

  const handleLaunch = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      openSignIn();
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 -mt-8">

        <div className="relative max-w-4xl mx-auto text-center">
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
              className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-teal-500/25"
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
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/[0.04] border border-teal-500/[0.12] text-white/60 font-medium text-sm hover:bg-teal-500/[0.06] hover:text-white hover:border-teal-500/20 transition-all"
            >
              View on Explorer
              <Globe size={14} />
            </a>
          </div>
        </div>

        {/* Floating metrics */}
        <div className="absolute bottom-12 left-0 right-0 px-4">
          <FloatingMetrics stats={platformStats} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">
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
                className="glass rounded-2xl p-6 hover:border-teal-500/25 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-white/20 text-sm font-mono">0{i + 1}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
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

      {/* Real Impact */}
      <RealImpact stats={platformStats} />

      {/* Tokens */}
      <section className="py-24 px-4 border-t border-teal-500/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">
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
                className={`glass ${t.bg} border ${t.border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-lg bg-gradient-to-r ${t.color} text-white text-xs font-bold`}
                  >
                    {t.symbol}
                  </div>
                  <Cpu size={16} className="text-white/20" />
                </div>
                <h3 className="text-white font-semibold mb-1">{t.name}</h3>
                <p className="text-white/40 text-sm mb-4 flex-1">{t.desc}</p>

                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-xs font-mono">{t.address}</span>
                  <a
                    href={`https://explorer.solana.com/address/${t.symbol === "SUB" ? PROGRAM_IDS.SUB_TOKEN : PROGRAM_IDS.SRE_TOKEN}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/20 hover:text-teal-400 transition-colors"
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
          <div className="glass border border-teal-500/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.07] to-emerald-500/[0.03] pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#10B981] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30 animate-float overflow-hidden">
                <Image src="/logo-mark.svg" alt="SubEnergy" width={28} height={28} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Start earning today</h2>
              <p className="text-white/40 mb-8">Connect your solar inverter and turn sunshine into tokens.</p>
              <button
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-xl shadow-teal-500/30"
              >
                Launch App
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
