"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Connect", href: "/connect" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Wallet", href: "/wallet" },
];

export function Navbar() {
  const pathname = usePathname();
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0F1A]/90 backdrop-blur-xl border-b border-teal-500/[0.08]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#10B981] flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow overflow-hidden">
              <Image src="/logo-mark.svg" alt="SubEnergy" width={20} height={20} />
            </div>
            <span className="font-semibold text-white tracking-tight">
              Sub<span className="text-teal-400">Energy</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-teal-500/10 text-teal-400"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet */}
          <div className="hidden md:flex items-center gap-3">
            {connected && publicKey ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-500/[0.06] border border-teal-500/[0.15] text-sm text-white/80 hover:bg-teal-500/[0.12] hover:text-white transition-all duration-200"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {truncate(publicKey.toBase58())}
                  <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass border border-teal-500/[0.15] overflow-hidden shadow-xl shadow-black/50">
                    <div className="p-1">
                      {navLinks.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-teal-500/[0.08] transition-all"
                        >
                          {l.label}
                        </Link>
                      ))}
                      <div className="my-1 border-t border-teal-500/[0.08]" />
                      <button
                        onClick={() => { disconnect(); setDropdownOpen(false); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setVisible(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-teal-500/20"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-teal-500/[0.08] transition-all"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-teal-500/[0.08] bg-[#0A0F1A]/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-teal-500/10 text-teal-400"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-teal-500/[0.08]">
              {connected && publicKey ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-white/60">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    {truncate(publicKey.toBase58())}
                  </div>
                  <button
                    onClick={() => { disconnect(); setMenuOpen(false); }}
                    className="px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 text-left transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setVisible(true); setMenuOpen(false); }}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-semibold"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
