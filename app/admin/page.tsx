"use client";

import { AdminGuard } from "@/components/AdminGuard";
import {
  OVERVIEW_STATS,
  DAILY_REGISTRATIONS,
  DAILY_ENERGY,
  DAILY_VOLUME,
} from "@/lib/adminMockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Cpu,
  Zap,
  Leaf,
  ShoppingCart,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-0.5 ${
        accent
          ? "bg-gradient-to-br from-teal-500/[0.1] to-emerald-500/[0.04] border-teal-500/25"
          : "bg-[#111827]/60 border-teal-500/[0.1]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-white/35">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-teal-500/20 text-teal-400" : "bg-white/[0.04] text-white/30"}`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold tracking-tight ${accent ? "text-teal-400" : "text-white"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  unit?: string;
}

function ChartTooltip({ active, payload, label, unit = "" }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111827] border border-teal-500/20 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white/40 mb-0.5">{label}</p>
      <p className="text-teal-400 font-semibold">
        {(payload[0].value ?? 0).toLocaleString()} {unit}
      </p>
    </div>
  );
}

function MiniChart({ data, color, unit }: { data: { date: string; value: number }[]; color: string; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: -30 }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.15)", fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
        <YAxis hide />
        <Tooltip content={<ChartTooltip unit={unit} />} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#grad-${color})`} dot={false} activeDot={{ r: 3, fill: color, strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function VolumeBarChart({ data }: { data: { date: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: -30 }}>
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.15)", fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
        <YAxis hide />
        <Tooltip content={<ChartTooltip unit="USDC" />} />
        <Bar dataKey="value" fill="#0D9488" radius={[2, 2, 0, 0]} opacity={0.7} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OverviewContent() {
  const s = OVERVIEW_STATS;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-white/30 text-sm mt-0.5">Platform-wide metrics — May 2026</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={s.totalUsers} sub="registered accounts" icon={<Users size={15} />} />
        <StatCard label="Connected Inverters" value={s.totalInverters} sub="active devices" icon={<Cpu size={15} />} />
        <StatCard label="Active Producers 24h" value={s.activeProducers24h} sub="produced energy today" icon={<Activity size={15} />} accent />
        <StatCard label="Revenue (USDC)" value={`$${s.revenueUsdc.toLocaleString()}`} sub="marketplace total" icon={<DollarSign size={15} />} />
      </div>

      {/* Token stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="$SUB Minted Today" value={s.subMintedToday} sub="tokens" icon={<Zap size={15} />} accent />
        <StatCard label="$SUB Minted This Week" value={s.subMintedWeek} sub="tokens" icon={<Zap size={15} />} />
        <StatCard label="$SUB Minted All Time" value={s.subMintedAllTime} sub="tokens" icon={<TrendingUp size={15} />} />
        <StatCard label="$SRE Distributed" value={s.sreDistributed} sub="certificates" icon={<Leaf size={15} />} />
      </div>

      {/* Marketplace row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl p-5 bg-[#111827]/60 border border-teal-500/[0.1]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/35">Marketplace Transactions</p>
            <ShoppingCart size={14} className="text-white/20" />
          </div>
          <p className="text-2xl font-bold text-white">{s.marketplaceTransactions.toLocaleString()}</p>
          <p className="text-xs text-white/30 mt-1">total purchases on-platform</p>
        </div>
        <div className="rounded-2xl p-5 bg-[#111827]/60 border border-teal-500/[0.1]">
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/35 mb-1">Avg. CO₂ Price</p>
          <p className="text-2xl font-bold text-white">$82.40 <span className="text-sm font-normal text-white/30">/ tonne</span></p>
          <p className="text-xs text-white/30 mt-1">weighted average across all sales</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl p-5 bg-[#111827]/60 border border-teal-500/[0.1]">
          <p className="text-sm font-semibold text-white mb-1">Daily Registrations</p>
          <p className="text-xs text-white/30 mb-4">New users / day — last 14 days</p>
          <MiniChart data={DAILY_REGISTRATIONS} color="#10B981" unit="users" />
        </div>
        <div className="rounded-2xl p-5 bg-[#111827]/60 border border-teal-500/[0.1]">
          <p className="text-sm font-semibold text-white mb-1">Daily Energy Production</p>
          <p className="text-xs text-white/30 mb-4">kWh recorded / day — last 14 days</p>
          <MiniChart data={DAILY_ENERGY} color="#0D9488" unit="kWh" />
        </div>
        <div className="rounded-2xl p-5 bg-[#111827]/60 border border-teal-500/[0.1]">
          <p className="text-sm font-semibold text-white mb-1">Daily Marketplace Volume</p>
          <p className="text-xs text-white/30 mb-4">USDC traded / day — last 14 days</p>
          <VolumeBarChart data={DAILY_VOLUME} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <OverviewContent />
    </AdminGuard>
  );
}
