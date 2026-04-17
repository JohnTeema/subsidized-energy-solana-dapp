"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Globe,
  DollarSign,
  CheckCircle2,
  Loader2,
  Shield,
  Info,
  Sun,
  Leaf,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";
import { Footer } from "@/components/Footer";

const renewableTypes = ["Solar", "Wind", "Hydro", "Geothermal", "Biomass"];
const regions = ["US", "EU", "Australia", "India", "Canada", "China", "Africa", "South America"];

function ListEnergyContent() {
  const router = useRouter();
  const [form, setForm] = useState({
    renewable: "Solar",
    region: "US",
    kwh: "",
    price: "",
    description: "",
    co2Factor: "0.45",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const co2Offset = form.kwh
    ? (parseFloat(form.kwh) * parseFloat(form.co2Factor || "0") / 1000).toFixed(3)
    : "0";
  const totalValue = form.kwh && form.price
    ? (parseFloat(form.kwh) * parseFloat(form.price)).toFixed(2)
    : "0.00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2200);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="glass rounded-3xl p-12 text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle2 size={32} className="text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Listing Created!</h2>
            <p className="text-white/40 text-sm mb-2">
              Your {form.kwh} kWh of {form.renewable} energy from {form.region} has been listed on the marketplace.
            </p>
            <p className="text-white/25 text-xs mb-8">Pending on-chain verification · Devnet</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-teal-500/[0.05] border border-teal-500/[0.15] rounded-xl p-3">
                <p className="text-teal-400 font-bold text-lg">{form.kwh}</p>
                <p className="text-white/30 text-xs">kWh listed</p>
              </div>
              <div className="bg-teal-500/[0.05] border border-teal-500/[0.15] rounded-xl p-3">
                <p className="text-teal-400 font-bold text-lg">${totalValue}</p>
                <p className="text-white/30 text-xs">total value</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setSubmitted(false); setForm({ renewable: "Solar", region: "US", kwh: "", price: "", description: "", co2Factor: "0.45" }); }}
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
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-white/40 hover:text-teal-400 text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Back to Marketplace
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">List Your Energy</h1>
          <p className="text-white/30 text-sm mt-1">Sell verified $SUB tokens on the marketplace</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-5">

            {/* Energy type + region */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Energy Details</h2>

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
                      <option key={t} value={t} className="bg-[#111827]">{t}</option>
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
                      <option key={r} value={r} className="bg-[#111827]">{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quantity + pricing */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Quantity & Pricing</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    kWh Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      min="1"
                      step="1"
                      value={form.kwh}
                      onChange={set("kwh")}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-xs">kWh</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Price per kWh ($SUB)
                  </label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="number"
                      placeholder="0.09"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={set("price")}
                      required
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  CO₂ Factor (kg/kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.45"
                    min="0.01"
                    step="0.01"
                    value={form.co2Factor}
                    onChange={set("co2Factor")}
                    className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
                  />
                </div>
                <p className="text-white/20 text-xs mt-1">Grid average: 0.45 kg CO₂/kWh · Solar typical: 0.02–0.05</p>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Additional Info</h2>
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

            {/* Security note */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-teal-500/[0.05] border border-teal-500/[0.15]">
              <Shield size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
              <p className="text-teal-400/80 text-xs leading-relaxed">
                Listings are verified on-chain via Solana. Ensure your inverter is connected and production data is accurate before listing.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" />Creating Listing...</>
              ) : (
                <><Zap size={16} />Create Listing</>
              )}
            </button>
          </form>

          {/* Live preview */}
          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-5 sticky top-24">
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">Preview</p>

              {/* Listing card preview */}
              <div className="glass rounded-xl p-4 border border-teal-500/[0.15]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Globe size={10} />
                    <span>{form.region || "Region"}</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                    <CheckCircle2 size={8} className="text-teal-400" />
                    <span className="text-teal-400 text-[10px] font-medium">Verified</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-500/[0.08] border border-teal-500/[0.15] mb-3">
                  <Sun size={10} className="text-teal-400" />
                  <span className="text-teal-400/80 text-xs">{form.renewable}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-teal-500/[0.04] rounded-lg p-2">
                    <p className="text-white text-sm font-bold">{form.kwh ? parseFloat(form.kwh).toLocaleString() : "—"}</p>
                    <p className="text-white/25 text-[10px]">kWh available</p>
                  </div>
                  <div className="bg-teal-500/[0.04] rounded-lg p-2">
                    <p className="text-white text-sm font-bold">{parseFloat(co2Offset) > 0 ? `${co2Offset}t` : "—"}</p>
                    <p className="text-white/25 text-[10px]">CO₂ offset</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-400 font-bold">{form.price ? `$${parseFloat(form.price).toFixed(2)}` : "—"}</p>
                    <p className="text-white/25 text-[10px]">per kWh</p>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-xs font-semibold opacity-60">
                    Buy Offset
                  </div>
                </div>
              </div>

              {/* Summary stats */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30 flex items-center gap-1.5"><Leaf size={11} />CO₂ Offset</span>
                  <span className="text-teal-400 font-medium">{co2Offset}t</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30 flex items-center gap-1.5"><DollarSign size={11} />Total Value</span>
                  <span className="text-teal-400 font-medium">${totalValue}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30 flex items-center gap-1.5"><Info size={11} />Platform fee</span>
                  <span className="text-white/40">2.5%</span>
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
