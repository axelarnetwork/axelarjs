import {
  INTERCHAIN_TOKEN_SERVICE_ABI,
  INTERCHAIN_TOKEN_SERVICE_ENCODERS,
} from "@axelarjs/evm";

import { useReadContract } from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";

const getITSAddress = (chainId: number): `0x${string}` => {
  // Address can be provided dynamically based on the chainId
  return NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS;
};

export const useReadITSContract = <
  FunctionName extends keyof typeof INTERCHAIN_TOKEN_SERVICE_ENCODERS &
    Extract<
      (typeof INTERCHAIN_TOKEN_SERVICE_ABI)[number],
      { type: "function"; stateMutability: "view" }
    >["name"],
>({
  chainId,
  functionName,
  args,
  enabled = true,
}: {
  chainId: number;
  functionName: FunctionName;
  args: Parameters<
    (typeof INTERCHAIN_TOKEN_SERVICE_ENCODERS)[FunctionName]["args"]
  >[0];
  enabled?: boolean;
}) => {
  const address = getITSAddress(chainId);

  const result = useReadContract({
    address,
    abi: INTERCHAIN_TOKEN_SERVICE_ABI,
    functionName: functionName as any,
    args: INTERCHAIN_TOKEN_SERVICE_ENCODERS[functionName].args(
      args as any
    ) as any,
    query: {
      enabled,
    },
  } as any);

  return result;
};
