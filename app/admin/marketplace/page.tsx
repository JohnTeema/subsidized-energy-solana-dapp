"use client";

import { useState, useMemo } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import {
  MOCK_LISTINGS,
  MOCK_PURCHASES,
  type MarketplaceListing,
  type MarketplacePurchase,
} from "@/lib/adminMockData";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type Tab = "listings" | "purchases";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const LISTING_STATUS_STYLES: Record<MarketplaceListing["status"], string> = {
  active: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  sold: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-white/[0.04] text-white/30 border border-white/[0.08]",
};

function SortBtn<T extends string>({
  col, sortKey, dir, onSort, label,
}: { col: T; sortKey: T; dir: SortDir; onSort: (k: T) => void; label: string }) {
  return (
    <th
      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30 select-none cursor-pointer hover:text-white/60 transition-colors"
      onClick={() => onSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        {col !== sortKey
          ? <ChevronsUpDown size={12} className="text-white/15" />
          : dir === "asc"
          ? <ChevronUp size={12} className="text-teal-400" />
          : <ChevronDown size={12} className="text-teal-400" />}
      </span>
    </th>
  );
}

type ListingKey = keyof MarketplaceListing;
type PurchaseKey = keyof MarketplacePurchase;

function ListingsTable() {
  const [statusFilter, setStatusFilter] = useState<MarketplaceListing["status"] | "all">("all");
  const [sortKey, setSortKey] = useState<ListingKey>("listedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  function handleSort(k: ListingKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
    setPage(1);
  }

  const filtered = useMemo(() =>
    MOCK_LISTINGS
      .filter((l) => statusFilter === "all" || l.status === statusFilter)
      .sort((a, b) => {
        const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      }),
    [statusFilter, sortKey, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const td = "px-4 py-3 text-sm text-white/70";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "active", "sold", "cancelled"] as const).map((v) => (
          <button
            key={v}
            onClick={() => { setStatusFilter(v); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === v ? "bg-teal-500/15 text-teal-400 border border-teal-500/25" : "text-white/35 border border-teal-500/[0.08] hover:text-white/70"}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden border border-teal-500/[0.1] bg-[#111827]/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-teal-500/[0.08] bg-white/[0.02]">
              <tr>
                <SortBtn col="producer" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Producer" />
                <SortBtn col="kWh" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="kWh" />
                <SortBtn col="co2" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="CO₂ (kg)" />
                <SortBtn col="price" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Price (USDC)" />
                <SortBtn col="pricePerTonne" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="$/Tonne" />
                <SortBtn col="status" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Status" />
                <SortBtn col="listedAt" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Listed" />
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-500/[0.06]">
              {pageData.map((l) => (
                <tr key={l.id} className="hover:bg-teal-500/[0.03] transition-colors">
                  <td className={td}>{l.producer}</td>
                  <td className={`${td} font-semibold text-white`}>{l.kWh}</td>
                  <td className={td}>{l.co2.toFixed(1)}</td>
                  <td className={`${td} text-teal-400`}>${l.price.toFixed(2)}</td>
                  <td className={td}>${l.pricePerTonne}</td>
                  <td className={td}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${LISTING_STATUS_STYLES[l.status]}`}>
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </span>
                  </td>
                  <td className={td}>{l.listedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-teal-500/[0.08]">
          <p className="text-xs text-white/25">{filtered.length} listings</p>
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

function PurchasesTable() {
  const [sortKey, setSortKey] = useState<PurchaseKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  function handleSort(k: PurchaseKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
    setPage(1);
  }

  const sorted = useMemo(() =>
    [...MOCK_PURCHASES].sort((a, b) => {
      const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    }),
    [sortKey, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const td = "px-4 py-3 text-sm text-white/70";

  return (
    <div className="rounded-2xl overflow-hidden border border-teal-500/[0.1] bg-[#111827]/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-teal-500/[0.08] bg-white/[0.02]">
            <tr>
              <SortBtn col="buyerOrg" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Buyer Org" />
              <SortBtn col="listingId" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Listing" />
              <SortBtn col="kWh" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="kWh" />
              <SortBtn col="amountPaid" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Amount (USDC)" />
              <SortBtn col="subBurned" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="$SUB Burned" />
              <SortBtn col="date" sortKey={sortKey} dir={sortDir} onSort={handleSort} label="Date" />
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-500/[0.06]">
            {pageData.map((p) => (
              <tr key={p.id} className="hover:bg-teal-500/[0.03] transition-colors">
                <td className={`${td} font-medium text-white/90`}>{p.buyerOrg}</td>
                <td className={`${td} font-mono text-xs`}>{p.listingId}</td>
                <td className={`${td} font-semibold text-white`}>{p.kWh}</td>
                <td className={`${td} text-teal-400`}>${p.amountPaid.toFixed(2)}</td>
                <td className={`${td} text-red-400/70`}>{p.subBurned.toLocaleString()}</td>
                <td className={td}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-teal-500/[0.08]">
        <p className="text-xs text-white/25">{sorted.length} purchases</p>
        <div className="flex gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${page === n ? "bg-teal-500/20 text-teal-400" : "text-white/40 hover:text-white hover:bg-teal-500/[0.08]"}`}>{n}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-teal-500/[0.08] disabled:opacity-25 disabled:pointer-events-none transition-all">Next</button>
        </div>
      </div>
    </div>
  );
}

function MarketplaceContent() {
  const [tab, setTab] = useState<Tab>("listings");

  const totalVolume = MOCK_PURCHASES.reduce((s, p) => s + p.amountPaid, 0);
  const totalCO2 = MOCK_LISTINGS.filter((l) => l.status === "sold").reduce((s, l) => s + l.co2, 0);
  const avgPrice = MOCK_LISTINGS.filter((l) => l.status === "sold").reduce((s, l) => s + l.pricePerTonne, 0) / MOCK_LISTINGS.filter((l) => l.status === "sold").length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace</h1>
        <p className="text-white/30 text-sm mt-0.5">All listings and purchases</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Listings", value: MOCK_LISTINGS.length.toString() },
          { label: "Total Purchases", value: MOCK_PURCHASES.length.toString() },
          { label: "Total Volume", value: `$${totalVolume.toFixed(2)} USDC` },
          { label: "Avg. CO₂ Price", value: `$${avgPrice.toFixed(2)}/tonne` },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl p-4 border border-teal-500/[0.1] bg-[#111827]/60">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">{c.label}</p>
            <p className="text-xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      {/* CO2 sold */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-500/[0.05] border border-teal-500/15 mb-6">
        <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
        <p className="text-sm text-white/60">
          <span className="text-teal-400 font-semibold">{totalCO2.toFixed(1)} kg CO₂</span> offset retired through marketplace sales
        </p>
      </div>

      {/* Tab */}
      <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-xl p-1 w-fit border border-teal-500/[0.08]">
        {(["listings", "purchases"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-teal-500/15 text-teal-400" : "text-white/40 hover:text-white/70"}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "listings" ? <ListingsTable /> : <PurchasesTable />}
    </div>
  );
}

export default function AdminMarketplacePage() {
  return (
    <AdminGuard>
      <MarketplaceContent />
    </AdminGuard>
  );
}
