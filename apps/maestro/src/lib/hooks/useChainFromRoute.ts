import { useMemo } from "react";
import { useRouter } from "next/router";

import { WAGMI_CHAIN_CONFIGS } from "~/config/wagmi";

export function useChainFromRoute() {
  const { chainName } = useRouter().query;

  // get default chain from url
  return useMemo(() => {
    if (typeof chainName === "string") {
      return WAGMI_CHAIN_CONFIGS.find(
        (chain) =>
          chain.axelarChainName === chainName ||
          chain.axelarChainId === chainName
      );
    }
  }, [chainName]);
}
