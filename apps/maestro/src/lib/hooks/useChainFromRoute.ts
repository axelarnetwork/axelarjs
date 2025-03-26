import { useMemo } from "react";
import { useRouter } from "next/router";

import { CHAIN_CONFIGS } from "~/config/chains";

export function useChainFromRoute() {
  const { chainName } = useRouter().query;

  // get default chain from url
  return useMemo(() => {
    if (typeof chainName === "string") {
      return CHAIN_CONFIGS.find(
        (chain) =>
          chain.axelarChainName === chainName ||
          chain.axelarChainId.toLowerCase() === chainName.toLowerCase()
      );
    }
  }, [chainName]);
}
