export const PROGRAM_IDS = {
  // SUB is a per-day unique mint (one fresh SPL mint per producer per recording).
  // There is no single global SUB address — this points to the original pre-redeployment mint
  // and is kept only for Explorer deep-links that predate the current program.
  SUB_TOKEN: "CRHuFAkCseXnvYy6HLUqky9GrPj5Livg64qodmPFFEpe",
  // SRE mint — read from the live NetworkState PDA (4GnQtSzBUEbrn1P81mgLLZ56u8JaCgbj7i9GaEgUYM5E).
  // Updated after program redeployment; old address was HMcX5TQ7fFTr6JzLnMQySTUch7qw4saQHL5BBXxioMea.
  SRE_TOKEN: "4GnQtSzBUEbrn1P81mgLLZ56u8JaCgbj7i9GaEgUYM5E",
  ENERGY_REGISTRY: "E93p3yX6mxswv1yBn6gcZvsPCqckyupUVQKuk6YLNyYR",
  MARKETPLACE: "D5BHn2yCxj4DPrR7HrhoegqCketYNx9DWvHNLVFaaGez",
} as const;

export const NETWORK = "devnet";
export const EXPLORER_BASE = "https://explorer.solana.com";
