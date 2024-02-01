import { L2Chain } from "./types";

export function isL2Chain(value: string): value is L2Chain {
  const validChains: L2Chain[] = [
    "optimism",
    "arbitrum",
    "mantle",
    "base",
    "scroll",
  ];
  return validChains.includes(value as L2Chain);
}
