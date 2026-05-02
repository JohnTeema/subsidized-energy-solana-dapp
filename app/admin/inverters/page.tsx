"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { SourceBadge } from "@/components/SourceBadge";
import { useAuth } from "@/lib/auth";
import { fetchAdminInverters, type DataSource, type AdminInverter } from "@/lib/adminApi";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, AlertCircle, RefreshCw } from "lucide-react";

type SortKey = keyof AdminInverter;
type SortDir = "asc" | "desc";
type StatusFilter = "all" | AdminInverter["status"];
const PAGE_SIZE = 12;

const STATUS_STYLES: Record<AdminInverter["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  disconnected: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const STATUS_DOT: Record<AdminInverter["status"], string> = {
  active: "bg-emerald-400",
  disconnected: "bg-amber-400",
  error: "bg-red-400",
};

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-white/15" />;
  return dir === "asc" ? <ChevronUp size={12} className="text-teal-400" /> : <ChevronDown size={12} className="text-teal-400" />;
}

const BRANDS = ["All brands", "Growatt", "SolarEdge", "Deye", "Huawei", "Mock"];

function timeSince(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ${m}m ago`;
  return `${m}m ago`;
}

function InvertersContent() {
  const { token } = useAuth();
  const [inverters, setInverters] = useState<AdminInverter[]>([]);
  const [source, setSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [sortKey, setSortKey] = useState<SortKey>("lastPoll");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    const result = await fetchAdminInverters(token ?? "");
    setInverters(result.data);
    setSource(result.source);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  const staleThreshold = new Date(Date.now() - 24 * 3_600_000).toISOString();
  const staleInverters = inverters.filter((i) => i.lastPoll < staleThreshold);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return inverters.filter((i) => {
      if (q && !i.userWallet.toLowerCase().includes(q) && !(i.userEmail ?? "").toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (brandFilter !== "All brands" && i.brand !== brandFilter) return false;
      return true;
    }).sort((a, b) => {
      const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [inverters, search, statusFilter, brandFilter, sortKey, sortDir]);

  const activeCount = inverters.filter((i) => i.status === "active").length;
  const disconnectedCount = inverters.filter((i) => i.status === "disconnected").length;
  const errorCount = inverters.filter((i) => i.status === "error").length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30 select-none cursor-pointer hover:text-white/60 transition-colors";
  const td = "px-4 py-3 text-sm text-white/70";

  const COLS: { key: SortKey; label: string }[] = [
    { key: "userEmail", label: "User" }, { key: "userWallet", label: "Wallet" },
    { key: "brand", label: "Brand" }, { key: "status", label: "Status" },
    { key: "lastPoll", label: "Last Poll" }, { key: "totalKWh", label: "Total kWh" },
    { key: "connectedAt", label: "Connected" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inverters</h1>
          <p className="text-white/30 text-sm mt-0.5">All connected solar inverter devices</p>
        </div>
        <div className="flex items-center gap-2">
          <SourceBadge source={source} />
          <button onClick={load} disabled={loading} className="p-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.12] text-white/40 hover:text-white hover:bg-teal-500/[0.10] transition-all disabled:opacity-50">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="rounded-2xl p-4 border border-teal-500/[0.1] bg-[#111827]/60">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Total Inverters</p>
          <p className="text-2xl font-bold text-white">{inverters.length}</p>
        </div>
        <div className="rounded-2xl p-4 border border-emerald-500/15 bg-emerald-500/[0.04]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
        </div>
        <div className="rounded-2xl p-4 border border-amber-500/20 bg-amber-500/[0.04]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Disconnected</p>
          <p className="text-2xl font-bold text-amber-400">{disconnectedCount}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${errorCount > 0 ? "border-red-500/20 bg-red-500/[0.05]" : "border-teal-500/[0.1] bg-[#111827]/60"}`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Error</p>
          <p className={`text-2xl font-bold ${errorCount > 0 ? "text-red-400" : "text-white"}`}>{errorCount}</p>
        </div>
      </div>

      {staleInverters.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 mb-5">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-300/80">
            {staleInverters.length} inverter{staleInverters.length !== 1 ? "s" : ""} haven&apos;t reported in 24h+: {staleInverters.map((i) => i.userEmail ?? i.userWallet.slice(0, 8)).join(", ")}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search email or wallet…"
            className="pl-8 pr-4 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white placeholder-white/20 outline-none focus:border-teal-500/40 w-56" />
        </div>
        {(["all", "active", "disconnected", "error"] as const).map((v) => (
          <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === v ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-white/35 border border-teal-500/[0.08] hover:text-white/70"}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white/60 outline-none focus:border-teal-500/40">
          {BRANDS.map((b) => <option key={b} value={b} className="bg-[#111827]">{b}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden border border-teal-500/[0.1] bg-[#111827]/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="border-b border-teal-500/[0.08] bg-white/[0.02]">
              <tr>
                {COLS.map(({ key, label }) => (
                  <th key={key} className={th} onClick={() => handleSort(key)}>
                    <span className="flex items-center gap-1">{label}<SortIcon col={key} sortKey={sortKey} dir={sortDir} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-500/[0.06]">
              {loading && <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">Loading…</td></tr>}
              {!loading && pageData.map((inv) => {
                const isStale = inv.lastPoll < staleThreshold;
                return (
                  <tr key={inv.id} className={`transition-colors ${inv.status === "error" ? "bg-red-500/[0.02]" : ""} hover:bg-teal-500/[0.03]`}>
                    <td className={td}>{inv.userEmail ?? <span className="text-white/20 italic">no email</span>}</td>
                    <td className={`${td} font-mono text-xs`}>{inv.userWallet.slice(0, 8)}…{inv.userWallet.slice(-4)}</td>
                    <td className={td}>{inv.brand}</td>
                    <td className={td}>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[inv.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[inv.status]} ${inv.status === "active" ? "animate-pulse" : ""}`} />
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className={`${td} ${isStale ? "text-amber-400/80" : ""}`}>
                      {timeSince(inv.lastPoll)}{isStale && <span className="ml-1 text-[10px] text-amber-400/60">⚠</span>}
                    </td>
                    <td className={`${td} font-semibold text-white`}>{inv.totalKWh.toLocaleString()}</td>
                    <td className={td}>{inv.connectedAt}</td>
                  </tr>
                );
              })}
              {!loading && pageData.length === 0 && <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">No inverters match these filters</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-teal-500/[0.08]">
          <p className="text-xs text-white/25">{filtered.length} inverters</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (<button key={n} onClick={() => setPage(n)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${page === n ? "bg-teal-500/20 text-teal-400" : "text-white/40 hover:text-white hover:bg-teal-500/[0.08]"}`}>{n}</button>))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminInvertersPage() {
  return <AdminGuard><InvertersContent /></AdminGuard>;
}
