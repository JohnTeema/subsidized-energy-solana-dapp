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
  totalKwhProduced: number;
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
  totalKwhProduced: 0,
  subMintedToday: 0,
  subMintedWeek: 0,
  subMintedAllTime: 0,
  sreDistributed: 0,
  marketplaceTransactions: 0,
  revenueUsdc: 0,
  activeProducers24h: 0,
};

// ─── API functions ────────────────────────────────────────────────────────────

// Backend field names differ from the OverviewStats type — map explicitly.
interface BackendStats {
  totalUsers?: number;
  totalVerifiedUsers?: number;
  totalInverterConnections?: number;
  activeInverters?: number;
  totalEnergyReadings?: number;
  totalKwhProduced?: number;
  totalSrePointsDistributed?: number;
  invertersByBrand?: { brand: string; count: number }[];
}

export async function fetchAdminStats(token: string): Promise<AdminResult<OverviewStats>> {
  const raw = await adminFetch<BackendStats>("/api/admin/stats", token);
  console.log("[admin] /api/admin/stats raw response:", raw);
  if (raw) {
    let sreDistributed = raw.totalSrePointsDistributed ?? 0;

    // Fallback: sum srePoints from users if stats doesn't include it
    if (!sreDistributed) {
      const usersRaw = await adminFetch<{ users: BackendUser[] }>("/api/admin/users", token);
      if (usersRaw?.users) {
        sreDistributed = usersRaw.users.reduce((sum, u) => sum + (u.srePoints ?? 0), 0);
      }
    }

    const data: OverviewStats = {
      totalUsers: raw.totalUsers ?? 0,
      totalInverters: raw.totalInverterConnections ?? 0,
      activeProducers24h: raw.activeInverters ?? 0,
      totalKwhProduced: raw.totalKwhProduced ?? 0,
      subMintedToday: 0,
      subMintedWeek: 0,
      subMintedAllTime: 0,
      sreDistributed,
      marketplaceTransactions: 0,
      revenueUsdc: 0,
    };
    return { data, source: "live" };
  }
  return { data: ZERO_STATS, source: "offline" };
}

interface BackendUser {
  id: string;
  email: string;
  walletAddress: string;
  emailVerified: boolean;
  createdAt: string;
  srePoints?: number;
  inverters: { id: string; inverterId: string; brand: string; isActive: boolean; createdAt: string }[];
}

export async function fetchAdminUsers(token: string): Promise<AdminResult<AdminUser[]>> {
  const raw = await adminFetch<{ users: BackendUser[]; total: number }>("/api/admin/users", token);
  console.log("[admin] /api/admin/users raw response:", raw);
  if (raw?.users && Array.isArray(raw.users)) {
    const data: AdminUser[] = raw.users.map((u) => ({
      id: u.id,
      email: u.email,
      wallet: u.walletAddress,
      registeredAt: u.createdAt,
      verified: u.emailVerified,
      inverterBrand: u.inverters[0]?.brand ?? null,
      kWhProduced: 0,
      subBalance: 0,
      sreBalance: u.srePoints ?? 0,
      lastActive: u.createdAt,
    }));
    return { data, source: "live" };
  }
  return { data: [], source: "offline" };
}

interface BackendEnergyResponse {
  readings: EnergyReading[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export async function fetchAdminEnergy(token: string): Promise<AdminResult<EnergyReading[]>> {
  const raw = await adminFetch<BackendEnergyResponse>("/api/admin/energy", token);
  console.log("[admin] /api/admin/energy raw response:", raw);
  if (raw?.readings && Array.isArray(raw.readings)) {
    return { data: raw.readings, source: "live" };
  }
  return { data: [], source: "offline" };
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalPurchases: number;
  totalVolume: number;
  totalCo2: number;
  avgCo2Price: number;
}

type Envelope<T> = T | { listings?: T; purchases?: T; buyers?: T; data?: T };

function unwrapArray<T>(raw: Envelope<T[]> | null, key?: keyof { listings: T[]; purchases: T[]; buyers: T[]; data: T[] }): T[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  if (key && Array.isArray((raw as Record<string, unknown>)[key as string])) return (raw as Record<string, unknown>)[key as string] as T[];
  if (Array.isArray((raw as Record<string, unknown>).data)) return (raw as Record<string, unknown>).data as T[];
  return null;
}

export async function fetchAdminListings(token: string): Promise<AdminResult<MarketplaceListing[]>> {
  const raw = await adminFetch<Envelope<MarketplaceListing[]>>("/api/admin/marketplace/listings", token);
  const data = unwrapArray<MarketplaceListing>(raw, "listings");
  if (data) return { data, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminPurchases(token: string): Promise<AdminResult<MarketplacePurchase[]>> {
  const raw = await adminFetch<Envelope<MarketplacePurchase[]>>("/api/admin/marketplace/purchases", token);
  const data = unwrapArray<MarketplacePurchase>(raw, "purchases");
  if (data) return { data, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchAdminEsgBuyers(token: string): Promise<AdminResult<EsgBuyer[]>> {
  const raw = await adminFetch<Envelope<EsgBuyer[]>>("/api/admin/esg-buyers", token);
  const data = unwrapArray<EsgBuyer>(raw, "buyers");
  if (data) return { data, source: "live" };
  return { data: [], source: "offline" };
}

export async function fetchMarketplaceStats(token: string): Promise<AdminResult<MarketplaceStats | null>> {
  const raw = await adminFetch<Record<string, unknown>>("/api/marketplace/stats", token);
  if (!raw) return { data: null, source: "offline" };
  const stats: MarketplaceStats = {
    totalListings: Number(raw.totalListings ?? raw.total_listings ?? 0),
    activeListings: Number(raw.activeListings ?? raw.active_listings ?? 0),
    totalPurchases: Number(raw.totalPurchases ?? raw.total_purchases ?? 0),
    totalVolume: Number(raw.totalVolume ?? raw.total_volume ?? 0),
    totalCo2: Number(raw.totalCo2 ?? raw.total_co2 ?? raw.totalCO2 ?? 0),
    avgCo2Price: Number(raw.avgCo2Price ?? raw.avg_co2_price ?? raw.avgPrice ?? 0),
  };
  return { data: stats, source: "live" };
}

interface BackendInverter {
  id: string;
  inverterId: string;
  brand: string;
  isActive: boolean;
  createdAt: string;
  user: { email: string; id: string };
}

export async function fetchAdminInverters(token: string): Promise<AdminResult<AdminInverter[]>> {
  const raw = await adminFetch<{ inverters: BackendInverter[]; total: number }>("/api/admin/inverters", token);
  console.log("[admin] /api/admin/inverters raw response:", raw);
  if (raw?.inverters && Array.isArray(raw.inverters)) {
    const data: AdminInverter[] = raw.inverters.map((inv) => ({
      id: inv.id,
      userWallet: "",
      userEmail: inv.user?.email ?? null,
      brand: inv.brand,
      status: inv.isActive ? "active" : "disconnected",
      lastPoll: inv.createdAt,
      totalKWh: 0,
      connectedAt: inv.createdAt,
    }));
    return { data, source: "live" };
  }
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
