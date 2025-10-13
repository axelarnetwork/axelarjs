import {
  INTERCHAIN_TOKEN_FACTORY_ABI,
  INTERCHAIN_TOKEN_FACTORY_ENCODERS,
} from "@axelarjs/evm";

import { useReadContract, useSimulateContract, useWriteContract } from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS } from "~/config/env";

export const useReadITFContract = <
  FunctionName extends keyof typeof INTERCHAIN_TOKEN_FACTORY_ENCODERS &
    Extract<
      (typeof INTERCHAIN_TOKEN_FACTORY_ABI)[number],
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
    (typeof INTERCHAIN_TOKEN_FACTORY_ENCODERS)[FunctionName]["args"]
  >[0];
  enabled?: boolean;
}) => {
  // const address = chainId === 0 ? "0x1" : "0x2";
  const address = NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS;

  const result = useReadContract({
    address,
    abi: INTERCHAIN_TOKEN_FACTORY_ABI,
    functionName: functionName as any,
    args: INTERCHAIN_TOKEN_FACTORY_ENCODERS[functionName].args(
      args as any
    ) as any,
    query: {
      enabled,
    },
  } as any);

  return result;
};

export const useSimulateITFContract = <
  FunctionName extends keyof typeof INTERCHAIN_TOKEN_FACTORY_ENCODERS &
    Extract<
      (typeof INTERCHAIN_TOKEN_FACTORY_ABI)[number],
      { type: "function"; stateMutability: "nonpayable" | "payable" }
    >["name"],
>({
  chainId,
  functionName,
  args,
  value,
  enabled = true,
}: {
  chainId: number;
  functionName: FunctionName;
  args: Parameters<
    (typeof INTERCHAIN_TOKEN_FACTORY_ENCODERS)[FunctionName]["args"]
  >[0];
  value?: bigint;
  enabled?: boolean;
}) => {
  const address = NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS;

  const { data, error } = useSimulateContract({
    address,
    chainId,
    value,
    abi: INTERCHAIN_TOKEN_FACTORY_ABI,
    functionName: functionName as any,
    args: INTERCHAIN_TOKEN_FACTORY_ENCODERS[functionName].args(
      args as any
    ) as any,
    query: {
      enabled,
    },
  } as any);

  return { data, error };
};

export const useWriteITFContract = <
  FunctionName extends keyof typeof INTERCHAIN_TOKEN_FACTORY_ENCODERS &
    Extract<
      (typeof INTERCHAIN_TOKEN_FACTORY_ABI)[number],
      { type: "function"; stateMutability: "nonpayable" | "payable" }
    >["name"],
>({
  chainId,
  functionName,
}: {
  chainId: number;
  functionName: FunctionName;
}) => {
  const address = NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS;

  const result = useWriteContract();

  const writeContractAsync = async ({
    args,
    value,
  }: {
    args: Parameters<
      (typeof INTERCHAIN_TOKEN_FACTORY_ENCODERS)[FunctionName]["args"]
    >[0];
    value?: bigint;
  }) => {
    return result.writeContractAsync({
      address,
      abi: INTERCHAIN_TOKEN_FACTORY_ABI,
      functionName: functionName as any,
      args: args as any,
      value,
      chainId,
    } as any);
  };

  return { ...result, writeContractAsync };
};
