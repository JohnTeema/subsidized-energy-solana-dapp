"use client";

// Admin API layer — tries real backend endpoints first, falls back to mock data.
// Once backend admin routes are added, this picks them up automatically.

import {
  MOCK_USERS,
  MOCK_ENERGY_READINGS,
  MOCK_LISTINGS,
  MOCK_PURCHASES,
  MOCK_ESG_BUYERS,
  MOCK_INVERTERS,
  OVERVIEW_STATS,
  type AdminUser,
  type EnergyReading,
  type MarketplaceListing,
  type MarketplacePurchase,
  type EsgBuyer,
  type AdminInverter,
  type OverviewStats,
} from "./adminMockData";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type DataSource = "live" | "mock";

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
    if (res.status === 404 || res.status === 405) return null; // endpoint not yet implemented
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Overview stats ────────────────────────────────────────────────────────

export async function fetchAdminStats(token: string): Promise<AdminResult<OverviewStats>> {
  const live = await adminFetch<OverviewStats>("/api/admin/stats", token);
  if (live) return { data: live, source: "live" };
  return { data: OVERVIEW_STATS, source: "mock" };
}

// ─── Users ─────────────────────────────────────────────────────────────────

export async function fetchAdminUsers(token: string): Promise<AdminResult<AdminUser[]>> {
  const live = await adminFetch<AdminUser[]>("/api/admin/users", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: MOCK_USERS, source: "mock" };
}

// ─── Energy records ─────────────────────────────────────────────────────────

export async function fetchAdminEnergy(token: string): Promise<AdminResult<EnergyReading[]>> {
  const live = await adminFetch<EnergyReading[]>("/api/admin/energy/records", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: MOCK_ENERGY_READINGS, source: "mock" };
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

export async function fetchAdminListings(token: string): Promise<AdminResult<MarketplaceListing[]>> {
  const live = await adminFetch<MarketplaceListing[]>("/api/admin/marketplace/listings", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: MOCK_LISTINGS, source: "mock" };
}

export async function fetchAdminPurchases(token: string): Promise<AdminResult<MarketplacePurchase[]>> {
  const live = await adminFetch<MarketplacePurchase[]>("/api/admin/marketplace/purchases", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: MOCK_PURCHASES, source: "mock" };
}

// ─── ESG buyers ──────────────────────────────────────────────────────────────

export async function fetchAdminEsgBuyers(token: string): Promise<AdminResult<EsgBuyer[]>> {
  const live = await adminFetch<EsgBuyer[]>("/api/admin/esg-buyers", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: MOCK_ESG_BUYERS, source: "mock" };
}

// ─── Inverters ────────────────────────────────────────────────────────────────

export async function fetchAdminInverters(token: string): Promise<AdminResult<AdminInverter[]>> {
  const live = await adminFetch<AdminInverter[]>("/api/admin/inverters", token);
  if (live && Array.isArray(live)) return { data: live, source: "live" };
  return { data: MOCK_INVERTERS, source: "mock" };
}
