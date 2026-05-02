"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { SourceBadge } from "@/components/SourceBadge";
import { useAuth } from "@/lib/auth";
import { fetchAdminEsgBuyers, type DataSource, type EsgBuyer } from "@/lib/adminApi";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw } from "lucide-react";

type SortKey = keyof EsgBuyer;
type SortDir = "asc" | "desc";
const PAGE_SIZE = 10;

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-white/15" />;
  return dir === "asc" ? <ChevronUp size={12} className="text-teal-400" /> : <ChevronDown size={12} className="text-teal-400" />;
}

const INDUSTRIES = ["All industries", "Energy", "Utilities", "Finance", "Telecom", "Conglomerates", "FMCG", "Oil & Gas", "Manufacturing"];

function EsgContent() {
  const { token } = useAuth();
  const [buyers, setBuyers] = useState<EsgBuyer[]>([]);
  const [source, setSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All industries");
  const [sortKey, setSortKey] = useState<SortKey>("totalOffsets");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  async function load() {
    if (!token) return;
    setLoading(true);
    const result = await fetchAdminEsgBuyers(token);
    setBuyers(result.data);
    setSource(result.source);
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
    return buyers.filter((b) => {
      if (q && !b.orgName.toLowerCase().includes(q) && !b.companyId.toLowerCase().includes(q)) return false;
      if (industryFilter !== "All industries" && b.industry !== industryFilter) return false;
      return true;
    }).sort((a, b) => {
      const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [buyers, search, industryFilter, sortKey, sortDir]);

  const totalOffsets = buyers.reduce((s, b) => s + b.totalOffsets, 0);
  const topBuyer = buyers.reduce((a, b) => (b.totalOffsets > a.totalOffsets ? b : a), buyers[0] ?? { orgName: "—", totalOffsets: 0 });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30 select-none cursor-pointer hover:text-white/60 transition-colors";
  const td = "px-4 py-3 text-sm text-white/70";

  const COLS: { key: SortKey; label: string }[] = [
    { key: "orgName", label: "Organization" }, { key: "companyId", label: "Company ID" },
    { key: "country", label: "Country" }, { key: "industry", label: "Industry" },
    { key: "wallet", label: "Wallet" }, { key: "registeredAt", label: "Registered" },
    { key: "totalOffsets", label: "kWh Purchased" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ESG Buyers</h1>
          <p className="text-white/30 text-sm mt-0.5">Registered organizations purchasing carbon offsets</p>
        </div>
        <div className="flex items-center gap-2">
          <SourceBadge source={source} />
          <button onClick={load} disabled={loading} className="p-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.12] text-white/40 hover:text-white hover:bg-teal-500/[0.10] transition-all disabled:opacity-50">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl p-4 border border-teal-500/[0.1] bg-[#111827]/60">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Organizations</p>
          <p className="text-2xl font-bold text-white">{buyers.length}</p>
        </div>
        <div className="rounded-2xl p-4 border border-teal-500/[0.1] bg-[#111827]/60">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Total kWh Purchased</p>
          <p className="text-2xl font-bold text-teal-400">{totalOffsets.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl p-4 border border-teal-500/[0.1] bg-[#111827]/60 col-span-2 lg:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Top Buyer</p>
          <p className="text-xl font-bold text-white truncate">{topBuyer.orgName}</p>
          <p className="text-xs text-white/30 mt-0.5">{topBuyer.totalOffsets.toLocaleString()} kWh</p>
        </div>
      </div>

      {buyers.length > 0 && (
        <div className="rounded-2xl p-5 border border-teal-500/[0.1] bg-[#111827]/60 mb-6">
          <p className="text-sm font-semibold text-white mb-4">Top buyers by kWh purchased</p>
          <div className="flex flex-col gap-2">
            {[...buyers].sort((a, b) => b.totalOffsets - a.totalOffsets).slice(0, 6).map((b) => {
              const pct = topBuyer.totalOffsets > 0 ? (b.totalOffsets / topBuyer.totalOffsets) * 100 : 0;
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <p className="text-xs text-white/50 w-44 truncate flex-shrink-0">{b.orgName}</p>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-teal-400 w-20 text-right flex-shrink-0">{b.totalOffsets.toLocaleString()} kWh</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search org or company ID…"
            className="pl-8 pr-4 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white placeholder-white/20 outline-none focus:border-teal-500/40 w-56" />
        </div>
        <select value={industryFilter} onChange={(e) => { setIndustryFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white/60 outline-none focus:border-teal-500/40">
          {INDUSTRIES.map((i) => <option key={i} value={i} className="bg-[#111827]">{i}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden border border-teal-500/[0.1] bg-[#111827]/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
              {!loading && pageData.map((b) => (
                <tr key={b.id} className="hover:bg-teal-500/[0.03] transition-colors">
                  <td className={`${td} font-medium text-white/90`}>{b.orgName}</td>
                  <td className={`${td} font-mono text-xs`}>{b.companyId}</td>
                  <td className={td}>{b.country}</td>
                  <td className={td}><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/[0.08] text-teal-400/80 border border-teal-500/[0.12]">{b.industry}</span></td>
                  <td className={`${td} font-mono text-xs`}>{b.wallet.slice(0, 8)}…{b.wallet.slice(-4)}</td>
                  <td className={td}>{b.registeredAt}</td>
                  <td className={`${td} text-teal-400 font-semibold`}>{b.totalOffsets.toLocaleString()}</td>
                </tr>
              ))}
              {!loading && pageData.length === 0 && <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">No buyers match these filters</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-teal-500/[0.08]">
          <p className="text-xs text-white/25">{filtered.length} organizations</p>
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

export default function AdminEsgPage() {
  return <AdminGuard><EsgContent /></AdminGuard>;
}
