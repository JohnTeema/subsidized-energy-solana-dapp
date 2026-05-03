"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { SourceBadge } from "@/components/SourceBadge";
import { useAuth } from "@/lib/auth";
import { fetchAdminEnergy, fetchAdminStats, type DataSource, type EnergyReading, type OverviewStats, type AdminEnergyResult } from "@/lib/adminApi";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle, RefreshCw, TrendingUp } from "lucide-react";

type SortKey = keyof EnergyReading;
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "verified" | "flagged" | "pending";
const PAGE_SIZE = 12;

const STATUS_STYLES: Record<EnergyReading["status"], string> = {
  verified: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  flagged: "bg-red-500/10 text-red-400 border border-red-500/20",
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-white/15" />;
  return dir === "asc" ? <ChevronUp size={12} className="text-teal-400" /> : <ChevronDown size={12} className="text-teal-400" />;
}

const BRANDS = ["All brands", "Growatt", "SolarEdge", "Deye", "Huawei", "Mock"];

function EnergyContent() {
  const { token } = useAuth();
  const [readings, setReadings] = useState<EnergyReading[]>([]);
  const [apiTotal, setApiTotal] = useState(0);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [source, setSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    const [energyResult, statsResult] = await Promise.all([
      fetchAdminEnergy(token ?? ""),
      fetchAdminStats(token ?? ""),
    ]);
    setReadings(energyResult.data.readings);
    setApiTotal(energyResult.data.total);
    setSource(energyResult.source);
    setStats(statsResult.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return readings.filter((r) => {
      if (q && !r.producer.toLowerCase().includes(q) && !r.producerWallet.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (brandFilter !== "All brands" && r.inverterBrand !== brandFilter) return false;
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      return true;
    }).sort((a, b) => {
      const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [readings, search, statusFilter, brandFilter, dateFrom, dateTo, sortKey, sortDir]);

  const flaggedCount = readings.filter((r) => r.status === "flagged").length;
  const pendingCount = readings.filter((r) => r.status === "pending").length;

  // Use backend's corrected total; fall back to sum of readings if stats unavailable
  const totalKWh = stats?.totalKwhProduced ?? readings.reduce((s, r) => s + r.kWh, 0);
  const totalSUB = readings.reduce((s, r) => s + r.subMinted, 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Compute delta (increase since previous reading). Table is sorted DESC by date,
  // so pageData[0] is most recent. For cumulative snapshots, delta[i] = kWh[i] - kWh[i+1]
  const pageDataWithDelta = useMemo(() => {
    return pageData.map((r, idx) => {
      const nextReading = pageData[idx + 1];
      const delta = nextReading ? Math.max(0, r.kWh - nextReading.kWh) : r.kWh; // First entry shows its full value
      return { ...r, delta };
    });
  }, [pageData]);

  const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30 select-none cursor-pointer hover:text-white/60 transition-colors";
  const td = "px-4 py-3 text-sm text-white/70";

  const COLS: { key: SortKey | "delta"; label: string }[] = [
    { key: "producer", label: "Producer" },
    { key: "producerWallet", label: "Wallet" },
    { key: "date", label: "Date" },
    { key: "kWh", label: "kWh (cumulative)" },
    { key: "delta", label: "Delta" },
    { key: "co2Offset", label: "CO₂ (kg)" },
    { key: "subMinted", label: "$SUB Minted" },
    { key: "inverterBrand", label: "Inverter" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Energy Production</h1>
          <p className="text-white/30 text-sm mt-0.5">All recorded energy readings — cumulative snapshots from the same day</p>
        </div>
        <div className="flex items-center gap-2">
          <SourceBadge source={source} />
          <button onClick={load} disabled={loading} className="p-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.12] text-white/40 hover:text-white hover:bg-teal-500/[0.10] transition-all disabled:opacity-50">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Readings", value: apiTotal.toString() },
          { label: "Total kWh", value: totalKWh.toFixed(1) },
          { label: "Total $SUB Minted", value: totalSUB.toLocaleString() },
          { label: "Flagged / Pending", value: `${flaggedCount} / ${pendingCount}`, warn: flaggedCount > 0 },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl p-4 border ${c.warn ? "bg-red-500/[0.05] border-red-500/20" : "bg-[#111827]/60 border-teal-500/[0.1]"}`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">{c.label}</p>
            <p className={`text-xl font-bold ${c.warn ? "text-red-400" : "text-white"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {flaggedCount > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.06] border border-red-500/20 mb-5">
          <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300/80">
            {flaggedCount} reading{flaggedCount !== 1 ? "s" : ""} flagged for review — potential anomalous data detected.
          </p>
        </div>
      )}

      {/* Visual cue that these are cumulative snapshots from the same day */}
      <div className="flex items-center gap-2 mb-5 text-xs text-white/40">
        <TrendingUp size={14} />
        <span>Cumulative snapshots: each reading is the total kWh produced up to that point in the day. The Delta column shows the incremental increase since the previous snapshot.</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search producer or wallet…"
            className="pl-8 pr-4 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white placeholder-white/20 outline-none focus:border-teal-500/40 w-56" />
        </div>
        {(["all", "verified", "flagged", "pending"] as const).map((v) => (
          <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === v ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-white/35 border border-teal-500/[0.08] hover:text-white/70"}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white/60 outline-none focus:border-teal-500/40">
          {BRANDS.map((b) => <option key={b} value={b} className="bg-[#111827]">{b}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white/60 outline-none focus:border-teal-500/40" />
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white/60 outline-none focus:border-teal-500/40" />
      </div>

      <div className="rounded-2xl overflow-hidden border border-teal-500/[0.1] bg-[#111827]/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-teal-500/[0.08] bg-white/[0.02]">
              <tr>
                {COLS.map(({ key, label }) => (
                  <th key={key as string} className={th} onClick={() => handleSort(key as SortKey)}>
                    <span className="flex items-center gap-1">{label}<SortIcon col={key as SortKey} sortKey={sortKey} dir={sortDir} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-500/[0.06]">
              {loading && <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">Loading…</td></tr>}
              {!loading && pageDataWithDelta.map((r) => (
                <tr key={r.id} className={`transition-colors ${r.status === "flagged" ? "bg-red-500/[0.03] hover:bg-red-500/[0.06]" : "hover:bg-teal-500/[0.03]"}`}>
                  <td className={td}>{r.producer}</td>
                  <td className={`${td} font-mono text-xs`}>{r.producerWallet}</td>
                  <td className={td}>{r.date}</td>
                  <td className={`${td} font-semibold text-white`}>{r.kWh.toFixed(1)}</td>
                  <td className={`${td} ${r.delta > 0 ? "text-teal-400 font-medium" : "text-white/40"}`}>
                    {r.delta > 0 ? `+${r.delta.toFixed(1)}` : "—"}
                  </td>
                  <td className={td}>{r.co2Offset.toFixed(2)}</td>
                  <td className={`${td} text-teal-400`}>{r.subMinted}</td>
                  <td className={td}>{r.inverterBrand}</td>
                  <td className={td}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[r.status]}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && pageDataWithDelta.length === 0 && <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">No readings match these filters</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-teal-500/[0.08]">
          <p className="text-xs text-white/25">
            {apiTotal} readings · showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${page === n ? "bg-teal-500/20 text-teal-400" : "text-white/40 hover:text-white hover:bg-teal-500/[0.08]"}`}>{n}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminEnergyPage() {
  return <AdminGuard><EnergyContent /></AdminGuard>;
}
