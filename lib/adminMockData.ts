// Admin dashboard mock data — replace with real API calls when backend admin endpoints are available

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

// ─── Overview stats ───────────────────────────────────────────────────────────

export const OVERVIEW_STATS: OverviewStats = {
  totalUsers: 1247,
  totalInverters: 892,
  subMintedToday: 4328,
  subMintedWeek: 29841,
  subMintedAllTime: 2847392,
  sreDistributed: 183429,
  marketplaceTransactions: 2841,
  revenueUsdc: 47293,
  activeProducers24h: 341,
};

// ─── Chart data (last 14 days) ───────────────────────────────────────────────

export const DAILY_REGISTRATIONS: DailyPoint[] = [
  { date: "Apr 18", value: 18 },
  { date: "Apr 19", value: 23 },
  { date: "Apr 20", value: 31 },
  { date: "Apr 21", value: 14 },
  { date: "Apr 22", value: 9 },
  { date: "Apr 23", value: 27 },
  { date: "Apr 24", value: 35 },
  { date: "Apr 25", value: 42 },
  { date: "Apr 26", value: 38 },
  { date: "Apr 27", value: 29 },
  { date: "Apr 28", value: 22 },
  { date: "Apr 29", value: 19 },
  { date: "Apr 30", value: 44 },
  { date: "May 01", value: 37 },
];

export const DAILY_ENERGY: DailyPoint[] = [
  { date: "Apr 18", value: 3842 },
  { date: "Apr 19", value: 4210 },
  { date: "Apr 20", value: 5083 },
  { date: "Apr 21", value: 2917 },
  { date: "Apr 22", value: 3104 },
  { date: "Apr 23", value: 4758 },
  { date: "Apr 24", value: 6321 },
  { date: "Apr 25", value: 7043 },
  { date: "Apr 26", value: 6518 },
  { date: "Apr 27", value: 5294 },
  { date: "Apr 28", value: 4837 },
  { date: "Apr 29", value: 3962 },
  { date: "Apr 30", value: 7241 },
  { date: "May 01", value: 4328 },
];

export const DAILY_VOLUME: DailyPoint[] = [
  { date: "Apr 18", value: 2140 },
  { date: "Apr 19", value: 3820 },
  { date: "Apr 20", value: 5430 },
  { date: "Apr 21", value: 1290 },
  { date: "Apr 22", value: 2780 },
  { date: "Apr 23", value: 4190 },
  { date: "Apr 24", value: 6340 },
  { date: "Apr 25", value: 7820 },
  { date: "Apr 26", value: 5910 },
  { date: "Apr 27", value: 4320 },
  { date: "Apr 28", value: 3180 },
  { date: "Apr 29", value: 2740 },
  { date: "Apr 30", value: 6920 },
  { date: "May 01", value: 4170 },
];

// ─── Mock users ───────────────────────────────────────────────────────────────

export const MOCK_USERS: AdminUser[] = [
  { id: "u1", email: "adaeze.okonkwo@gmail.com", wallet: "6N8UZJ8GAGTd7RzoctFbHYzFYzkL2fWK13t811qQqahz", registeredAt: "2025-12-14", verified: true, inverterBrand: "Growatt", kWhProduced: 2847, subBalance: 28470, sreBalance: 47, lastActive: "2026-05-01" },
  { id: "u2", email: "chukwuemeka.eze@yahoo.com", wallet: "7xKL4mN9PqvR3DHsJtywCEAF5GbuZoM6ixndrE7CwqPA", registeredAt: "2025-11-28", verified: true, inverterBrand: "SolarEdge", kWhProduced: 5293, subBalance: 52930, sreBalance: 89, lastActive: "2026-05-01" },
  { id: "u3", email: "ngozi.adeyemi@gmail.com", wallet: "9MDh5jk2RTwe8vYNLpXcZOF4SGbNiaQ7eBfVUq6dWtrs", registeredAt: "2026-01-05", verified: true, inverterBrand: "Deye", kWhProduced: 1204, subBalance: 12040, sreBalance: 18, lastActive: "2026-04-30" },
  { id: "u4", email: "babatunde.williams@hotmail.com", wallet: "4pKn8rYvT2mJ6fLqDHcXoE9bZsNuWa3iFgQpRe5VcMdK", registeredAt: "2026-01-19", verified: false, inverterBrand: null, kWhProduced: 0, subBalance: 0, sreBalance: 0, lastActive: "2026-01-19" },
  { id: "u5", email: "funmilayo.abiodun@gmail.com", wallet: "3VBf7CtWe9xP4jMnYpDkZoH2sGbLiAq8eRfVuQ5dTrNm", registeredAt: "2026-02-03", verified: true, inverterBrand: "Huawei", kWhProduced: 892, subBalance: 8920, sreBalance: 12, lastActive: "2026-04-29" },
  { id: "u6", email: "emeka.nwosu@gmail.com", wallet: "6tJP2Wke4mVnRqDhCxZoF8sLbAiGn9eFgQuP3VcTrMdK", registeredAt: "2026-02-14", verified: true, inverterBrand: "Growatt", kWhProduced: 3421, subBalance: 34210, sreBalance: 58, lastActive: "2026-05-01" },
  { id: "u7", email: "blessing.ogundipe@gmail.com", wallet: "5yNH8rKv2TmJ4fLqDEcXoE3bZsNuWa7iRgQpFe9VcMdK", registeredAt: "2026-02-28", verified: true, inverterBrand: "Mock", kWhProduced: 418, subBalance: 4180, sreBalance: 6, lastActive: "2026-04-28" },
  { id: "u8", email: "kenneth.obi@yahoo.com", wallet: "2KBm6DtWe8xP9jMnYpCkZoH3sGbLiAq4eRfVuQ7dTrNm", registeredAt: "2026-03-07", verified: false, inverterBrand: null, kWhProduced: 0, subBalance: 0, sreBalance: 0, lastActive: "2026-03-07" },
  { id: "u9", email: "chioma.nnaji@gmail.com", wallet: "8zJQ4Wke6mVnRqDhCxZoF2sLbAiGn5eFgQuP7VcTrMdK", registeredAt: "2026-03-15", verified: true, inverterBrand: "SolarEdge", kWhProduced: 1837, subBalance: 18370, sreBalance: 31, lastActive: "2026-05-01" },
  { id: "u10", email: "taiwo.olawale@gmail.com", wallet: "1pMH3rKv8TmJ2fLqDEcXoE9bZsNuWa5iRgQpFe7VcMdK", registeredAt: "2026-03-22", verified: true, inverterBrand: "Deye", kWhProduced: 2103, subBalance: 21030, sreBalance: 35, lastActive: "2026-04-30" },
  { id: "u11", email: "oluwaseun.badmus@gmail.com", wallet: "BqXa7vK3mP9nR4DHsJtywCEAF5GbuZoM6ixndrE8CwqPB", registeredAt: "2026-03-29", verified: true, inverterBrand: "Huawei", kWhProduced: 983, subBalance: 9830, sreBalance: 14, lastActive: "2026-04-27" },
  { id: "u12", email: "amara.chukwu@yahoo.com", wallet: "CrYb8wL4nQ0oS5EItKuzDFBG6HcvApN7jyoeSF9DxrQC", registeredAt: "2026-04-03", verified: true, inverterBrand: "Growatt", kWhProduced: 547, subBalance: 5470, sreBalance: 8, lastActive: "2026-04-29" },
  { id: "u13", email: "ifeanyi.okafor@gmail.com", wallet: "DsZc9xM5oR1pT6FJuLvzEGCH7IdwBqO8kzpfTG0EysRD", registeredAt: "2026-04-08", verified: false, inverterBrand: null, kWhProduced: 0, subBalance: 0, sreBalance: 0, lastActive: "2026-04-08" },
  { id: "u14", email: "zainab.musa@gmail.com", wallet: "EtAd0yN6pS2qU7GKvMwzFHDI8JexCrP9lazgUH1FztSE", registeredAt: "2026-04-11", verified: true, inverterBrand: "SolarEdge", kWhProduced: 312, subBalance: 3120, sreBalance: 4, lastActive: "2026-04-30" },
  { id: "u15", email: "gbenga.fashola@hotmail.com", wallet: "FuBe1zO7qT3rV8HLwNxzGIEJ9KfyDsQ0mbahVI2GauTF", registeredAt: "2026-04-15", verified: true, inverterBrand: "Mock", kWhProduced: 184, subBalance: 1840, sreBalance: 2, lastActive: "2026-04-28" },
  { id: "u16", email: "yetunde.agboola@gmail.com", wallet: "GvCf2aP8rU4sW9IMxOyzHJFK0LgzEtR1ncbiWJ3HbvUG", registeredAt: "2026-04-18", verified: true, inverterBrand: "Growatt", kWhProduced: 201, subBalance: 2010, sreBalance: 3, lastActive: "2026-05-01" },
  { id: "u17", email: "osas.omoregie@gmail.com", wallet: "HwDg3bQ9sV5tX0JNyPzaIKGL1MhzFuS2odcjXK4IcwVH", registeredAt: "2026-04-20", verified: false, inverterBrand: null, kWhProduced: 0, subBalance: 0, sreBalance: 0, lastActive: "2026-04-20" },
  { id: "u18", email: "folake.adeleke@yahoo.com", wallet: "IxEh4cR0tW6uY1KOzQabJLHM2NizGvT3pedk YL5JdxWI", registeredAt: "2026-04-22", verified: true, inverterBrand: "Deye", kWhProduced: 94, subBalance: 940, sreBalance: 1, lastActive: "2026-04-30" },
  { id: "u19", email: "nnamdi.uzochukwu@gmail.com", wallet: "JyFi5dS1uX7vZ2LPaRbcKMIN3OjzHwU4qfelZM6KexXJ", registeredAt: "2026-04-25", verified: true, inverterBrand: "Huawei", kWhProduced: 67, subBalance: 670, sreBalance: 1, lastActive: "2026-05-01" },
  { id: "u20", email: "aisha.ibrahim@gmail.com", wallet: "KzGj6eT2vY8wA3MQbScdLNJO4PkzIxV5rfgmAN7LfyYK", registeredAt: "2026-04-28", verified: false, inverterBrand: null, kWhProduced: 0, subBalance: 0, sreBalance: 0, lastActive: "2026-04-28" },
];

// ─── Energy readings ──────────────────────────────────────────────────────────

export const MOCK_ENERGY_READINGS: EnergyReading[] = [
  { id: "e1", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", date: "2026-05-01", kWh: 18.4, co2Offset: 7.91, subMinted: 184, status: "verified", inverterBrand: "Growatt" },
  { id: "e2", producer: "chukwuemeka.eze", producerWallet: "7xKL4mN9...qPA", date: "2026-05-01", kWh: 24.7, co2Offset: 10.62, subMinted: 247, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e3", producer: "emeka.nwosu", producerWallet: "6tJP2Wke...MdK", date: "2026-05-01", kWh: 21.3, co2Offset: 9.16, subMinted: 213, status: "verified", inverterBrand: "Growatt" },
  { id: "e4", producer: "ngozi.adeyemi", producerWallet: "9MDh5jk2...trs", date: "2026-04-30", kWh: 9.8, co2Offset: 4.21, subMinted: 98, status: "verified", inverterBrand: "Deye" },
  { id: "e5", producer: "chioma.nnaji", producerWallet: "8zJQ4Wke...MdK", date: "2026-04-30", kWh: 14.2, co2Offset: 6.11, subMinted: 142, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e6", producer: "taiwo.olawale", producerWallet: "1pMH3rKv...MdK", date: "2026-04-30", kWh: 16.9, co2Offset: 7.27, subMinted: 169, status: "verified", inverterBrand: "Deye" },
  { id: "e7", producer: "funmilayo.abiodun", producerWallet: "3VBf7CtW...Nm", date: "2026-04-29", kWh: 7.4, co2Offset: 3.18, subMinted: 74, status: "verified", inverterBrand: "Huawei" },
  { id: "e8", producer: "blessing.ogundipe", producerWallet: "5yNH8rKv...MdK", date: "2026-04-29", kWh: 3.1, co2Offset: 1.33, subMinted: 31, status: "pending", inverterBrand: "Mock" },
  { id: "e9", producer: "oluwaseun.badmus", producerWallet: "BqXa7vK3...qPB", date: "2026-04-29", kWh: 8.2, co2Offset: 3.53, subMinted: 82, status: "verified", inverterBrand: "Huawei" },
  { id: "e10", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", date: "2026-04-29", kWh: 22.1, co2Offset: 9.50, subMinted: 221, status: "verified", inverterBrand: "Growatt" },
  { id: "e11", producer: "ngozi.adeyemi", producerWallet: "9MDh5jk2...trs", date: "2026-04-28", kWh: 11.7, co2Offset: 5.03, subMinted: 117, status: "flagged", inverterBrand: "Deye" },
  { id: "e12", producer: "chukwuemeka.eze", producerWallet: "7xKL4mN9...qPA", date: "2026-04-28", kWh: 28.3, co2Offset: 12.17, subMinted: 283, status: "flagged", inverterBrand: "SolarEdge" },
  { id: "e13", producer: "amara.chukwu", producerWallet: "CrYb8wL4...QC", date: "2026-04-28", kWh: 4.9, co2Offset: 2.11, subMinted: 49, status: "verified", inverterBrand: "Growatt" },
  { id: "e14", producer: "zainab.musa", producerWallet: "EtAd0yN6...SE", date: "2026-04-28", kWh: 2.7, co2Offset: 1.16, subMinted: 27, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e15", producer: "yetunde.agboola", producerWallet: "GvCf2aP8...UG", date: "2026-04-28", kWh: 1.8, co2Offset: 0.77, subMinted: 18, status: "verified", inverterBrand: "Growatt" },
  { id: "e16", producer: "emeka.nwosu", producerWallet: "6tJP2Wke...MdK", date: "2026-04-27", kWh: 19.4, co2Offset: 8.34, subMinted: 194, status: "verified", inverterBrand: "Growatt" },
  { id: "e17", producer: "taiwo.olawale", producerWallet: "1pMH3rKv...MdK", date: "2026-04-27", kWh: 13.8, co2Offset: 5.93, subMinted: 138, status: "verified", inverterBrand: "Deye" },
  { id: "e18", producer: "funmilayo.abiodun", producerWallet: "3VBf7CtW...Nm", date: "2026-04-27", kWh: 6.2, co2Offset: 2.67, subMinted: 62, status: "verified", inverterBrand: "Huawei" },
  { id: "e19", producer: "blessing.ogundipe", producerWallet: "5yNH8rKv...MdK", date: "2026-04-26", kWh: 4.1, co2Offset: 1.76, subMinted: 41, status: "pending", inverterBrand: "Mock" },
  { id: "e20", producer: "chioma.nnaji", producerWallet: "8zJQ4Wke...MdK", date: "2026-04-26", kWh: 17.6, co2Offset: 7.57, subMinted: 176, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e21", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", date: "2026-04-26", kWh: 20.8, co2Offset: 8.94, subMinted: 208, status: "verified", inverterBrand: "Growatt" },
  { id: "e22", producer: "oluwaseun.badmus", producerWallet: "BqXa7vK3...qPB", date: "2026-04-25", kWh: 7.3, co2Offset: 3.14, subMinted: 73, status: "verified", inverterBrand: "Huawei" },
  { id: "e23", producer: "amara.chukwu", producerWallet: "CrYb8wL4...QC", date: "2026-04-25", kWh: 5.6, co2Offset: 2.41, subMinted: 56, status: "verified", inverterBrand: "Growatt" },
  { id: "e24", producer: "ngozi.adeyemi", producerWallet: "9MDh5jk2...trs", date: "2026-04-24", kWh: 10.9, co2Offset: 4.69, subMinted: 109, status: "verified", inverterBrand: "Deye" },
  { id: "e25", producer: "chukwuemeka.eze", producerWallet: "7xKL4mN9...qPA", date: "2026-04-24", kWh: 25.4, co2Offset: 10.92, subMinted: 254, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e26", producer: "emeka.nwosu", producerWallet: "6tJP2Wke...MdK", date: "2026-04-23", kWh: 18.1, co2Offset: 7.78, subMinted: 181, status: "verified", inverterBrand: "Growatt" },
  { id: "e27", producer: "taiwo.olawale", producerWallet: "1pMH3rKv...MdK", date: "2026-04-23", kWh: 15.3, co2Offset: 6.58, subMinted: 153, status: "verified", inverterBrand: "Deye" },
  { id: "e28", producer: "zainab.musa", producerWallet: "EtAd0yN6...SE", date: "2026-04-22", kWh: 3.2, co2Offset: 1.38, subMinted: 32, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e29", producer: "gbenga.fashola", producerWallet: "FuBe1zO7...TF", date: "2026-04-22", kWh: 1.4, co2Offset: 0.60, subMinted: 14, status: "pending", inverterBrand: "Mock" },
  { id: "e30", producer: "yetunde.agboola", producerWallet: "GvCf2aP8...UG", date: "2026-04-21", kWh: 2.3, co2Offset: 0.99, subMinted: 23, status: "verified", inverterBrand: "Growatt" },
  { id: "e31", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", date: "2026-04-21", kWh: 17.9, co2Offset: 7.70, subMinted: 179, status: "verified", inverterBrand: "Growatt" },
  { id: "e32", producer: "funmilayo.abiodun", producerWallet: "3VBf7CtW...Nm", date: "2026-04-20", kWh: 5.8, co2Offset: 2.49, subMinted: 58, status: "verified", inverterBrand: "Huawei" },
  { id: "e33", producer: "chioma.nnaji", producerWallet: "8zJQ4Wke...MdK", date: "2026-04-20", kWh: 16.4, co2Offset: 7.05, subMinted: 164, status: "verified", inverterBrand: "SolarEdge" },
  { id: "e34", producer: "chukwuemeka.eze", producerWallet: "7xKL4mN9...qPA", date: "2026-04-19", kWh: 31.2, co2Offset: 13.42, subMinted: 312, status: "flagged", inverterBrand: "SolarEdge" },
  { id: "e35", producer: "ngozi.adeyemi", producerWallet: "9MDh5jk2...trs", date: "2026-04-19", kWh: 8.7, co2Offset: 3.74, subMinted: 87, status: "verified", inverterBrand: "Deye" },
  { id: "e36", producer: "emeka.nwosu", producerWallet: "6tJP2Wke...MdK", date: "2026-04-18", kWh: 20.2, co2Offset: 8.69, subMinted: 202, status: "verified", inverterBrand: "Growatt" },
  { id: "e37", producer: "taiwo.olawale", producerWallet: "1pMH3rKv...MdK", date: "2026-04-18", kWh: 14.7, co2Offset: 6.32, subMinted: 147, status: "verified", inverterBrand: "Deye" },
  { id: "e38", producer: "oluwaseun.badmus", producerWallet: "BqXa7vK3...qPB", date: "2026-04-17", kWh: 9.1, co2Offset: 3.91, subMinted: 91, status: "verified", inverterBrand: "Huawei" },
  { id: "e39", producer: "amara.chukwu", producerWallet: "CrYb8wL4...QC", date: "2026-04-16", kWh: 6.3, co2Offset: 2.71, subMinted: 63, status: "verified", inverterBrand: "Growatt" },
  { id: "e40", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", date: "2026-04-15", kWh: 19.7, co2Offset: 8.47, subMinted: 197, status: "verified", inverterBrand: "Growatt" },
];

// ─── Marketplace listings ─────────────────────────────────────────────────────

export const MOCK_LISTINGS: MarketplaceListing[] = [
  { id: "l1", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", kWh: 120, co2: 51.6, price: 4.13, pricePerTonne: 80, status: "active", listedAt: "2026-04-30" },
  { id: "l2", producer: "chukwuemeka.eze", producerWallet: "7xKL4mN9...qPA", kWh: 340, co2: 146.2, price: 10.28, pricePerTonne: 70, status: "sold", listedAt: "2026-04-28" },
  { id: "l3", producer: "emeka.nwosu", producerWallet: "6tJP2Wke...MdK", kWh: 200, co2: 86.0, price: 7.74, pricePerTonne: 90, status: "active", listedAt: "2026-04-29" },
  { id: "l4", producer: "ngozi.adeyemi", producerWallet: "9MDh5jk2...trs", kWh: 80, co2: 34.4, price: 2.75, pricePerTonne: 80, status: "sold", listedAt: "2026-04-25" },
  { id: "l5", producer: "chioma.nnaji", producerWallet: "8zJQ4Wke...MdK", kWh: 150, co2: 64.5, price: 5.16, pricePerTonne: 80, status: "active", listedAt: "2026-04-30" },
  { id: "l6", producer: "taiwo.olawale", producerWallet: "1pMH3rKv...MdK", kWh: 180, co2: 77.4, price: 7.74, pricePerTonne: 100, status: "cancelled", listedAt: "2026-04-22" },
  { id: "l7", producer: "funmilayo.abiodun", producerWallet: "3VBf7CtW...Nm", kWh: 60, co2: 25.8, price: 2.06, pricePerTonne: 80, status: "sold", listedAt: "2026-04-20" },
  { id: "l8", producer: "adaeze.okonkwo", producerWallet: "6N8UZJ8G...ahz", kWh: 250, co2: 107.5, price: 8.60, pricePerTonne: 80, status: "sold", listedAt: "2026-04-18" },
  { id: "l9", producer: "oluwaseun.badmus", producerWallet: "BqXa7vK3...qPB", kWh: 90, co2: 38.7, price: 3.48, pricePerTonne: 90, status: "active", listedAt: "2026-04-30" },
  { id: "l10", producer: "amara.chukwu", producerWallet: "CrYb8wL4...QC", kWh: 50, co2: 21.5, price: 1.72, pricePerTonne: 80, status: "active", listedAt: "2026-04-29" },
  { id: "l11", producer: "chukwuemeka.eze", producerWallet: "7xKL4mN9...qPA", kWh: 400, co2: 172.0, price: 13.76, pricePerTonne: 80, status: "sold", listedAt: "2026-04-15" },
  { id: "l12", producer: "emeka.nwosu", producerWallet: "6tJP2Wke...MdK", kWh: 160, co2: 68.8, price: 6.19, pricePerTonne: 90, status: "sold", listedAt: "2026-04-12" },
  { id: "l13", producer: "ngozi.adeyemi", producerWallet: "9MDh5jk2...trs", kWh: 70, co2: 30.1, price: 2.71, pricePerTonne: 90, status: "cancelled", listedAt: "2026-04-10" },
  { id: "l14", producer: "taiwo.olawale", producerWallet: "1pMH3rKv...MdK", kWh: 220, co2: 94.6, price: 7.57, pricePerTonne: 80, status: "sold", listedAt: "2026-04-08" },
  { id: "l15", producer: "zainab.musa", producerWallet: "EtAd0yN6...SE", kWh: 30, co2: 12.9, price: 1.16, pricePerTonne: 90, status: "active", listedAt: "2026-04-30" },
];

// ─── Marketplace purchases ────────────────────────────────────────────────────

export const MOCK_PURCHASES: MarketplacePurchase[] = [
  { id: "p1", buyerOrg: "GreenPath Energy Ltd", listingId: "l2", kWh: 340, amountPaid: 10.28, subBurned: 3400, date: "2026-04-29" },
  { id: "p2", buyerOrg: "Ecotricity Nigeria", listingId: "l4", kWh: 80, amountPaid: 2.75, subBurned: 800, date: "2026-04-26" },
  { id: "p3", buyerOrg: "Access Bank ESG", listingId: "l7", kWh: 60, amountPaid: 2.06, subBurned: 600, date: "2026-04-21" },
  { id: "p4", buyerOrg: "Dangote Carbon Fund", listingId: "l8", kWh: 250, amountPaid: 8.60, subBurned: 2500, date: "2026-04-19" },
  { id: "p5", buyerOrg: "GreenPath Energy Ltd", listingId: "l11", kWh: 400, amountPaid: 13.76, subBurned: 4000, date: "2026-04-16" },
  { id: "p6", buyerOrg: "MTN Nigeria Foundation", listingId: "l12", kWh: 160, amountPaid: 6.19, subBurned: 1600, date: "2026-04-13" },
  { id: "p7", buyerOrg: "Ecotricity Nigeria", listingId: "l14", kWh: 220, amountPaid: 7.57, subBurned: 2200, date: "2026-04-09" },
  { id: "p8", buyerOrg: "GTBank Sustainability", listingId: "l11", kWh: 180, amountPaid: 6.48, subBurned: 1800, date: "2026-04-05" },
  { id: "p9", buyerOrg: "Nestle West Africa", listingId: "l8", kWh: 120, amountPaid: 4.32, subBurned: 1200, date: "2026-04-03" },
  { id: "p10", buyerOrg: "Access Bank ESG", listingId: "l12", kWh: 100, amountPaid: 3.87, subBurned: 1000, date: "2026-03-30" },
  { id: "p11", buyerOrg: "Dangote Carbon Fund", listingId: "l14", kWh: 200, amountPaid: 6.88, subBurned: 2000, date: "2026-03-27" },
  { id: "p12", buyerOrg: "MTN Nigeria Foundation", listingId: "l11", kWh: 150, amountPaid: 5.40, subBurned: 1500, date: "2026-03-24" },
  { id: "p13", buyerOrg: "GreenPath Energy Ltd", listingId: "l7", kWh: 80, amountPaid: 2.88, subBurned: 800, date: "2026-03-20" },
  { id: "p14", buyerOrg: "Ecotricity Nigeria", listingId: "l4", kWh: 100, amountPaid: 3.44, subBurned: 1000, date: "2026-03-17" },
  { id: "p15", buyerOrg: "GTBank Sustainability", listingId: "l8", kWh: 200, amountPaid: 7.20, subBurned: 2000, date: "2026-03-14" },
  { id: "p16", buyerOrg: "Nestle West Africa", listingId: "l2", kWh: 180, amountPaid: 5.45, subBurned: 1800, date: "2026-03-10" },
  { id: "p17", buyerOrg: "Access Bank ESG", listingId: "l7", kWh: 90, amountPaid: 3.24, subBurned: 900, date: "2026-03-07" },
  { id: "p18", buyerOrg: "Dangote Carbon Fund", listingId: "l11", kWh: 250, amountPaid: 8.60, subBurned: 2500, date: "2026-03-03" },
  { id: "p19", buyerOrg: "MTN Nigeria Foundation", listingId: "l12", kWh: 120, amountPaid: 4.64, subBurned: 1200, date: "2026-02-28" },
  { id: "p20", buyerOrg: "GreenPath Energy Ltd", listingId: "l14", kWh: 160, amountPaid: 5.51, subBurned: 1600, date: "2026-02-24" },
];

// ─── ESG buyers ───────────────────────────────────────────────────────────────

export const MOCK_ESG_BUYERS: EsgBuyer[] = [
  { id: "b1", orgName: "GreenPath Energy Ltd", companyId: "RC-1047823", country: "Nigeria", industry: "Energy", wallet: "LzHk7fU3wZ9xB4NPcTdeOMKP5QlzJyW6sghnBO8MgzZL", registeredAt: "2025-11-15", totalOffsets: 1310 },
  { id: "b2", orgName: "Ecotricity Nigeria", companyId: "RC-0923847", country: "Nigeria", industry: "Utilities", wallet: "MaIl8gV4xA0yC5OQdUefPNLQ6RmzKzX7thioCP9NhaAM", registeredAt: "2025-12-03", totalOffsets: 600 },
  { id: "b3", orgName: "Access Bank ESG", companyId: "RC-0019234", country: "Nigeria", industry: "Finance", wallet: "NbJm9hW5yB1zD6PReFvgQOMP7SnzLzY8uijpDQ0OibBN", registeredAt: "2025-12-18", totalOffsets: 290 },
  { id: "b4", orgName: "Dangote Carbon Fund", companyId: "RC-1234567", country: "Nigeria", industry: "Conglomerates", wallet: "OcKn0iX6zC2aE7QSfGwhRPNQ8TozMzZ9vjkqER1PjcCO", registeredAt: "2026-01-08", totalOffsets: 950 },
  { id: "b5", orgName: "MTN Nigeria Foundation", companyId: "RC-0847291", country: "Nigeria", industry: "Telecom", wallet: "PdLo1jY7aD3bF8RTgHxiSQOR9UpaNoA0wklrFS2QkdDP", registeredAt: "2026-01-22", totalOffsets: 450 },
  { id: "b6", orgName: "GTBank Sustainability", companyId: "RC-0042938", country: "Nigeria", industry: "Finance", wallet: "QeMp2kZ8bE4cG9SUhIyjTRPS0VqbOpB1xlmsST3RleeQ", registeredAt: "2026-02-10", totalOffsets: 380 },
  { id: "b7", orgName: "Nestle West Africa", companyId: "RC-0128374", country: "Nigeria", industry: "FMCG", wallet: "RfNq3lA9cF5dH0TVijzKUSQT1WrcPqC2ymnsTU4SmffR", registeredAt: "2026-02-25", totalOffsets: 500 },
  { id: "b8", orgName: "Shell Nigeria E&P", companyId: "RC-0037482", country: "Nigeria", industry: "Oil & Gas", wallet: "SgOr4mB0dG6eI1UWjkzLVTRU2XsdQrD3znouVV5TnggS", registeredAt: "2026-03-12", totalOffsets: 180 },
  { id: "b9", orgName: "First Bank Green Initiative", companyId: "RC-0019182", country: "Nigeria", industry: "Finance", wallet: "ThPs5nC1eH7fJ2VXklzMWUSV3YteDsE4aopvWW6UohhT", registeredAt: "2026-03-28", totalOffsets: 120 },
  { id: "b10", orgName: "Flour Mills Carbon Offset", companyId: "RC-0094728", country: "Nigeria", industry: "Manufacturing", wallet: "UiQt6oD2fI8gK3WYlmzNXVTW4ZufEtF5bpqwXX7VpiiU", registeredAt: "2026-04-14", totalOffsets: 60 },
];

// ─── Inverters ────────────────────────────────────────────────────────────────

export const MOCK_INVERTERS: AdminInverter[] = [
  { id: "i1", userWallet: "6N8UZJ8G...ahz", userEmail: "adaeze.okonkwo@gmail.com", brand: "Growatt", status: "active", lastPoll: "2026-05-01T09:32:00Z", totalKWh: 2847, connectedAt: "2025-12-14" },
  { id: "i2", userWallet: "7xKL4mN9...qPA", userEmail: "chukwuemeka.eze@yahoo.com", brand: "SolarEdge", status: "active", lastPoll: "2026-05-01T09:28:00Z", totalKWh: 5293, connectedAt: "2025-11-28" },
  { id: "i3", userWallet: "9MDh5jk2...trs", userEmail: "ngozi.adeyemi@gmail.com", brand: "Deye", status: "active", lastPoll: "2026-05-01T09:15:00Z", totalKWh: 1204, connectedAt: "2026-01-05" },
  { id: "i4", userWallet: "3VBf7CtW...Nm", userEmail: "funmilayo.abiodun@gmail.com", brand: "Huawei", status: "active", lastPoll: "2026-05-01T09:41:00Z", totalKWh: 892, connectedAt: "2026-02-03" },
  { id: "i5", userWallet: "6tJP2Wke...MdK", userEmail: "emeka.nwosu@gmail.com", brand: "Growatt", status: "active", lastPoll: "2026-05-01T09:37:00Z", totalKWh: 3421, connectedAt: "2026-02-14" },
  { id: "i6", userWallet: "5yNH8rKv...MdK", userEmail: "blessing.ogundipe@gmail.com", brand: "Mock", status: "active", lastPoll: "2026-05-01T08:58:00Z", totalKWh: 418, connectedAt: "2026-02-28" },
  { id: "i7", userWallet: "8zJQ4Wke...MdK", userEmail: "chioma.nnaji@gmail.com", brand: "SolarEdge", status: "active", lastPoll: "2026-05-01T09:44:00Z", totalKWh: 1837, connectedAt: "2026-03-15" },
  { id: "i8", userWallet: "1pMH3rKv...MdK", userEmail: "taiwo.olawale@gmail.com", brand: "Deye", status: "active", lastPoll: "2026-05-01T09:22:00Z", totalKWh: 2103, connectedAt: "2026-03-22" },
  { id: "i9", userWallet: "BqXa7vK3...qPB", userEmail: "oluwaseun.badmus@gmail.com", brand: "Huawei", status: "disconnected", lastPoll: "2026-04-29T14:17:00Z", totalKWh: 983, connectedAt: "2026-03-29" },
  { id: "i10", userWallet: "CrYb8wL4...QC", userEmail: "amara.chukwu@yahoo.com", brand: "Growatt", status: "active", lastPoll: "2026-05-01T09:10:00Z", totalKWh: 547, connectedAt: "2026-04-03" },
  { id: "i11", userWallet: "EtAd0yN6...SE", userEmail: "zainab.musa@gmail.com", brand: "SolarEdge", status: "active", lastPoll: "2026-05-01T09:05:00Z", totalKWh: 312, connectedAt: "2026-04-11" },
  { id: "i12", userWallet: "FuBe1zO7...TF", userEmail: "gbenga.fashola@hotmail.com", brand: "Mock", status: "error", lastPoll: "2026-04-30T22:04:00Z", totalKWh: 184, connectedAt: "2026-04-15" },
  { id: "i13", userWallet: "GvCf2aP8...UG", userEmail: "yetunde.agboola@gmail.com", brand: "Growatt", status: "active", lastPoll: "2026-05-01T09:50:00Z", totalKWh: 201, connectedAt: "2026-04-18" },
  { id: "i14", userWallet: "HwDg3bQ9...VH", userEmail: null, brand: "Deye", status: "disconnected", lastPoll: "2026-04-27T11:43:00Z", totalKWh: 0, connectedAt: "2026-04-20" },
  { id: "i15", userWallet: "JyFi5dS1...XJ", userEmail: "nnamdi.uzochukwu@gmail.com", brand: "Huawei", status: "active", lastPoll: "2026-05-01T09:18:00Z", totalKWh: 67, connectedAt: "2026-04-25" },
  { id: "i16", userWallet: "LzHk7fU3...ZL", userEmail: null, brand: "Growatt", status: "error", lastPoll: "2026-04-28T16:30:00Z", totalKWh: 129, connectedAt: "2026-04-12" },
  { id: "i17", userWallet: "MaIl8gV4...AM", userEmail: null, brand: "SolarEdge", status: "active", lastPoll: "2026-05-01T09:03:00Z", totalKWh: 874, connectedAt: "2026-03-08" },
  { id: "i18", userWallet: "NbJm9hW5...BN", userEmail: null, brand: "Deye", status: "active", lastPoll: "2026-05-01T08:52:00Z", totalKWh: 1402, connectedAt: "2026-02-19" },
  { id: "i19", userWallet: "OcKn0iX6...CO", userEmail: null, brand: "Huawei", status: "disconnected", lastPoll: "2026-04-25T09:17:00Z", totalKWh: 2187, connectedAt: "2025-12-29" },
  { id: "i20", userWallet: "PdLo1jY7...DP", userEmail: null, brand: "Growatt", status: "active", lastPoll: "2026-05-01T09:47:00Z", totalKWh: 3891, connectedAt: "2025-11-20" },
];
