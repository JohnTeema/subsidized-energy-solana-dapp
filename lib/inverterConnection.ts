const INVERTER_CONNECTIONS_KEY = "subenergy_inverter_connections";

export interface StoredInverterConnection {
  walletAddress: string;
  brandId: string;
  brandName: string;
  connectedAt: number;
  demo?: boolean;
}

export function getInverterConnections(): StoredInverterConnection[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      localStorage.getItem(INVERTER_CONNECTIONS_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

export function saveInverterConnection(connection: StoredInverterConnection) {
  const existing = getInverterConnections();
  const next = [
    connection,
    ...existing.filter(
      (item) =>
        item.walletAddress !== connection.walletAddress ||
        item.brandId !== connection.brandId
    ),
  ];

  localStorage.setItem(INVERTER_CONNECTIONS_KEY, JSON.stringify(next));
}

export function hasConnectedInverter(walletAddress?: string | null) {
  if (!walletAddress) return false;
  return getInverterConnections().some(
    (connection) => connection.walletAddress === walletAddress
  );
}
