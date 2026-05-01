"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Zap,
  ShoppingCart,
  Building2,
  Cpu,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { SolanaProviders } from "@/app/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Energy", href: "/admin/energy", icon: Zap },
  { label: "Marketplace", href: "/admin/marketplace", icon: ShoppingCart },
  { label: "ESG Buyers", href: "/admin/esg-buyers", icon: Building2 },
  { label: "Inverters", href: "/admin/inverters", icon: Cpu },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#080D18] border-r border-teal-500/[0.1] flex flex-col z-40">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-teal-500/[0.08]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg overflow-hidden shadow-lg shadow-teal-500/20 flex-shrink-0">
            <Image src="/logo.jpg" alt="SubEnergy" width={28} height={28} className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">
            Sub<span className="text-teal-400">Energy</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-teal-500/[0.06] border border-teal-500/[0.12]">
          <Shield size={10} className="text-teal-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-400">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-teal-500/[0.12] text-teal-400 border border-teal-500/[0.18]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={15} className={active ? "text-teal-400" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to app */}
      <div className="px-3 py-4 border-t border-teal-500/[0.08]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft size={14} />
          Back to App
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: "#0A0F1A", color: "#F9FAFB" }}>
        <ErrorBoundary>
          <SolanaProviders>
            <div className="flex min-h-screen">
              <AdminSidebar />
              <main className="flex-1 ml-56 min-h-screen overflow-x-hidden">
                {children}
              </main>
            </div>
          </SolanaProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
