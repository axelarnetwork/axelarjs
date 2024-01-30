import { L2Chain } from "./types";

export function getL1FeeForL2(chain: L2Chain) {
  if (chain === "arbitrum") {
    return getArbitrumL1Fee();
  } else if (chain === "mantle") {
    return getMantleL1Fee();
  } else if (chain === "optimism" || chain === "scroll" || chain === "base") {
    return getOptimismL1Fee();
  }
}

export function getOptimismL1Fee() {
  // const contractAddress = "0x420000000000000000000000000000000000000F";
}

export function getArbitrumL1Fee() {}

export function getMantleL1Fee() {
  // const contractAddress = "0x5300000000000000000000000000000000000002";
}
