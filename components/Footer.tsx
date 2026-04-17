import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-teal-500/[0.08] py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Image src="/logo-full.svg" alt="Subsidized Energy" width={160} height={32} />
            <p className="text-white/25 text-xs">© 2026 Subsidized Energy. All rights reserved.</p>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-white/35 text-sm">
            <Link href="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link>
            <Link href="/connect" className="hover:text-teal-400 transition-colors">Connect</Link>
            <Link href="/marketplace" className="hover:text-teal-400 transition-colors">Marketplace</Link>
            <Link href="/wallet" className="hover:text-teal-400 transition-colors">Wallet</Link>
          </div>

          {/* Powered by Solana */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/[0.05] border border-teal-500/[0.10]">
              <div className="w-4 h-4 rounded-full bg-[#9945FF] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/80" />
              </div>
              <span className="text-white/35 text-xs font-medium">Powered by Solana</span>
            </div>
            <a
              href="https://github.com/JohnTeema/subsidized-energy-solana-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-white/25 hover:text-teal-400 hover:bg-teal-500/[0.06] transition-all text-xs font-mono border border-teal-500/[0.08]"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
