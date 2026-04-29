"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ArrowLeft,
  Zap,
  Globe,
  CheckCircle2,
  Loader2,
  Shield,
  Leaf,
  Sun,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";
import { Footer } from "@/components/Footer";

const renewableTypes = ["Solar", "Wind", "Hydro", "Geothermal", "Biomass"];

const EMISSION_FACTORS: Record<string, number> = {
  Nigeria: 0.43,
  US: 0.39,
  India: 0.71,
  Germany: 0.35,
  China: 0.56,
  "South Africa": 0.93,
  Brazil: 0.07,
  "Global Average": 0.49,
};

const regions = Object.keys(EMISSION_FACTORS);
const CARBON_PRICE_PER_TONNE = 15;

interface SavedListing {
  id: string;
  region: string;
  kwh: number;
  co2: number;
  price: number;
  seller: string;
  sellerWallet: string;
  renewable: string;
  verified: boolean;
  isNew: boolean;
  createdAt: number;
}

function ListEnergyContent() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [form, setForm] = useState({
    renewable: "Solar",
    region: "Nigeria",
    kwh: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedListing, setSavedListing] = useState<SavedListing | null>(null);

  const emissionFactor = EMISSION_FACTORS[form.region] ?? 0.49;
  const kwhNum = parseFloat(form.kwh) || 0;
  const co2Kg = kwhNum * emissionFactor;
  const co2Tonnes = co2Kg / 1000;
  const price = co2Tonnes * CARBON_PRICE_PER_TONNE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const walletStr = publicKey?.toString() ?? "";
    const listing: SavedListing = {
      id: `user_${Date.now()}`,
      region: form.region,
      kwh: kwhNum,
      co2: parseFloat(co2Tonnes.toFixed(4)),
      price: parseFloat(price.toFixed(2)),
      seller: walletStr
        ? `${walletStr.slice(0, 4)}...${walletStr.slice(-4)}`
        : "Unknown",
      sellerWallet: walletStr,
      renewable: form.renewable,
      verified: false,
      isNew: true,
      createdAt: Date.now(),
    };

    setTimeout(() => {
      const existing: SavedListing[] = JSON.parse(
        localStorage.getItem("subenergy_listings") || "[]"
      );
      localStorage.setItem(
        "subenergy_listings",
        JSON.stringify([listing, ...existing])
      );
      setSavedListing(listing);
      setSubmitting(false);
      setSubmitted(true);
    }, 2200);
  };

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  if (submitted && savedListing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="glass rounded-3xl p-12 text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle2 size={32} className="text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Listing Created!</h2>
            <p className="text-white/40 text-sm mb-6">
              Your {savedListing.kwh.toLocaleString()} kWh of{" "}
              {savedListing.renewable} energy from {savedListing.region} has
              been listed on the marketplace.
            </p>

            <div className="bg-teal-500/[0.05] border border-teal-500/[0.15] rounded-xl p-4 mb-8 text-left">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">
                Price Breakdown
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">kWh listed</span>
                  <span className="text-white font-medium">
                    {savedListing.kwh.toLocaleString()} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">CO₂ offset</span>
                  <span className="text-white font-medium">
                    {(savedListing.co2 * 1000).toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/[0.08] pt-2 mt-0.5">
                  <span className="text-teal-400">Total price</span>
                  <span className="text-teal-400 font-bold">
                    ${savedListing.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSavedListing(null);
                  setForm({
                    renewable: "Solar",
                    region: "Nigeria",
                    kwh: "",
                    description: "",
                  });
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/70 text-sm font-medium hover:bg-teal-500/[0.12] transition-all"
              >
                List Another
              </button>
              <button
                onClick={() => router.push("/marketplace")}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                View Market
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-white/40 hover:text-teal-400 text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Back to Marketplace
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            List Your Energy
          </h1>
          <p className="text-white/30 text-sm mt-1">
            Sell verified carbon offsets on the marketplace
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Energy type + region */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
                Energy Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Renewable Type
                  </label>
                  <select
                    value={form.renewable}
                    onChange={set("renewable")}
                    className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white text-sm focus:outline-none focus:border-teal-500/40 transition-all appearance-none cursor-pointer"
                  >
                    {renewableTypes.map((t) => (
                      <option key={t} value={t} className="bg-[#111827]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Region
                  </label>
                  <select
                    value={form.region}
                    onChange={set("region")}
                    className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white text-sm focus:outline-none focus:border-teal-500/40 transition-all appearance-none cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r} className="bg-[#111827]">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.10]">
                <Leaf size={12} className="text-teal-400 flex-shrink-0" />
                <span className="text-teal-400/70 text-xs">
                  Emission factor:{" "}
                  <strong className="text-teal-400">
                    {emissionFactor} kg CO₂/kWh
                  </strong>
                </span>
              </div>
            </div>

            {/* Quantity + auto-price */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
                Quantity
              </h2>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  kWh Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    min="1"
                    step="1"
                    value={form.kwh}
                    onChange={set("kwh")}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-xs">
                    kWh
                  </span>
                </div>
              </div>

              {kwhNum > 0 && (
                <div className="bg-teal-500/[0.05] border border-teal-500/[0.12] rounded-xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">
                    Auto-calculated price
                  </p>
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-white font-medium">
                      {kwhNum.toLocaleString()} kWh
                    </span>
                    <span className="text-white/30">→</span>
                    <span className="text-white font-medium">
                      {co2Kg.toFixed(1)} kg CO₂
                    </span>
                    <span className="text-white/30">→</span>
                    <span className="text-teal-400 font-bold">
                      ${price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-white/25 text-xs mt-2">
                    Price based on voluntary carbon market rate of $15/tonne CO₂
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
                Additional Info
              </h2>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Describe your energy source, installation details, or certification..."
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-teal-500/[0.05] border border-teal-500/[0.15]">
              <Shield size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
              <p className="text-teal-400/80 text-xs leading-relaxed">
                Listings are verified on-chain via Solana. Ensure your inverter
                is connected and production data is accurate before listing.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !form.kwh}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Create Listing
                  {price > 0 && ` — $${price.toFixed(2)}`}
                </>
              )}
            </button>
          </form>

          {/* Live preview */}
          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-5 sticky top-24">
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">
                Preview
              </p>

              <div className="glass rounded-xl p-4 border border-teal-500/[0.15]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Globe size={10} />
                    <span>{form.region}</span>
                  </div>
                  <div className="px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06]">
                    <span className="text-white/25 text-[10px]">Unverified</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/[0.08] border border-teal-500/[0.15] mb-3">
                  <Sun size={10} className="text-teal-400" />
                  <span className="text-teal-400/80 text-xs">
                    {form.renewable}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-teal-500/[0.04] rounded-lg p-2">
                    <p className="text-white text-sm font-bold">
                      {kwhNum > 0 ? kwhNum.toLocaleString() : "—"}
                    </p>
                    <p className="text-white/25 text-[10px]">kWh available</p>
                  </div>
                  <div className="bg-teal-500/[0.04] rounded-lg p-2">
                    <p className="text-white text-sm font-bold">
                      {co2Tonnes > 0 ? `${co2Tonnes.toFixed(3)}t` : "—"}
                    </p>
                    <p className="text-white/25 text-[10px]">CO₂ offset</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-400 font-bold">
                      {price > 0 ? `$${price.toFixed(2)}` : "—"}
                    </p>
                    <p className="text-white/25 text-[10px]">total value</p>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-xs font-semibold opacity-60">
                    Buy Offset
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30 flex items-center gap-1.5">
                    <Leaf size={11} />
                    CO₂ offset
                  </span>
                  <span className="text-teal-400 font-medium">
                    {co2Kg > 0 ? `${co2Kg.toFixed(1)} kg` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-white/[0.06] pt-2">
                  <span className="text-white/30">@ $15/tonne CO₂</span>
                  <span className="text-teal-400 font-bold">
                    {price > 0 ? `$${price.toFixed(2)}` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ListEnergyPage() {
  return (
    <WalletGuard>
      <ListEnergyContent />
    </WalletGuard>
  );
}
