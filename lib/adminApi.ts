"use client";

// Admin API layer — tries real backend endpoints first, returns zeros/empty on failure.

import type {
  AdminUser,
  EnergyReading,
  MarketplaceListing,
  MarketplacePurchase,
  EsgBuyer,
  AdminInverter,
  OverviewStats,
  DailyPoint,
} from "./adminMockData";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type DataSource = "live" | "offline";

export interface AdminResult<T> {
  data: T;
  source: DataSource;
}

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

// ─── Zero-state fallbacks ─────────────────────────────────────────────────────

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

// ─── Overview stats ────────────────────────────────────────────────────────────

export async function fetchAdminStats(token: string): Promise<AdminResult<OverviewStats>> {
  const live = await adminFetch<OverviewStats>("/api/admin/stats", token);
  if (live) return { data: live, source: "live" };
  return { data: ZERO_STATS, source: "offline" };
}

// ─── Users ─────────────────────────────────────────────────────────────────────

export async function fetchAdminUsers(token: string): Promise<AdminResult<AdminUser[]>> {
  const live = await adminFetch<AdminUser[]>("/api/admin/users", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

// ─── Energy records ────────────────────────────────────────────────────────────

export async function fetchAdminEnergy(token: string): Promise<AdminResult<EnergyReading[]>> {
  const live = await adminFetch<EnergyReading[]>("/api/admin/energy/records", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

// ─── Marketplace ───────────────────────────────────────────────────────────────

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

// ─── ESG buyers ────────────────────────────────────────────────────────────────

export async function fetchAdminEsgBuyers(token: string): Promise<AdminResult<EsgBuyer[]>> {
  const live = await adminFetch<EsgBuyer[]>("/api/admin/esg-buyers", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

// ─── Inverters ─────────────────────────────────────────────────────────────────

export async function fetchAdminInverters(token: string): Promise<AdminResult<AdminInverter[]>> {
  const live = await adminFetch<AdminInverter[]>("/api/admin/inverters", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: [], source: "offline" };
}

// ─── Daily chart data ──────────────────────────────────────────────────────────

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
