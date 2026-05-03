"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  Sun,
  TrendingUp,
  Globe,
  Plug,
  Clock,
  ArrowUpRight,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Leaf,
  TreePine,
  Car,
  Home,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { WalletGuard } from "@/components/WalletGuard";
import { Footer } from "@/components/Footer";
import { fetchUserDashboard, type UserDashboard } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function useCountUp(target: number, started: boolean, decimals = 0, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(eased * target);
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  if (decimals > 0) return value.toFixed(decimals);
  return Math.floor(value).toLocaleString();
}

function EnvironmentalImpact({ co2Avoided, treesEquivalent, drivingOffset, homesPowered }: {
  co2Avoided: number;
  treesEquivalent: number;
  drivingOffset: number;
  homesPowered: number;
}) {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: <Leaf size={18} />,
      label: "CO₂ Avoided",
      value: `${useCountUp(co2Avoided / 1000, started, 1)}t`,
      sub: "Based on Nigeria grid emission factor",
    },
    {
      icon: <TreePine size={18} />,
      label: "Trees Equivalent",
      value: `${useCountUp(Math.floor(treesEquivalent), started)} trees`,
      sub: "Growing for one year",
    },
    {
      icon: <Car size={18} />,
      label: "Driving Offset",
      value: `${useCountUp(drivingOffset / 1_000_000, started, 1)}M km`,
      sub: "Average passenger vehicle",
    },
    {
      icon: <Home size={18} />,
      label: "Homes Powered",
      value: `${useCountUp(Math.floor(homesPowered), started)} homes`,
      sub: "Average Nigerian household",
    },
  ];

  return (
    <div ref={sectionRef} className="mb-8">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Your Environmental Impact</h2>
        <p className="text-white/30 text-sm mt-0.5">
          Real-world impact of your verified solar energy production
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="glass rounded-2xl p-5 border border-teal-500/[0.15] hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
            style={{
              background:
                "linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(16,185,129,0.02) 100%)",
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:bg-teal-500/20 transition-colors">
              {card.icon}
            </div>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
              {card.label}
            </p>
            <p className="text-xl font-bold text-teal-400 tracking-tight leading-tight">
              {card.value}
            </p>
            <p className="text-xs text-white/25 mt-1.5 leading-snug">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardContent() {
  const { accountAddress } = useAuth();
  const [dashboard, setDashboard] = useState<UserDashboard>({
    srePoints: 0,
    totalKwhProduced: 0,
    subCertificates: 0,
    latestReading: null,
    dailyReadings: [],
    environmentalImpact: { co2Avoided: 0, treesEquivalent: 0, drivingOffset: 0, homesPowered: 0 },
  });
  const [chartData, setChartData] = useState<{ time: string; kwh: number }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasData, setHasData] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchUserDashboard();
      setDashboard(data);
      setChartData(data.dailyReadings);
      setHasData(data.subCertificates > 0 || data.totalKwhProduced > 0);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-white/30 text-sm mt-0.5">
              {accountAddress
                ? `${accountAddress.slice(0, 8)}...${accountAddress.slice(-8)}`
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-400 text-xs font-medium">Live · Devnet</span>
            </div>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.12] text-white/40 hover:text-white hover:bg-teal-500/[0.10] transition-all disabled:opacity-50"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="SUB Balance"
            value={Math.floor(dashboard.subCertificates).toLocaleString()}
            sub="Subsidized Token"
            icon={<Zap size={14} />}
          />
          <StatCard
            label="SRE Points"
            value={Math.floor(dashboard.srePoints).toLocaleString()}
            sub="Renewable Energy"
            icon={<Sun size={14} />}
            accent
          />
          <StatCard
            label="Total Production"
            value={Math.floor(dashboard.totalKwhProduced).toLocaleString()}
            sub="kWh lifetime"
            icon={<TrendingUp size={14} />}
          />
          <StatCard
            label="Latest Reading"
            value={dashboard.latestReading ? `${dashboard.latestReading.kWh.toFixed(2)} kWh` : "–"}
            sub={dashboard.latestReading ? new Date(dashboard.latestReading.timestamp).toLocaleDateString() : "No data"}
            icon={<Clock size={14} />}
          />
        </div>

        {/* Environmental Impact */}
        <EnvironmentalImpact
          co2Avoided={dashboard.environmentalImpact.co2Avoided}
          treesEquivalent={dashboard.environmentalImpact.treesEquivalent}
          drivingOffset={dashboard.environmentalImpact.drivingOffset}
          homesPowered={dashboard.environmentalImpact.homesPowered}
        />

        {/* Chart + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Production chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold">Energy Production</h2>
                <p className="text-white/30 text-xs mt-0.5">Daily kWh generated (cumulative snapshots)</p>
              </div>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9488" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="kwh"
                    stroke="#0D9488"
                    strokeWidth={2}
                    fill="url(#tealGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#10B981", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-white/25 text-sm">No production data yet. Connect your inverter to start.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: <Plug size={16} />,
                  label: "Connect Inverter",
                  sub: "Add solar device",
                  href: "/connect",
                  accent: true,
                },
                {
                  icon: <BarChart3 size={16} />,
                  label: "Marketplace",
                  sub: "Trade SRE Points",
                  href: "/marketplace",
                },
                {
                  icon: <ArrowUpRight size={16} />,
                  label: "Transfer SRE Points",
                  sub: "Send to wallet",
                  href: "/wallet",
                },
                {
                  icon: <Clock size={16} />,
                  label: "History",
                  sub: "View transactions",
                  href: "/wallet",
                },
              ].map((action) => (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                    action.accent
                      ? "bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20"
                      : "bg-white/[0.03] border border-teal-500/[0.08] hover:bg-teal-500/[0.06]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      action.accent
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-teal-500/[0.08] text-teal-500/50"
                    } group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${action.accent ? "text-teal-400" : "text-white/80"}`}>
                      {action.label}
                    </p>
                    <p className="text-xs text-white/30">{action.sub}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-white/20 group-hover:text-teal-400/60 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* No inverter state */}
        {!hasData && (
          <div className="glass rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/[0.06] border border-teal-500/15 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-teal-500/40" />
            </div>
            <h3 className="text-white font-semibold mb-2">No production data yet</h3>
            <p className="text-white/30 text-sm max-w-xs mx-auto mb-6">
              Connect your solar inverter to start verifying energy production and earning SRE Points.
            </p>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
            >
              <Plug size={14} />
              Connect Inverter
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-teal-500/20 rounded-xl px-3 py-2 text-xs">
        <p className="text-white/50 mb-0.5">{label}</p>
        <p className="text-teal-400 font-semibold">{payload[0].value} kWh</p>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  return (
    <WalletGuard>
      <DashboardContent />
    </WalletGuard>
  );
}
