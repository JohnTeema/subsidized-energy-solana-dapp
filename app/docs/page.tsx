import Link from "next/link";
import {
  FileText,
  BookOpen,
  Cpu,
  GitBranch,
  ExternalLink,

  Zap,
  Sun,
  Globe,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PROGRAM_IDS, EXPLORER_BASE } from "@/lib/constants";

const DRIVE_URL =
  "https://docs.google.com/document/d/1QkaYNimygDPkwlc3Tn1EJYRujpmBRQBWCx-w10zUPLA/edit?tab=t.0";

const contracts = [
  {
    label: "SUB Token",
    address: PROGRAM_IDS.SUB_TOKEN,
    icon: <Zap size={14} />,
    description: "Governance & utility token",
  },
  {
    label: "SRE Token",
    address: PROGRAM_IDS.SRE_TOKEN,
    icon: <Sun size={14} />,
    description: "Subsidized Renewable Energy",
  },
  {
    label: "Energy Registry",
    address: PROGRAM_IDS.ENERGY_REGISTRY,
    icon: <Globe size={14} />,
    description: "On-chain production records",
  },
  {
    label: "Marketplace",
    address: PROGRAM_IDS.MARKETPLACE,
    icon: <ShoppingBag size={14} />,
    description: "SRE credit exchange",
  },
];

const repos = [
  {
    label: "Smart Contracts",
    href: "https://github.com/JohnTeema/subsidized-energy-solana",
    desc: "Anchor programs · Solana",
  },
  {
    label: "Frontend",
    href: "https://github.com/JohnTeema/subsidized-energy-solana-dapp",
    desc: "Next.js · This dApp",
  },
  {
    label: "Backend",
    href: "https://github.com/JohnTeema/subsidized-energy-backend",
    desc: "API · Inverter bridge",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-500/[0.05] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Frontier Hackathon 2025
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Documentation &amp; Resources
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
            Everything you need to understand the Subsidized Energy protocol
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-20">
        <div className="flex flex-col gap-6">

          {/* Whitepaper */}
          <DocCard
            icon={<FileText size={20} />}
            title="Whitepaper"
            badge="PDF"
          >
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              The complete technical whitepaper covering the protocol architecture, token
              economics, and ESG marketplace design.
            </p>
            <ExternalButton href={DRIVE_URL} label="Read Whitepaper" primary />
          </DocCard>

          {/* PRD */}
          <DocCard
            icon={<BookOpen size={20} />}
            title="Product Requirements"
            badge="PRD"
          >
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Detailed product requirements document covering all features, specifications,
              and implementation guidelines.
            </p>
            <ExternalButton href={DRIVE_URL} label="Read PRD" primary />
          </DocCard>

          {/* Architecture */}
          <DocCard
            icon={<Cpu size={20} />}
            title="Technical Architecture"
            badge="Spec"
          >
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Complete system architecture, smart contract design, inverter API integration,
              and deployment specifications.
            </p>
            <ExternalButton href={DRIVE_URL} label="Read Architecture Doc" primary />
          </DocCard>

          {/* GitHub */}
          <DocCard
            icon={<GitBranch size={20} />}
            title="GitHub"
            badge="Open Source"
          >
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Explore the open-source codebase — smart contracts, frontend, and backend.
            </p>
            <div className="flex flex-wrap gap-3">
              {repos.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] hover:bg-teal-500/[0.12] hover:border-teal-500/30 transition-all"
                >
                  <GitBranch size={14} className="text-teal-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium leading-none">{r.label}</p>
                    <p className="text-white/30 text-xs mt-0.5">{r.desc}</p>
                  </div>
                  <ArrowUpRight size={13} className="text-white/20 group-hover:text-teal-400 transition-colors flex-shrink-0 ml-1" />
                </a>
              ))}
            </div>
          </DocCard>

          {/* Contract Addresses */}
          <DocCard
            icon={<Globe size={20} />}
            title="Contract Addresses"
            badge="Devnet"
          >
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              All program addresses are deployed on Solana Devnet. Click any address to
              inspect it on Solana Explorer.
            </p>
            <div className="flex flex-col gap-3">
              {contracts.map((c) => (
                <ContractRow key={c.label} {...c} />
              ))}
            </div>
          </DocCard>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Sub-components (server-safe, no "use client") ── */

function DocCard({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6 sm:p-8 hover:border-teal-500/25 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
            {icon}
          </div>
          <h2 className="text-white font-semibold text-lg">{title}</h2>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/15 text-teal-400 text-xs font-medium flex-shrink-0">
          {badge}
        </span>
      </div>
      {children}
    </div>
  );
}

function ExternalButton({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 ${
        primary
          ? "bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white shadow-lg shadow-teal-500/20"
          : "bg-teal-500/[0.08] border border-teal-500/[0.2] text-teal-400 hover:bg-teal-500/[0.14]"
      }`}
    >
      {label}
      <ExternalLink size={13} />
    </a>
  );
}

function ContractRow({
  label,
  address,
  icon,
  description,
}: {
  label: string;
  address: string;
  icon: React.ReactNode;
  description: string;
}) {
  const explorerUrl = `${EXPLORER_BASE}/address/${address}?cluster=devnet`;
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-teal-500/[0.03] border border-teal-500/[0.10] hover:bg-teal-500/[0.06] hover:border-teal-500/20 transition-all group">
      <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/15 flex items-center justify-center text-teal-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-white text-sm font-medium">{label}</p>
          <span className="text-white/25 text-xs hidden sm:inline">·</span>
          <span className="text-white/30 text-xs hidden sm:inline">{description}</span>
        </div>
        <p className="text-white/35 text-xs font-mono truncate">{address}</p>
      </div>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View on Solana Explorer"
        className="p-2 rounded-lg text-white/20 hover:text-teal-400 hover:bg-teal-500/[0.08] transition-all flex-shrink-0"
      >
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
