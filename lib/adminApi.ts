"use client";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type DataSource = "live" | "offline";

export interface AdminResult<T> {
  data: T;
  source: DataSource;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  wallet: string;
  registeredAt: string;
  verified: boolean;
  inverterBrand: string | null;
  kWhProduced: number;
  subBalance: number;
  sreBalance: number;
  lastActive: string;
}

export interface EnergyReading {
  id: string;
  producer: string;
  producerWallet: string;
  date: string;
  kWh: number;
  co2Offset: number;
  subMinted: number;
  status: "verified" | "flagged" | "pending";
  inverterBrand: string;
}

export interface MarketplaceListing {
  id: string;
  producer: string;
  producerWallet: string;
  kWh: number;
  co2: number;
  price: number;
  pricePerTonne: number;
  status: "active" | "sold" | "cancelled";
  listedAt: string;
}

export interface MarketplacePurchase {
  id: string;
  buyerOrg: string;
  listingId: string;
  kWh: number;
  amountPaid: number;
  subBurned: number;
  date: string;
}

export interface EsgBuyer {
  id: string;
  orgName: string;
  companyId: string;
  country: string;
  industry: string;
  wallet: string;
  registeredAt: string;
  totalOffsets: number;
}

export interface AdminInverter {
  id: string;
  userWallet: string;
  userEmail: string | null;
  brand: string;
  status: "active" | "disconnected" | "error";
  lastPoll: string;
  totalKWh: number;
  connectedAt: string;
}

export interface OverviewStats {
  totalUsers: number;
  totalInverters: number;
  subMintedToday: number;
  subMintedWeek: number;
  subMintedAllTime: number;
  sreDistributed: number;
  marketplaceTransactions: number;
  revenueUsdc: number;
  activeProducers24h: number;
}

export interface DailyPoint {
  date: string;
  value: number;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function adminFetch<T>(path: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 404 || res.status === 405) return null;
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Zero-state fallback ──────────────────────────────────────────────────────

const ZERO_STATS: OverviewStats = {
  totalUsers: 0,
  totalInverters: 0,
  subMintedToday: 0,
  subMintedWeek: 0,
  subMintedAllTime: 0,
  sreDistributed: 0,
  marketplaceTransactions: 0,
  revenueUsdc: 0,
  activeProducers24h: 0,
};

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchAdminStats(token: string): Promise<AdminResult<OverviewStats>> {
  const live = await adminFetch<OverviewStats>("/api/admin/stats", token);
  if (live) return { data: live, source: "live" };
  return { data: ZERO_STATS, source: "offline" };
}

export async function fetchAdminUsers(token: string): Promise<AdminResult<AdminUser[]>> {
  const live = await adminFetch<AdminUser[]>("/api/admin/users", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminEnergy(token: string): Promise<AdminResult<EnergyReading[]>> {
  const live = await adminFetch<EnergyReading[]>("/api/admin/energy", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminListings(token: string): Promise<AdminResult<MarketplaceListing[]>> {
  const live = await adminFetch<MarketplaceListing[]>("/api/admin/marketplace/listings", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminPurchases(token: string): Promise<AdminResult<MarketplacePurchase[]>> {
  const live = await adminFetch<MarketplacePurchase[]>("/api/admin/marketplace/purchases", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminEsgBuyers(token: string): Promise<AdminResult<EsgBuyer[]>> {
  const live = await adminFetch<EsgBuyer[]>("/api/admin/esg-buyers", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminInverters(token: string): Promise<AdminResult<AdminInverter[]>> {
  const live = await adminFetch<AdminInverter[]>("/api/admin/inverters", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminRegistrationsChart(token: string): Promise<DailyPoint[]> {
  const live = await adminFetch<DailyPoint[]>("/api/admin/charts/registrations", token);
  if (live && Array.isArray(live)) return live;
  return [];
}

export async function fetchAdminEnergyChart(token: string): Promise<DailyPoint[]> {
  const live = await adminFetch<DailyPoint[]>("/api/admin/charts/energy", token);
  if (live && Array.isArray(live)) return live;
  return [];
}

export async function fetchAdminVolumeChart(token: string): Promise<DailyPoint[]> {
  const live = await adminFetch<DailyPoint[]>("/api/admin/charts/volume", token);
  if (live && Array.isArray(live)) return live;
  return [];
}
