import { useContract, UseContractConfig, useQuery } from "wagmi";

import contract from "../abis/ERC20";

type Config = Omit<UseContractConfig<typeof contract.abi>, "abi">;

export function useERC20(config: Config) {
  if (!config.address) throw new Error("address is required");

  return useContract({
    abi: contract.abi,
    ...config,
  });
}

type UseCheckTokenExistsInTokenLinkerConfig = Config & {
  tokenAddress?: `0x${string}`;
};
export function useGetERC20TokenDetails(
  config: UseCheckTokenExistsInTokenLinkerConfig
) {
  const erc20 = useERC20(config);
  const getTokenDetails = async () => {
    const decimals = await erc20?.decimals();
    const tokenSymbol = await erc20?.symbol();
    const tokenName = await erc20?.name();
    return { decimals, tokenSymbol, tokenName };
  };
  return useQuery(
    ["useGetTokenDetails", config.tokenAddress],
    getTokenDetails,
    {
      enabled: Boolean(erc20) && Boolean(config.signerOrProvider),
    }
  );
}
