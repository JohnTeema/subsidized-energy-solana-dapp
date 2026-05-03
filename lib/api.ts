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

// ─── Platform stats (landing page) ──────────────────────────────────────────

export interface PlatformStats {
  totalKwh: number;
  activeProducers: number;
  carbonOffset: number;
}

export async function fetchStats(): Promise<PlatformStats> {
  try {
    const raw = await apiFetch<unknown>("/api/stats");
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const envelope = raw as Record<string, unknown>;
      // Unwrap common envelope shapes: { data: {...} }, { stats: {...} }, or flat
      const d = (
        typeof envelope.data === "object" && envelope.data ? envelope.data :
        typeof envelope.stats === "object" && envelope.stats ? envelope.stats :
        envelope
      ) as Record<string, unknown>;
      return {
        totalKwh: typeof d.totalKwh === "number" ? d.totalKwh :
                  typeof d.total_kwh === "number" ? d.total_kwh : 0,
        activeProducers: typeof d.activeProducers === "number" ? d.activeProducers :
                         typeof d.active_producers === "number" ? d.active_producers : 0,
        carbonOffset: typeof d.carbonOffset === "number" ? d.carbonOffset :
                      typeof d.carbon_offset === "number" ? d.carbon_offset : 0,
      };
    }
  } catch {
    // network error
  }
  return { totalKwh: 0, activeProducers: 0, carbonOffset: 0 };
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

const SUMMARY_FALLBACK: EnergySummary = {
  subBalance: 0,
  sreBalance: 0,
  totalProduction: 0,
  networkShare: 0,
  subTrend: "",
  sreTrend: "",
  productionTrend: "",
};

export async function fetchEnergySummary(wallet: string): Promise<EnergySummary> {
  try {
    const raw = await apiFetch<unknown>(`/api/energy/summary?wallet=${encodeURIComponent(wallet)}`);
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const d = raw as Record<string, unknown>;
      if (typeof d.subBalance === "number" && typeof d.sreBalance === "number") {
        return {
          subBalance: d.subBalance,
          sreBalance: d.sreBalance,
          totalProduction: typeof d.totalProduction === "number" ? d.totalProduction : 0,
          networkShare: typeof d.networkShare === "number" ? d.networkShare : 0,
          subTrend: typeof d.subTrend === "string" ? d.subTrend : SUMMARY_FALLBACK.subTrend,
          sreTrend: typeof d.sreTrend === "string" ? d.sreTrend : SUMMARY_FALLBACK.sreTrend,
          productionTrend: typeof d.productionTrend === "string" ? d.productionTrend : SUMMARY_FALLBACK.productionTrend,
        };
      }
    }
  } catch {
    // network / HTTP error — fall through
  }
  return SUMMARY_FALLBACK;
}

// ─── Chart data ──────────────────────────────────────────────────────────────

export interface ChartPoint {
  time: string;
  kwh: number;
}

export async function fetchChartData(wallet: string, view: "daily" | "weekly"): Promise<ChartPoint[]> {
  try {
    const raw = await apiFetch<unknown>(
      `/api/energy/chart?wallet=${encodeURIComponent(wallet)}&view=${view}`
    );
    if (Array.isArray(raw)) return raw as ChartPoint[];
  } catch {
    // network / HTTP error
  }
  return [];
}

// ─── User Dashboard ───────────────────────────────────────────────────────────

export interface InverterInfo {
  brand: string;
  deviceId: string;
  location: string;
  status: string;
}

export interface UserDashboard {
  srePoints: number;
  totalKwhProduced: number;
  subCertificates: number;
  todayKwh: number;
  currentPowerW: number;
  batteryPercent: number;
  todaySnapshots: { time: string; kwh: number }[];
  inverter: InverterInfo | null;
  latestReading: {
    kWh: number;
    panelPower: number | null;
    timestamp: string;
  } | null;
  dailyReadings: { time: string; kwh: number }[];
  environmentalImpact: {
    co2Avoided: number;
    treesEquivalent: number;
    drivingOffset: number;
    homesPowered: number;
  };
}

const DASHBOARD_FALLBACK: UserDashboard = {
  srePoints: 0,
  totalKwhProduced: 0,
  subCertificates: 0,
  todayKwh: 0,
  currentPowerW: 0,
  batteryPercent: 0,
  todaySnapshots: [],
  inverter: null,
  latestReading: null,
  dailyReadings: [],
  environmentalImpact: { co2Avoided: 0, treesEquivalent: 0, drivingOffset: 0, homesPowered: 0 },
};

export interface AuthMe {
  email?: string;
  walletAddress?: string;
  srePoints?: number;
}

export async function fetchAuthMe(): Promise<AuthMe | null> {
  try {
    return await apiFetch<AuthMe>("/api/auth/me");
  } catch {
    return null;
  }
}

export async function fetchUserDashboard(): Promise<UserDashboard> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiFetch<any>("/api/user/dashboard");
    if (raw && typeof raw === "object") {
      const d = raw;
      const snapshots: { time: string; kwh: number }[] =
        Array.isArray(d.todaySnapshots) ? d.todaySnapshots :
        Array.isArray(d.dailyReadings) ? d.dailyReadings : [];

      const inverter: InverterInfo | null =
        d.inverter && typeof d.inverter === "object"
          ? {
              brand: d.inverter.brand ?? d.inverter.inverterBrand ?? "",
              deviceId: d.inverter.deviceId ?? d.inverter.inverterId ?? d.inverter.id ?? "",
              location: d.inverter.location ?? "",
              status: d.inverter.status ?? (d.inverter.isActive ? "active" : "inactive"),
            }
          : null;

      const result: UserDashboard = {
        srePoints: d.srePoints ?? d.sre_points ?? 0,
        totalKwhProduced: d.totalKwhProduced ?? d.lifetimeKwh ?? d.total_kwh_produced ?? 0,
        subCertificates: d.subCertificates ?? d.sub_certificates ?? 0,
        todayKwh: d.todayKwh ?? d.today_kwh ?? 0,
        currentPowerW: d.currentPowerW ?? d.currentPower ?? d.latestReading?.panelPower ?? 0,
        batteryPercent: d.batteryPercent ?? d.battery ?? d.battery_percent ?? 0,
        todaySnapshots: snapshots,
        inverter,
        latestReading: d.latestReading ?? null,
        dailyReadings: Array.isArray(d.dailyReadings) ? d.dailyReadings : [],
        environmentalImpact: d.environmentalImpact ?? {
          co2Avoided: 0, treesEquivalent: 0, drivingOffset: 0, homesPowered: 0,
        },
      };

      if (!result.srePoints) {
        const me = await fetchAuthMe();
        if (me?.srePoints) return { ...result, srePoints: me.srePoints };
      }
      return result;
    }
  } catch {
    // fall through
  }
  return DASHBOARD_FALLBACK;
}
