"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";
import { Footer } from "@/components/Footer";

const industries = [
  "Energy",
  "Finance",
  "Technology",
  "Manufacturing",
  "Agriculture",
  "Other",
];

const countries = [
  "Nigeria",
  "United States",
  "India",
  "Germany",
  "China",
  "South Africa",
  "Brazil",
  "United Kingdom",
  "France",
  "Canada",
  "Australia",
  "Other",
];

interface EsgRegistration {
  walletAddress: string;
  orgName: string;
  registrationNumber: string;
  country: string;
  industry: string;
  contactEmail: string;
  annualTarget: number | null;
  registeredAt: number;
}

function RegisterContent() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [form, setForm] = useState({
    orgName: "",
    registrationNumber: "",
    country: "Nigeria",
    industry: "Energy",
    email: "",
    annualTarget: "",
    terms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const registration: EsgRegistration = {
        walletAddress: publicKey?.toString() ?? "",
        orgName: form.orgName,
        registrationNumber: form.registrationNumber,
        country: form.country,
        industry: form.industry,
        contactEmail: form.email,
        annualTarget: form.annualTarget ? parseFloat(form.annualTarget) : null,
        registeredAt: Date.now(),
      };

      const existing: EsgRegistration[] = JSON.parse(
        localStorage.getItem("subenergy_esg_registrations") || "[]"
      );
      const filtered = existing.filter(
        (r) => r.walletAddress !== registration.walletAddress
      );
      localStorage.setItem(
        "subenergy_esg_registrations",
        JSON.stringify([registration, ...filtered])
      );

      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  const set =
    (k: keyof Omit<typeof form, "terms">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
            <h2 className="text-2xl font-bold text-white mb-2">
              Organization Registered!
            </h2>
            <p className="text-white/40 text-sm mb-8">
              <strong className="text-white">{form.orgName}</strong> is now
              authorized to purchase carbon offsets on the SubEnergy marketplace.
            </p>
            <button
              onClick={() => router.push("/marketplace")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold hover:opacity-90 transition-all"
            >
              Go to Marketplace
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-white/40 hover:text-teal-400 text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Back to Marketplace
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Register Your Organization
          </h1>
          <p className="text-white/30 text-sm mt-1">
            ESG companies must register before purchasing carbon offsets
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Organization details */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
              Organization Details
            </h2>

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Organization Name *
              </label>
              <input
                type="text"
                placeholder="Acme Energy Corp"
                value={form.orgName}
                onChange={set("orgName")}
                required
                className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Registration Number / Company ID *
              </label>
              <input
                type="text"
                placeholder="RC-123456"
                value={form.registrationNumber}
                onChange={set("registrationNumber")}
                required
                className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={set("country")}
                  className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white text-sm focus:outline-none focus:border-teal-500/40 transition-all appearance-none cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#111827]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                  Industry
                </label>
                <select
                  value={form.industry}
                  onChange={set("industry")}
                  className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white text-sm focus:outline-none focus:border-teal-500/40 transition-all appearance-none cursor-pointer"
                >
                  {industries.map((i) => (
                    <option key={i} value={i} className="bg-[#111827]">
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ESG details */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
              ESG Details
            </h2>

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                ESG Contact Email *
              </label>
              <input
                type="email"
                placeholder="esg@company.com"
                value={form.email}
                onChange={set("email")}
                required
                className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Annual Carbon Offset Target (tonnes CO₂, optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 10000"
                min="0"
                value={form.annualTarget}
                onChange={set("annualTarget")}
                className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                Wallet Address (auto-filled)
              </label>
              <input
                type="text"
                value={publicKey?.toString() ?? "Not connected"}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.08] text-white/40 text-sm cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-teal-500/[0.05] border border-teal-500/[0.15]">
            <input
              type="checkbox"
              id="terms"
              checked={form.terms}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, terms: e.target.checked }))
              }
              required
              className="mt-0.5 accent-teal-500 flex-shrink-0 w-4 h-4"
            />
            <label
              htmlFor="terms"
              className="text-white/50 text-xs leading-relaxed cursor-pointer"
            >
              I confirm this organization is registered and authorized to
              purchase carbon offsets
            </label>
          </div>

          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Shield size={14} className="text-white/30 mt-0.5 flex-shrink-0" />
            <p className="text-white/30 text-xs leading-relaxed">
              Registration data is stored locally and linked to your wallet
              address. Only registered organizations can purchase carbon offsets
              on the marketplace.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.terms}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Building2 size={16} />
                Register Organization
              </>
            )}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <WalletGuard>
      <RegisterContent />
    </WalletGuard>
  );
}
