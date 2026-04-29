"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Globe,
  Zap,
  Leaf,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Building2,
  AlertCircle,
  Sparkles,
  Plug,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";
import { Footer } from "@/components/Footer";
import { mockListings } from "@/lib/mockData";
import { hasConnectedInverter } from "@/lib/inverterConnection";

const regions = [
  "All Regions",
  "Nigeria",
  "US",
  "EU",
  "Australia",
  "India",
  "Canada",
  "China",
  "South Africa",
  "Brazil",
  "Germany",
];

interface StoredListing {
  id: string;
  region: string;
  kwh: number;
  co2: number;
  price: number;
  seller: string;
  sellerWallet?: string;
  renewable: string;
  verified: boolean;
  isNew?: boolean;
  createdAt?: number;
}

interface EsgRegistration {
  walletAddress: string;
  orgName: string;
}

function MarketplaceContent() {
  const { publicKey } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [maxPrice, setMaxPrice] = useState(500);
  const [buying, setBuying] = useState<string | null>(null);
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [userListings] = useState<StoredListing[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("subenergy_listings") || "[]");
  });
  const [unregisteredClick, setUnregisteredClick] = useState(false);
  const [ownListingClick, setOwnListingClick] = useState(false);

  const esgRegistration = useMemo(() => {
    if (!publicKey || typeof window === "undefined") return null;
    const regs: EsgRegistration[] = JSON.parse(
      localStorage.getItem("subenergy_esg_registrations") || "[]"
    );
    return regs.find((r) => r.walletAddress === publicKey.toString()) ?? null;
  }, [publicKey]);

  const isEsgRegistered = !!esgRegistration;
  const esgOrg = esgRegistration?.orgName ?? null;

  const allListings: StoredListing[] = [...userListings, ...mockListings];

  const filteredListings = allListings.filter((l) => {
    const regionMatch =
      selectedRegion === "All Regions" ||
      l.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const priceMatch = l.price <= maxPrice;
    const searchMatch =
      !searchQuery ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.renewable.toLowerCase().includes(searchQuery.toLowerCase());
    return regionMatch && priceMatch && searchMatch;
  });

  const connectedWallet = publicKey?.toBase58() ?? "";
  const inverterConnected = hasConnectedInverter(connectedWallet);
  const shortConnectedWallet = connectedWallet
    ? `${connectedWallet.slice(0, 4)}...${connectedWallet.slice(-4)}`
    : "";

  const isOwnListing = (listing: StoredListing) =>
    !!connectedWallet &&
    (listing.sellerWallet === connectedWallet ||
      listing.seller === shortConnectedWallet);

  const handleBuy = (listing: StoredListing) => {
    if (isOwnListing(listing)) {
      setOwnListingClick(true);
      setTimeout(() => setOwnListingClick(false), 4000);
      return;
    }
    if (!isEsgRegistered) {
      setUnregisteredClick(true);
      setTimeout(() => setUnregisteredClick(false), 4000);
      return;
    }
    setBuying(listing.id);
    setTimeout(() => {
      setBuying(null);
      setBought((prev) => new Set([...prev, listing.id]));
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* ESG registration banner */}
        {!isEsgRegistered && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/[0.20] mb-6">
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-400/90 text-sm flex-1">
              Register your organization to purchase carbon offsets
            </p>
            <Link
              href="/marketplace/register"
              className="text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              Register now →
            </Link>
          </div>
        )}

        {/* Unregistered buy attempt alert */}
        {unregisteredClick && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/[0.20] mb-6">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400/90 text-sm flex-1">
              Only registered ESG organizations can purchase offsets.{" "}
              <Link
                href="/marketplace/register"
                className="text-red-400 font-semibold underline hover:text-red-300 transition-colors"
              >
                Register your organization
              </Link>
              .
            </p>
          </div>
        )}

        {/* Own listing buy attempt alert */}
        {ownListingClick && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/[0.20] mb-6">
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-400/90 text-sm flex-1">
              You cannot buy an offset listing created by your connected wallet.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Marketplace
            </h1>
            <p className="text-white/30 text-sm mt-0.5">
              {filteredListings.length} energy offset listings
              {esgOrg && (
                <span className="ml-2 text-teal-400/70">
                  · Buying as {esgOrg}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEsgRegistered && (
              <Link
                href="/marketplace/register"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/70 text-sm font-medium hover:bg-teal-500/[0.12] hover:text-white transition-all"
              >
                <Building2 size={14} />
                Register as Buyer
              </Link>
            )}
            <Link
              href={inverterConnected ? "/marketplace/list" : "/connect"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
            >
              {inverterConnected ? <Plus size={15} /> : <Plug size={15} />}
              {inverterConnected ? "List Your Energy" : "Connect Inverter"}
            </Link>
          </div>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Volume (kWh)", value: "12,600", icon: <Zap size={14} /> },
            { label: "CO₂ Offset (t)", value: "6.3", icon: <Leaf size={14} /> },
            { label: "Avg Price / kWh", value: "~$0.09", icon: <TrendingUp size={14} /> },
          ].map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-lg leading-none">
                  {s.value}
                </p>
                <p className="text-white/30 text-xs mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="Search by region or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-white/30" />
              <div className="flex gap-2 overflow-x-auto pb-0.5">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedRegion === r
                        ? "bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white"
                        : "bg-teal-500/[0.05] text-white/50 hover:text-white hover:bg-teal-500/[0.10]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 min-w-[180px]">
              <span className="text-white/30 text-xs whitespace-nowrap">
                Max ${maxPrice}
              </span>
              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Listings grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredListings.map((listing) => {
            const ownListing = isOwnListing(listing);

            return (
              <div
                key={listing.id}
                className="glass rounded-2xl p-6 hover:border-teal-500/25 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
              >
              {/* Region & badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Globe size={11} />
                  <span className="truncate">{listing.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  {listing.isNew && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <Sparkles size={8} className="text-amber-400" />
                      <span className="text-amber-400 text-[10px] font-medium">
                        New
                      </span>
                    </div>
                  )}
                  {listing.verified ? (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                      <CheckCircle2 size={9} className="text-teal-400" />
                      <span className="text-teal-400 text-[10px] font-medium">
                        Verified
                      </span>
                    </div>
                  ) : (
                    <div className="px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06]">
                      <span className="text-white/25 text-[10px]">
                        Unverified
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Type badge */}
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/[0.08] border border-teal-500/[0.15] mb-4 self-start">
                <Zap size={10} className="text-teal-400" />
                <span className="text-teal-400/80 text-xs">
                  {listing.renewable}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
                <div className="bg-teal-500/[0.03] rounded-lg p-2.5">
                  <p className="text-white text-base font-bold">
                    {listing.kwh.toLocaleString()}
                  </p>
                  <p className="text-white/30 text-[10px] mt-0.5">
                    kWh available
                  </p>
                </div>
                <div className="bg-teal-500/[0.03] rounded-lg p-2.5">
                  <p className="text-white text-base font-bold">
                    {listing.co2}t
                  </p>
                  <p className="text-white/30 text-[10px] mt-0.5">CO₂ offset</p>
                </div>
              </div>

              {/* Price + Buy */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-400 font-bold text-lg">
                    ${listing.price}
                  </p>
                  <p className="text-white/25 text-[10px]">SRE tokens</p>
                </div>
                <button
                  onClick={() => handleBuy(listing)}
                  disabled={!!buying || bought.has(listing.id) || ownListing}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    bought.has(listing.id)
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 cursor-default"
                    : buying === listing.id
                      ? "bg-teal-500/20 text-teal-400 cursor-wait"
                    : ownListing
                      ? "bg-white/[0.04] text-white/30 border border-white/[0.08] cursor-not-allowed"
                    : !isEsgRegistered
                      ? "bg-white/[0.05] text-white/40 border border-white/[0.08] hover:border-amber-500/30 hover:text-amber-400/70"
                      : "bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white hover:opacity-90 group-hover:shadow-lg group-hover:shadow-teal-500/20"
                  }`}
                >
                  {bought.has(listing.id) ? (
                    <>
                      <CheckCircle2 size={12} /> Purchased
                    </>
                  ) : buying === listing.id ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : ownListing ? (
                    "Your Listing"
                  ) : !isEsgRegistered ? (
                    <>
                      <Building2 size={12} /> Register
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={12} /> Buy Offset
                    </>
                  )}
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Globe size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No listings match your filters</p>
            <p className="text-sm mt-1">
              Try adjusting the region or price range
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <WalletGuard>
      <MarketplaceContent />
    </WalletGuard>
  );
}
