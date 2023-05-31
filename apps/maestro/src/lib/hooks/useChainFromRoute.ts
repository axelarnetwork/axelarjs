import { sluggify } from "@axelarjs/utils";
import { useMemo } from "react";
import { useRouter } from "next/router";

import { EVM_CHAIN_CONFIGS } from "~/config/wagmi";

export function useChainFromRoute() {
  const { chainName } = useRouter().query;

  // get default chain from url
  return useMemo(() => {
    if (typeof chainName === "string") {
      return EVM_CHAIN_CONFIGS.find(
        (chain) => sluggify(chain.name) === chainName
      );
    }
  }, [chainName]);
}
