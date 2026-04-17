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
      className={`glass p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 group ${
        accent
          ? "border-teal-500/25 bg-teal-500/[0.04]"
          : "border-teal-500/[0.10] hover:border-teal-500/20"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{label}</span>
        {icon && (
          <div className={`p-1.5 rounded-lg ${accent ? "bg-teal-500/15 text-teal-400" : "bg-teal-500/[0.08] text-teal-500/60"} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-1">
        <p className={`text-2xl font-bold tracking-tight ${accent ? "text-teal-400" : "text-white"}`}>
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
