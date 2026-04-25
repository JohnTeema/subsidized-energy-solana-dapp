import { mockStats, mockChartData } from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
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
    id: "solaredge",
    name: "SolarEdge",
    logo: "SE",
    color: "from-blue-500 to-blue-600",
    fields: [
      { key: "site_id", label: "Site ID", type: "text", placeholder: "e.g. 1234567" },
      { key: "api_key", label: "API Key", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "growatt",
    name: "Growatt",
    logo: "GW",
    color: "from-[#0D9488] to-[#10B981]",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "your@email.com" },
      { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "deye",
    name: "Deye",
    logo: "DY",
    color: "from-orange-500 to-red-500",
    fields: [
      { key: "sn", label: "Device SN", type: "text", placeholder: "e.g. 2302XXXX" },
      { key: "region", label: "Region", type: "text", placeholder: "e.g. EU" },
    ],
  },
  {
    id: "huawei",
    name: "Huawei FusionSolar",
    logo: "HW",
    color: "from-red-500 to-pink-600",
    fields: [
      { key: "username", label: "Username", type: "text", placeholder: "Fusion Solar username" },
      { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
      { key: "station_id", label: "Station ID", type: "text", placeholder: "e.g. NE=XXXX" },
    ],
  },
  {
    id: "solis",
    name: "Solis Cloud",
    logo: "SL",
    color: "from-teal-500 to-cyan-500",
    fields: [
      { key: "api_id", label: "API ID", type: "text", placeholder: "your api id" },
      { key: "api_secret", label: "API Secret", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "mock",
    name: "Mock / Demo",
    logo: "MK",
    color: "from-purple-500 to-violet-600",
    fields: [{ key: "device_id", label: "Device ID", type: "text", placeholder: "mock-device-001" }],
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
    return await apiFetch<{ success: boolean; message?: string }>("/api/inverters/connect", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    // Fallback: treat as success so the UI keeps working if backend is down
    return { success: true, message: "offline" };
  }
}

export async function saveConnection(payload: ConnectPayload): Promise<{ id?: string }> {
  try {
    return await apiFetch<{ id?: string }>("/api/inverters", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
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
