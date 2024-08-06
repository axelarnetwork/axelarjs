import { erc20Abi } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

import InterchainTokenService from "../contract-abis/InterchainTokenService.abi.json";
import InterchainToken from "../contract-abis/token.abi.json";
import {
  INTERCHAIN_TOKEN_ID,
  INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  VALID_TOKEN_METHOD_NAME,
} from "../utils/constants";

const useTokenData = (tokenId: string) => {
  const { chainId } = useAccount();

  // Use token address to get token Id
  const { data: tokenIdFromAddress } = useReadContract({
    abi: InterchainToken,
    address: tokenId as `0x${string}`,
    functionName: INTERCHAIN_TOKEN_ID,
    chainId: chainId,
    args: [],
  });

  // Use token id to check if it is a valid token and get token address
  const {
    data: tokenAddress,
    error: errorGetValidTokenAddress,
    isPending,
  } = useReadContract({
    abi: InterchainTokenService,
    address: INTERCHAIN_TOKEN_SERVICE_ADDRESS,
    functionName: VALID_TOKEN_METHOD_NAME,
    args: [tokenIdFromAddress || tokenId],
  });

  const {
    data,
    isLoading,
    error: errorGetTokenMetadata,
  } = useReadContracts({
    allowFailure: false,

    contracts: [
      {
        address: `0x${(tokenAddress as string)?.substring(2)}`,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: `0x${(tokenAddress as string)?.substring(2)}`,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: `0x${(tokenAddress as string)?.substring(2)}`,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  const response = {
    error: errorGetValidTokenAddress || errorGetTokenMetadata,
    decimals: data?.[0] || null,
    name: data?.[1] || null,
    symbol: data?.[2] || null,
    address: tokenAddress,
    isLoading: isLoading || isPending,
    tokenId: tokenId,
  };
  return response;
};

export default useTokenData;
