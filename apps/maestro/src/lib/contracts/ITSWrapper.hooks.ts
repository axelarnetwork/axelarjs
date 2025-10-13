import {
  INTERCHAIN_TOKEN_SERVICE_ABI,
  INTERCHAIN_TOKEN_SERVICE_ENCODERS,
} from "@axelarjs/evm";

import { useReadContract } from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";

export const useReadITSContract = <
  FunctionName extends keyof typeof INTERCHAIN_TOKEN_SERVICE_ENCODERS &
    Extract<
      (typeof INTERCHAIN_TOKEN_SERVICE_ABI)[number],
      { type: "function"; stateMutability: "view" }
    >["name"],
>({
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
  // const address = chainId === 0 ? "0x1" : "0x2";
  // TODO: Add chain-specific address logic here
  const address = NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS;

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
