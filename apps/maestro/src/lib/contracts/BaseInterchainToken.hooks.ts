/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useContractEvent,
  UseContractEventConfig,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
} from "wagmi";
import {
  PrepareWriteContractResult,
  ReadContractResult,
  WriteContractMode,
} from "wagmi/actions";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BaseInterchainToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const baseInterchainTokenABI = [
  { type: "error", inputs: [], name: "InvalidAccount" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "subtractedValue", internalType: "uint256", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "addedValue", internalType: "uint256", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "recipient", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "interchainTransfer",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "recipient", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "interchainTransferFrom",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenManager",
    outputs: [
      { name: "tokenManager_", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "recipient", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "recipient", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link baseInterchainTokenABI}__.
 */
export function useBaseInterchainTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof baseInterchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof baseInterchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: baseInterchainTokenABI,
    ...config,
  } as UseContractReadConfig<typeof baseInterchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"allowance"`.
 */
export function useBaseInterchainTokenAllowance<
  TFunctionName extends "allowance",
  TSelectData = ReadContractResult<typeof baseInterchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof baseInterchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: baseInterchainTokenABI,
    functionName: "allowance",
    ...config,
  } as UseContractReadConfig<typeof baseInterchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useBaseInterchainTokenBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof baseInterchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof baseInterchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: baseInterchainTokenABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof baseInterchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"tokenManager"`.
 */
export function useBaseInterchainTokenTokenManager<
  TFunctionName extends "tokenManager",
  TSelectData = ReadContractResult<typeof baseInterchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof baseInterchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: baseInterchainTokenABI,
    functionName: "tokenManager",
    ...config,
  } as UseContractReadConfig<typeof baseInterchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useBaseInterchainTokenTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof baseInterchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof baseInterchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: baseInterchainTokenABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof baseInterchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__.
 */
export function useBaseInterchainTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof baseInterchainTokenABI, TFunctionName, TMode>({
    abi: baseInterchainTokenABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"approve"`.
 */
export function useBaseInterchainTokenApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "approve",
        TMode
      > & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof baseInterchainTokenABI, "approve", TMode>({
    abi: baseInterchainTokenABI,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useBaseInterchainTokenDecreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "decreaseAllowance"
        >["request"]["abi"],
        "decreaseAllowance",
        TMode
      > & { functionName?: "decreaseAllowance" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "decreaseAllowance",
        TMode
      > & {
        abi?: never;
        functionName?: "decreaseAllowance";
      } = {} as any
) {
  return useContractWrite<
    typeof baseInterchainTokenABI,
    "decreaseAllowance",
    TMode
  >({
    abi: baseInterchainTokenABI,
    functionName: "decreaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useBaseInterchainTokenIncreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "increaseAllowance"
        >["request"]["abi"],
        "increaseAllowance",
        TMode
      > & { functionName?: "increaseAllowance" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "increaseAllowance",
        TMode
      > & {
        abi?: never;
        functionName?: "increaseAllowance";
      } = {} as any
) {
  return useContractWrite<
    typeof baseInterchainTokenABI,
    "increaseAllowance",
    TMode
  >({
    abi: baseInterchainTokenABI,
    functionName: "increaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useBaseInterchainTokenInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof baseInterchainTokenABI,
    "interchainTransfer",
    TMode
  >({
    abi: baseInterchainTokenABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"interchainTransferFrom"`.
 */
export function useBaseInterchainTokenInterchainTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "interchainTransferFrom"
        >["request"]["abi"],
        "interchainTransferFrom",
        TMode
      > & { functionName?: "interchainTransferFrom" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "interchainTransferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransferFrom";
      } = {} as any
) {
  return useContractWrite<
    typeof baseInterchainTokenABI,
    "interchainTransferFrom",
    TMode
  >({
    abi: baseInterchainTokenABI,
    functionName: "interchainTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function useBaseInterchainTokenTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "transfer"
        >["request"]["abi"],
        "transfer",
        TMode
      > & { functionName?: "transfer" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "transfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transfer";
      } = {} as any
) {
  return useContractWrite<typeof baseInterchainTokenABI, "transfer", TMode>({
    abi: baseInterchainTokenABI,
    functionName: "transfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useBaseInterchainTokenTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof baseInterchainTokenABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<
        typeof baseInterchainTokenABI,
        "transferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof baseInterchainTokenABI, "transferFrom", TMode>(
    {
      abi: baseInterchainTokenABI,
      functionName: "transferFrom",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__.
 */
export function usePrepareBaseInterchainTokenWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareBaseInterchainTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareBaseInterchainTokenDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof baseInterchainTokenABI,
      "decreaseAllowance"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "decreaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "decreaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareBaseInterchainTokenIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof baseInterchainTokenABI,
      "increaseAllowance"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "increaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "increaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareBaseInterchainTokenInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof baseInterchainTokenABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"interchainTransferFrom"`.
 */
export function usePrepareBaseInterchainTokenInterchainTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof baseInterchainTokenABI,
      "interchainTransferFrom"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "interchainTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "interchainTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareBaseInterchainTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "transfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "transfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "transfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareBaseInterchainTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof baseInterchainTokenABI,
      "transferFrom"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: baseInterchainTokenABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof baseInterchainTokenABI, "transferFrom">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link baseInterchainTokenABI}__.
 */
export function useBaseInterchainTokenEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof baseInterchainTokenABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: baseInterchainTokenABI,
    ...config,
  } as UseContractEventConfig<typeof baseInterchainTokenABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `eventName` set to `"Approval"`.
 */
export function useBaseInterchainTokenApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof baseInterchainTokenABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: baseInterchainTokenABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof baseInterchainTokenABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link baseInterchainTokenABI}__ and `eventName` set to `"Transfer"`.
 */
export function useBaseInterchainTokenTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof baseInterchainTokenABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: baseInterchainTokenABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof baseInterchainTokenABI, "Transfer">);
}
