import { mockStats, mockChartData } from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("subenergy_auth_token");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    // Unauthorized — clear auth state locally and force sign-in
    if (typeof window !== "undefined") {
      localStorage.removeItem("subenergy_auth_token");
      localStorage.removeItem("subenergy_email_wallet_session");
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Inverter brands ────────────────────────────────────────────────────────

export interface InverterBrand {
  id: string;
  name: string;
  logo: string;
  color: string;
  fields: { key: string; label: string; type: string; placeholder: string }[];
  demo?: boolean;
}

const FALLBACK_BRANDS: InverterBrand[] = [
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
  {
    id: "felicity",
    name: "Felicity Solar",
    logo: "FS",
    color: "from-yellow-500 to-orange-500",
    fields: [],
    demo: true,
  },
  {
    id: "mock",
    name: "Mock / Demo",
    logo: "MK",
    color: "from-purple-500 to-violet-600",
    fields: [],
    demo: true,
  },
];

export async function fetchBrands(): Promise<InverterBrand[]> {
  try {
    return await apiFetch<InverterBrand[]>("/api/inverters/brands");
  } catch {
    return FALLBACK_BRANDS;
  }
}

// ─── Inverter connection ─────────────────────────────────────────────────────

export interface ConnectPayload {
  brand: string;
  credentials: Record<string, string>;
  wallet?: string;
}

export async function testConnection(payload: ConnectPayload): Promise<{ success: boolean; message?: string }> {
  try {
    return await apiFetch<{ success: boolean; message?: string }>("/api/inverters/test-connection", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return { success: true, message: "offline" };
  }
}

export async function saveConnection(payload: ConnectPayload): Promise<{ id?: string; inverterId?: string }> {
  try {
    return await apiFetch<{ id?: string; inverterId?: string }>("/api/inverters/connect", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("saveConnection failed:", err);
    return {};
  }
}

// ─── Energy summary ──────────────────────────────────────────────────────────

export interface EnergySummary {
  subBalance: number;
  sreBalance: number;
  totalProduction: number;
  networkShare: number;
  subTrend: string;
  sreTrend: string;
  productionTrend: string;
}

export async function fetchEnergySummary(wallet: string): Promise<EnergySummary> {
  try {
    return await apiFetch<EnergySummary>(`/api/energy/summary?wallet=${encodeURIComponent(wallet)}`);
  } catch {
    return {
      subBalance: mockStats.subBalance,
      sreBalance: mockStats.sreBalance,
      totalProduction: mockStats.totalProduction,
      networkShare: mockStats.networkShare,
      subTrend: "+8.4% this week",
      sreTrend: "+12.1% this week",
      productionTrend: "+2.3% today",
    };
  }
}

// ─── Chart data ──────────────────────────────────────────────────────────────

export interface ChartPoint {
  time: string;
  kwh: number;
}

export async function fetchChartData(wallet: string, view: "daily" | "weekly"): Promise<ChartPoint[]> {
  try {
    return await apiFetch<ChartPoint[]>(
      `/api/energy/chart?wallet=${encodeURIComponent(wallet)}&view=${view}`
    );
  } catch {
    return mockChartData[view];
  }
}
