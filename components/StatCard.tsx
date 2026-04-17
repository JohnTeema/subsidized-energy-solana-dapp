"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  trend?: { value: string; up: boolean };
  accent?: boolean;
}

export function StatCard({ label, value, sub, icon, trend, accent }: StatCardProps) {
  return (
    <div
      className={`glass p-5 rounded-2xl border transition-all duration-300 hover:border-white/[0.14] hover:-translate-y-0.5 group ${
        accent
          ? "border-amber-500/20 bg-amber-500/[0.04]"
          : "border-white/[0.08]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{label}</span>
        {icon && (
          <div className={`p-1.5 rounded-lg ${accent ? "bg-amber-500/10 text-amber-400" : "bg-white/[0.06] text-white/40"} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-1">
        <p className={`text-2xl font-bold tracking-tight ${accent ? "text-amber-400" : "text-white"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.up ? "text-emerald-400" : "text-red-400"}`}>
            <span>{trend.up ? "↑" : "↓"}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
