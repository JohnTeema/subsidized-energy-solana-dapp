"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
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
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { WalletGuard } from "@/components/WalletGuard";
import { mockStats, mockChartData } from "@/lib/mockData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-white/[0.1] rounded-xl px-3 py-2 text-xs">
        <p className="text-white/50 mb-0.5">{label}</p>
        <p className="text-amber-400 font-semibold">{payload[0].value} kWh</p>
      </div>
    );
  }
  return null;
};

function DashboardContent() {
  const { publicKey } = useWallet();
  const [chartView, setChartView] = useState<"daily" | "weekly">("daily");
  const chartData = chartView === "daily" ? mockChartData.daily : mockChartData.weekly;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-white/30 text-sm mt-0.5">
              {publicKey
                ? `${publicKey.toBase58().slice(0, 8)}...${publicKey.toBase58().slice(-8)}`
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">Live · Devnet</span>
            </div>
            <button className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="SUB Balance"
            value="12,450"
            sub="Subsidized Token"
            icon={<Zap size={14} />}
            trend={{ value: "+8.4% this week", up: true }}
            accent
          />
          <StatCard
            label="SRE Balance"
            value="8,320"
            sub="Renewable Energy"
            icon={<Sun size={14} />}
            trend={{ value: "+12.1% this week", up: true }}
          />
          <StatCard
            label="Total Production"
            value="24,680"
            sub="kWh lifetime"
            icon={<TrendingUp size={14} />}
            trend={{ value: "+2.3% today", up: true }}
          />
          <StatCard
            label="Network Share"
            value="0.38%"
            sub="of total supply"
            icon={<Globe size={14} />}
          />
        </div>

        {/* Chart + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Production chart */}
          <div className="lg:col-span-2 glass border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold">Energy Production</h2>
                <p className="text-white/30 text-xs mt-0.5">Kilowatt-hours generated</p>
              </div>
              <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
                {(["daily", "weekly"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${
                      chartView === v
                        ? "bg-amber-500 text-black"
                        : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
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
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#amberGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#F59E0B", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="glass border border-white/[0.08] rounded-2xl p-6">
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
                  sub: "Trade SRE credits",
                  href: "/marketplace",
                },
                {
                  icon: <ArrowUpRight size={16} />,
                  label: "Transfer SRE",
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
                      ? "bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      action.accent
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/[0.06] text-white/40"
                    } group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${action.accent ? "text-amber-400" : "text-white/80"}`}>
                      {action.label}
                    </p>
                    <p className="text-xs text-white/30">{action.sub}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* No inverter state */}
        <div className="glass border border-white/[0.08] rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={28} className="text-white/20" />
          </div>
          <h3 className="text-white font-semibold mb-2">No inverter connected</h3>
          <p className="text-white/30 text-sm max-w-xs mx-auto mb-6">
            Connect your solar inverter to start verifying energy production and earning SRE tokens.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plug size={14} />
            Connect Inverter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <WalletGuard>
      <DashboardContent />
    </WalletGuard>
  );
}
