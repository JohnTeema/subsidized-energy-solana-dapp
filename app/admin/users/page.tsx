"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { SourceBadge } from "@/components/SourceBadge";
import { useAuth } from "@/lib/auth";
import { fetchAdminUsers, type DataSource } from "@/lib/adminApi";
import { type AdminUser } from "@/lib/adminMockData";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw } from "lucide-react";

type SortKey = keyof AdminUser;
type SortDir = "asc" | "desc";
type FilterVerified = "all" | "verified" | "unverified";
type FilterInverter = "all" | "has" | "none";
type FilterActive = "all" | "active" | "inactive";

const PAGE_SIZE = 10;

function badge(active: boolean) {
  return active
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : "bg-red-500/10 text-red-400 border border-red-500/20";
}

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-white/15" />;
  return dir === "asc"
    ? <ChevronUp size={12} className="text-teal-400" />
    : <ChevronDown size={12} className="text-teal-400" />;
}

function UsersContent() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [source, setSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState<FilterVerified>("all");
  const [filterInverter, setFilterInverter] = useState<FilterInverter>("all");
  const [filterActive, setFilterActive] = useState<FilterActive>("all");
  const [sortKey, setSortKey] = useState<SortKey>("registeredAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  async function load() {
    if (!token) return;
    setLoading(true);
    const result = await fetchAdminUsers(token);
    setUsers(result.data);
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
    return users.filter((u) => {
      if (q && !u.email.toLowerCase().includes(q) && !u.wallet.toLowerCase().includes(q)) return false;
      if (filterVerified === "verified" && !u.verified) return false;
      if (filterVerified === "unverified" && u.verified) return false;
      if (filterInverter === "has" && !u.inverterBrand) return false;
      if (filterInverter === "none" && u.inverterBrand) return false;
      const isActive = u.lastActive >= "2026-04-25";
      if (filterActive === "active" && !isActive) return false;
      if (filterActive === "inactive" && isActive) return false;
      return true;
    }).sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [users, search, filterVerified, filterInverter, filterActive, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const th = "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30 select-none cursor-pointer hover:text-white/60 transition-colors";
  const td = "px-4 py-3 text-sm text-white/70";

  const COLS: { key: SortKey; label: string }[] = [
    { key: "email", label: "Email" },
    { key: "wallet", label: "Wallet" },
    { key: "registeredAt", label: "Registered" },
    { key: "verified", label: "Verified" },
    { key: "inverterBrand", label: "Inverter" },
    { key: "kWhProduced", label: "kWh" },
    { key: "subBalance", label: "$SUB" },
    { key: "sreBalance", label: "SRE Pts" },
    { key: "lastActive", label: "Last Active" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-white/30 text-sm mt-0.5">{filtered.length} of {users.length} accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <SourceBadge source={source} />
          <button
            onClick={load}
            disabled={loading}
            className="p-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.12] text-white/40 hover:text-white hover:bg-teal-500/[0.10] transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search email or wallet…"
            className="pl-8 pr-4 py-2 rounded-xl bg-white/[0.04] border border-teal-500/[0.12] text-sm text-white placeholder-white/20 outline-none focus:border-teal-500/40 w-64"
          />
        </div>

        {(["all", "verified", "unverified"] as const).map((v) => (
          <button key={v} onClick={() => { setFilterVerified(v); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterVerified === v ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-white/35 border border-teal-500/[0.08] hover:text-white/70"}`}>
            {v === "all" ? "All verification" : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}

        {(["all", "has", "none"] as const).map((v) => (
          <button key={v} onClick={() => { setFilterInverter(v); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterInverter === v ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-white/35 border border-teal-500/[0.08] hover:text-white/70"}`}>
            {v === "all" ? "All inverter" : v === "has" ? "Has inverter" : "No inverter"}
          </button>
        ))}

        {(["all", "active", "inactive"] as const).map((v) => (
          <button key={v} onClick={() => { setFilterActive(v); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterActive === v ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-white/35 border border-teal-500/[0.08] hover:text-white/70"}`}>
            {v === "all" ? "All activity" : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden border border-teal-500/[0.1] bg-[#111827]/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
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
              {loading && (
                <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">Loading…</td></tr>
              )}
              {!loading && pageData.map((u) => (
                <tr key={u.id} className="hover:bg-teal-500/[0.03] transition-colors">
                  <td className={td}>{u.email}</td>
                  <td className={`${td} font-mono text-xs`}>{u.wallet.slice(0, 8)}…{u.wallet.slice(-4)}</td>
                  <td className={td}>{u.registeredAt}</td>
                  <td className={td}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge(u.verified)}`}>
                      {u.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className={td}>{u.inverterBrand ?? <span className="text-white/20">—</span>}</td>
                  <td className={td}>{u.kWhProduced.toLocaleString()}</td>
                  <td className={td}>{u.subBalance.toLocaleString()}</td>
                  <td className={td}>{u.sreBalance}</td>
                  <td className={td}>{u.lastActive}</td>
                </tr>
              ))}
              {!loading && pageData.length === 0 && (
                <tr><td colSpan={COLS.length} className="py-12 text-center text-white/25 text-sm">No users match these filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-teal-500/[0.08] bg-white/[0.01]">
          <p className="text-xs text-white/25">
            {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | "…")[]>((acc, n, i, arr) => {
                if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "…" ? (
                  <span key={`e${i}`} className="px-2 py-1.5 text-xs text-white/20">…</span>
                ) : (
                  <button key={n} onClick={() => setPage(n as number)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${page === n ? "bg-teal-500/20 text-teal-400" : "text-white/40 hover:text-white hover:bg-teal-500/[0.08]"}`}>{n}</button>
                )
              )}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return <AdminGuard><UsersContent /></AdminGuard>;
}
