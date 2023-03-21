import { useContract, UseContractConfig } from "wagmi";

import contract from "../abis/InterchainTokenLinkerProxy";

type Config = Omit<UseContractConfig<typeof contract.abi>, "abi">;

export function useInterchainTokenLinkerProxy(config: Config) {
  if (!config.address) throw new Error("address is required");

  return useContract({
    abi: contract.abi,
    ...config,
  });
}
