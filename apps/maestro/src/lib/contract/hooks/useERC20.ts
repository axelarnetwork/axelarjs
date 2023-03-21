import { useContract, UseContractConfig } from "wagmi";

import contract from "../abis/ERC20";

type Config = Omit<UseContractConfig<typeof contract.abi>, "abi">;

export function useERC20(config: Config) {
  if (!config.address) throw new Error("address is required");

  return useContract({
    abi: contract.abi,
    ...config,
  });
}
