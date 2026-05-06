"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Shield,
  Wifi,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { WalletGuard } from "@/components/WalletGuard";
import { Footer } from "@/components/Footer";
import { fetchBrands, testConnection, saveConnection, type InverterBrand } from "@/lib/api";
import { saveInverterConnection } from "@/lib/inverterConnection";
import { useAuth } from "@/lib/auth";

const STATIC_BRANDS: InverterBrand[] = [
  {
    id: "growatt",
    name: "Growatt",
    logo: "GW",
    color: "from-[#0D9488] to-[#10B981]",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "ShinePhone email" },
      { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "solaredge",
    name: "SolarEdge",
    logo: "SE",
    color: "from-blue-500 to-blue-600",
    fields: [
      { key: "siteId", label: "Site ID", type: "text", placeholder: "e.g. 1234567" },
      { key: "apiKey", label: "API Key", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "deye",
    name: "Deye / Solarman",
    logo: "DY",
    color: "from-orange-500 to-red-500",
    fields: [
      { key: "appId", label: "App ID", type: "text", placeholder: "Solarman App ID" },
      { key: "appSecret", label: "App Secret", type: "password", placeholder: "••••••••" },
      { key: "email", label: "Email", type: "text", placeholder: "your@email.com" },
      { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "huawei",
    name: "Huawei FusionSolar",
    logo: "HW",
    color: "from-red-500 to-pink-600",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "FusionSolar username" },
      { key: "systemCode", label: "System Code", type: "password", placeholder: "••••••••" },
    ],
  },
];

const steps = ["Select Brand", "Configure", "Verify"];

function ConnectContent() {
  const router = useRouter();
  const { accountAddress, authMethod, token } = useAuth();
  const mountedRef = useRef(true);

  const [brands, setBrands] = useState<InverterBrand[]>(STATIC_BRANDS);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    fetchBrands()
      .then((data) => {
        if (mountedRef.current && Array.isArray(data) && data.length > 0) {
          setBrands(data);
        }
      })
      .catch(() => {/* use static fallback already set */});
    return () => { mountedRef.current = false; };
  }, []);

  const selectedBrand = brands.find((b) => b.id === selected);

  const handleSelect = (id: string) => {
    setSelected(id);
    setStep(1);
    setFormData({});
    setError(null);
  };

  const handleConfigure = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "wallet" && !token) {
      setError("Finishing wallet sign-in. Please wait a moment and try again.");
      return;
    }
    setStep(2);
    setVerifying(true);
    setError(null);

    const wallet = accountAddress;
    testConnection({ brand: selected ?? "", credentials: formData, wallet })
      .then((result) => {
        if (!mountedRef.current) return;
        if (result.success) {
          return saveConnection({ brand: selected ?? "", credentials: formData, wallet }).then(() => {
            if (!mountedRef.current) return;
            if (wallet) {
              saveInverterConnection({
                walletAddress: wallet,
                brandId: selected ?? "",
                brandName: selectedBrand?.name ?? selected ?? "Inverter",
                connectedAt: Date.now(),
                demo: selectedBrand?.demo,
              });
            }
            setVerifying(false);
            setVerified(true);
          });
        } else {
          setVerifying(false);
          setError(result.message ?? "Connection failed. Check your credentials.");
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        setVerifying(false);
        setError(err instanceof Error ? err.message : "Connection failed. Check your credentials and try again.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Success Modal */}
      {verified && !verifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl p-10 max-w-sm w-full text-center border border-teal-500/20 shadow-2xl shadow-teal-500/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle2 size={48} className="text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Congratulations! 🎉</h2>
            <p className="text-white/70 mb-1">
              Your <span className="text-teal-400 font-medium">{selectedBrand?.name}</span> inverter is connected and verified
            </p>
            <p className="text-white/50 text-sm mb-8">
              You've earned 3 SRE Points as a welcome bonus!
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white font-semibold text-sm hover:opacity-90 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          {step > 0 && (
            <button
              onClick={() => { setStep(step - 1); setVerified(false); setVerifying(false); setError(null); }}
              className="flex items-center gap-2 text-white/40 hover:text-teal-400 text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight">Connect Inverter</h1>
          <p className="text-white/30 text-sm mt-1">Link your solar device to start earning SRE Points</p>
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
              ) : error ? (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <XCircle size={32} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-1">Connection failed</p>
                    <p className="text-white/40 text-sm max-w-xs">{error}</p>
                  </div>
                  <button
                    onClick={() => { setStep(1); setError(null); }}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-white/70 text-sm font-medium hover:bg-white/[0.10] transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : verified ? (
                // This content is now hidden behind the modal; keep empty to avoid flash
                <div className="hidden" />
              ) : null}
            </div>
          </div>
        )}
      </div>
      <Footer />
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
