import { hexlify, hexZeroPad } from "ethers/lib/utils";
import { useContract, UseContractConfig, useQuery } from "wagmi";

import contract from "../abis/InterchainTokenLinker";

type Config = Omit<UseContractConfig<typeof contract.abi>, "abi">;

export function useInterchainTokenLinker(config: Config) {
  if (!config.address) throw new Error("address is required");

  return useContract({
    abi: contract.abi,
    ...config,
  });
}

type UseCheckTokenExistsInTokenLinkerConfig = Config & {
  tokenAddress?: `0x${string}`;
};
export function useCheckTokenExistsInTokenLinker(
  config: UseCheckTokenExistsInTokenLinkerConfig
) {
  const tl = useInterchainTokenLinker(config);
  const doesExist = async (tokenAddress: `0x${string}`) => {
    const zero = hexZeroPad(hexlify(0), 32);
    const tokenId = await tl?.getTokenId(config.tokenAddress as `0x${string}`);
    return tokenId !== zero;
  };
  return useQuery(
    ["useCheckTokenExistsInTokenLinker", config.tokenAddress],
    () => doesExist(config.tokenAddress as `0x${string}`),
    {
      enabled: Boolean(tl) && Boolean(config.signerOrProvider),
    }
  );
}

export function useGetTokenIdInTokenLinker(
  config: UseCheckTokenExistsInTokenLinkerConfig
) {
  const tl = useInterchainTokenLinker(config);
  const getTokenId = async (tokenAddress: `0x${string}`) =>
    tl?.getTokenId(config.tokenAddress as `0x${string}`);
  return useQuery(
    ["useGetTokenIdInTokenLinker", config.tokenAddress],
    () => getTokenId(config.tokenAddress as `0x${string}`),
    {
      enabled:
        Boolean(tl) &&
        Boolean(config.signerOrProvider) &&
        Boolean(config.tokenAddress),
    }
  );
}
