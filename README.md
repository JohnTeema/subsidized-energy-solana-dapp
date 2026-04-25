<div align="center">

<img src="public/logo-full.svg" alt="SubEnergy" height="60" />

# SubEnergy — Solar Energy on Solana

**Decentralized subsidized energy marketplace built on Solana**

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=flat)](LICENSE)

[Live App](https://subenergy.app) · [Smart Contracts](https://github.com/JohnTeema/subsidized-energy-solana) · [Backend API](https://github.com/JohnTeema/subsidized-energy-backend)

</div>

---

## Overview

SubEnergy is a Solana-powered dApp that enables solar energy producers to tokenize their output and sell subsidized energy credits directly to consumers — eliminating middlemen and reducing energy costs through on-chain transparency.

Submitted to **Solana Frontier Hackathon 2025**.

Key flows:

- **Producers** register solar installations and mint **SRE** (Solar Renewable Energy) tokens backed by real kWh output
- **Consumers** purchase subsidized energy at below-market rates using **SUB** tokens
- All transactions settle on Solana with near-zero fees and sub-second finality

---

## Live Demo

**[https://subenergy.app](https://subenergy.app)**

Connect any Solana wallet (Phantom, Backpack, Solflare) on **Devnet** to explore the full app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Wallet | `@solana/wallet-adapter-react` |
| Blockchain | Solana Web3.js v1 |
| Backend | Railway (Node.js REST API) |
| Deployment | Vercel |

---

## On-Chain Program IDs (Devnet)

| Program | Address |
|---|---|
| SUB Token | `CRHuFAkCseXnvYy6HLUqky9GrPj5Livg64qodmPFFEpe` |
| SRE Token | `HMcX5TQ7fFTr6JzLnMQySTUch7qw4saQHL5BBXxioMea` |
| Energy Registry | `E93p3yX6mxswv1yBn6gcZvsPCqckyupUVQKuk6YLNyYR` |
| Marketplace | `D5BHn2yCxj4DPrR7HrhoegqCketYNx9DWvHNLVFaaGez` |

Anchor source and IDL: [subsidized-energy-solana](https://github.com/JohnTeema/subsidized-energy-solana)

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing — hero, live network stats, how-it-works |
| `/dashboard` | Producer dashboard with kWh charts and token balances |
| `/marketplace` | Browse and purchase energy listings |
| `/marketplace/register` | Register a new solar installation |
| `/marketplace/list` | List energy for sale |
| `/connect` | Wallet connection entry point |
| `/wallet` | Token balances and transaction history |
| `/docs` | Architecture docs, whitepaper, and contract addresses |

---

## Screenshots

> The app uses a dark amber design system — `#0A0A0A` background with gold/amber (`#F59E0B`) accents, glassmorphism cards, and a canvas particle animation as the global background.

**Landing page** — animated hero with live network stats (total kWh, active producers, carbon offset) and count-up animations.

**Dashboard** — real-time energy production charts (daily/weekly), SUB/SRE token balances, and network share metrics.

**Marketplace** — regional energy listing cards with price-per-kWh, capacity, and one-click purchase flow.

---

## Local Setup

### Prerequisites

- Node.js 20+
- A Solana wallet browser extension (Phantom recommended)
- pnpm (or npm)

### Install

```bash
git clone https://github.com/JohnTeema/subsidized-energy-solana-dapp.git
cd subsidized-energy-solana-dapp
pnpm install
```

### Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://subsidized-energy-backend-production.up.railway.app
```

The app falls back to mock data automatically if the backend is unreachable.

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Switch your wallet to **Devnet** to interact with on-chain programs.

### Build

```bash
pnpm build
pnpm start
```

---

## Project Architecture

```
app/
├── page.tsx              # Landing
├── dashboard/            # Producer dashboard
├── marketplace/          # Listings + register + list flows
├── connect/              # Wallet entry
├── wallet/               # Token balances
└── docs/                 # Documentation hub

components/
├── Navbar.tsx            # Mobile-responsive nav
├── Footer.tsx
├── StatCard.tsx          # Animated metric cards
├── WalletGuard.tsx       # Auth protection wrapper
└── CanvasBackground.tsx  # Global particle animation

lib/
├── mockData.ts           # Fallback data for all pages
└── solana.ts             # Web3.js helpers
```

---

## Related Repositories

| Repo | Description |
|---|---|
| [subsidized-energy-solana](https://github.com/JohnTeema/subsidized-energy-solana) | Anchor smart contracts (SUB token, SRE token, registry, marketplace) |
| [subsidized-energy-dapp](https://github.com/JohnTeema/subsidized-energy-solana-dapp) | This repo — Next.js frontend |
| [subsidized-energy-backend](https://github.com/JohnTeema/subsidized-energy-backend) | Node.js API — inverter bridge and off-chain data |

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
Built for <strong>Solana Frontier Hackathon 2025</strong>
</div>
