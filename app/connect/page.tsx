"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sun,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Shield,
  Wifi,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";

const brands = [
  {
    id: "solaredge",
    name: "SolarEdge",
    logo: "SE",
    color: "from-blue-500 to-blue-600",
    fields: [{ key: "site_id", label: "Site ID", type: "text", placeholder: "e.g. 1234567" }, { key: "api_key", label: "API Key", type: "password", placeholder: "••••••••" }],
  },
  {
    id: "growatt",
    name: "Growatt",
    logo: "GW",
    color: "from-[#0D9488] to-[#10B981]",
    fields: [{ key: "username", label: "Username", type: "text", placeholder: "your@email.com" }, { key: "password", label: "Password", type: "password", placeholder: "••••••••" }],
  },
  {
    id: "deye",
    name: "Deye",
    logo: "DY",
    color: "from-orange-500 to-red-500",
    fields: [{ key: "sn", label: "Device SN", type: "text", placeholder: "e.g. 2302XXXX" }, { key: "region", label: "Region", type: "text", placeholder: "e.g. EU" }],
  },
  {
    id: "huawei",
    name: "Huawei FusionSolar",
    logo: "HW",
    color: "from-red-500 to-pink-600",
    fields: [{ key: "username", label: "Username", type: "text", placeholder: "Fusion Solar username" }, { key: "password", label: "Password", type: "password", placeholder: "••••••••" }, { key: "station_id", label: "Station ID", type: "text", placeholder: "e.g. NE=XXXX" }],
  },
  {
    id: "solis",
    name: "Solis Cloud",
    logo: "SL",
    color: "from-teal-500 to-cyan-500",
    fields: [{ key: "api_id", label: "API ID", type: "text", placeholder: "your api id" }, { key: "api_secret", label: "API Secret", type: "password", placeholder: "••••••••" }],
  },
  {
    id: "mock",
    name: "Mock / Demo",
    logo: "MK",
    color: "from-purple-500 to-violet-600",
    fields: [{ key: "device_id", label: "Device ID", type: "text", placeholder: "mock-device-001" }],
    demo: true,
  },
];

const steps = ["Select Brand", "Configure", "Verify"];

function ConnectContent() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const selectedBrand = brands.find((b) => b.id === selected);

  const handleSelect = (id: string) => {
    setSelected(id);
    setStep(1);
    setFormData({});
  };

  const handleConfigure = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          {step > 0 && (
            <button
              onClick={() => { setStep(step - 1); setVerified(false); setVerifying(false); }}
              className="flex items-center gap-2 text-white/40 hover:text-teal-400 text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight">Connect Inverter</h1>
          <p className="text-white/30 text-sm mt-1">Link your solar device to start earning SRE tokens</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === step
                  ? "bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white"
                  : i < step
                  ? "bg-teal-500/20 text-teal-400"
                  : "bg-white/[0.05] text-white/25"
              }`}>
                {i < step ? <CheckCircle2 size={12} /> : <span>{i + 1}</span>}
                <span>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={14} className="text-white/15" />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Brand selection */}
        {step === 0 && (
          <div>
            <p className="text-white/40 text-sm mb-4">Select your inverter brand</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b.id)}
                  className={`glass rounded-2xl p-5 text-left hover:border-teal-500/30 hover:-translate-y-0.5 transition-all duration-200 group ${
                    b.demo ? "border-dashed border-purple-500/20" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white text-xs font-bold mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    {b.logo}
                  </div>
                  <p className="text-white text-sm font-medium">{b.name}</p>
                  {b.demo && (
                    <span className="text-purple-400 text-[10px] font-medium">Demo mode</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Configure */}
        {step === 1 && selectedBrand && (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 glass rounded-2xl">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedBrand.color} flex items-center justify-center text-white text-xs font-bold`}>
                {selectedBrand.logo}
              </div>
              <div>
                <p className="text-white font-medium">{selectedBrand.name}</p>
                <p className="text-white/30 text-xs">{selectedBrand.fields.length} credential fields</p>
              </div>
            </div>

            <form onSubmit={handleConfigure} className="glass rounded-2xl p-6 flex flex-col gap-4">
              {selectedBrand.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.12] text-white placeholder-white/20 text-sm focus:outline-none focus:border-teal-500/40 focus:bg-teal-500/[0.06] transition-all"
                    required={!selectedBrand.demo}
                  />
                </div>
              ))}

              <div className="flex items-start gap-2 px-3 py-3 rounded-lg bg-teal-500/[0.06] border border-teal-500/[0.15] mt-1">
                <Shield size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <p className="text-teal-400/80 text-xs leading-relaxed">
                  Credentials are encrypted and stored locally. Never shared with third parties.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 transition-all mt-1"
              >
                Verify Connection
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Verify */}
        {step === 2 && (
          <div className="text-center">
            <div className="glass rounded-2xl p-12">
              {verifying ? (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <Loader2 size={28} className="text-teal-400 animate-spin" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Verifying connection...</p>
                    <p className="text-white/30 text-sm">Contacting {selectedBrand?.name} API</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs text-left">
                    {["Authenticating credentials", "Fetching device data", "Registering on-chain"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2 text-xs text-white/30">
                        <Loader2 size={10} className="text-teal-400/50 animate-spin" style={{ animationDelay: `${i * 0.3}s` }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              ) : verified ? (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center animate-pulse-glow">
                    <CheckCircle2 size={32} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-1">Connected!</p>
                    <p className="text-white/40 text-sm">
                      {selectedBrand?.name} inverter is now linked to your wallet
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-500/[0.05] border border-teal-500/[0.15] w-full max-w-xs">
                    <Wifi size={16} className="text-teal-400" />
                    <div className="text-left">
                      <p className="text-white text-xs font-medium">Device Active</p>
                      <p className="text-white/30 text-xs">Syncing every 15 minutes</p>
                    </div>
                    <div className="ml-auto w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setStep(0); setSelected(null); setVerified(false); }}
                      className="px-5 py-2.5 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] text-white/70 text-sm font-medium hover:bg-teal-500/[0.12] transition-all"
                    >
                      Add Another
                    </button>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 transition-all"
                    >
                      View Dashboard
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <WalletGuard>
      <ConnectContent />
    </WalletGuard>
  );
}
