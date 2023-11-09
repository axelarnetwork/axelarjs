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
// ERC20Permit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20PermitABI = [
  { type: "error", inputs: [], name: "InvalidAccount" },
  { type: "error", inputs: [], name: "InvalidS" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidV" },
  { type: "error", inputs: [], name: "PermitExpired" },
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
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
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
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "nameHash",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "issuer", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__.
 */
export function useErc20PermitRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useErc20PermitDomainSeparator<
  TFunctionName extends "DOMAIN_SEPARATOR",
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    functionName: "DOMAIN_SEPARATOR",
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20PermitAllowance<
  TFunctionName extends "allowance",
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    functionName: "allowance",
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20PermitBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"nameHash"`.
 */
export function useErc20PermitNameHash<
  TFunctionName extends "nameHash",
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    functionName: "nameHash",
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"nonces"`.
 */
export function useErc20PermitNonces<
  TFunctionName extends "nonces",
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    functionName: "nonces",
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20PermitTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof erc20PermitABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20PermitABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof erc20PermitABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__.
 */
export function useErc20PermitWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20PermitABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, TFunctionName, TMode>({
    abi: erc20PermitABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20PermitApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof erc20PermitABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, "approve", TMode>({
    abi: erc20PermitABI,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useErc20PermitDecreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          "decreaseAllowance"
        >["request"]["abi"],
        "decreaseAllowance",
        TMode
      > & { functionName?: "decreaseAllowance" }
    : UseContractWriteConfig<
        typeof erc20PermitABI,
        "decreaseAllowance",
        TMode
      > & {
        abi?: never;
        functionName?: "decreaseAllowance";
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, "decreaseAllowance", TMode>({
    abi: erc20PermitABI,
    functionName: "decreaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useErc20PermitIncreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          "increaseAllowance"
        >["request"]["abi"],
        "increaseAllowance",
        TMode
      > & { functionName?: "increaseAllowance" }
    : UseContractWriteConfig<
        typeof erc20PermitABI,
        "increaseAllowance",
        TMode
      > & {
        abi?: never;
        functionName?: "increaseAllowance";
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, "increaseAllowance", TMode>({
    abi: erc20PermitABI,
    functionName: "increaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"permit"`.
 */
export function useErc20PermitPermit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          "permit"
        >["request"]["abi"],
        "permit",
        TMode
      > & { functionName?: "permit" }
    : UseContractWriteConfig<typeof erc20PermitABI, "permit", TMode> & {
        abi?: never;
        functionName?: "permit";
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, "permit", TMode>({
    abi: erc20PermitABI,
    functionName: "permit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20PermitTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          "transfer"
        >["request"]["abi"],
        "transfer",
        TMode
      > & { functionName?: "transfer" }
    : UseContractWriteConfig<typeof erc20PermitABI, "transfer", TMode> & {
        abi?: never;
        functionName?: "transfer";
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, "transfer", TMode>({
    abi: erc20PermitABI,
    functionName: "transfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20PermitTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20PermitABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof erc20PermitABI, "transferFrom", TMode> & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof erc20PermitABI, "transferFrom", TMode>({
    abi: erc20PermitABI,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__.
 */
export function usePrepareErc20PermitWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20PermitApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareErc20PermitDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, "decreaseAllowance">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    functionName: "decreaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, "decreaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareErc20PermitIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, "increaseAllowance">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    functionName: "increaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, "increaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"permit"`.
 */
export function usePrepareErc20PermitPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, "permit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    functionName: "permit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, "permit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20PermitTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, "transfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    functionName: "transfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, "transfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20PermitABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20PermitTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20PermitABI, "transferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20PermitABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20PermitABI, "transferFrom">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20PermitABI}__.
 */
export function useErc20PermitEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc20PermitABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: erc20PermitABI,
    ...config,
  } as UseContractEventConfig<typeof erc20PermitABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20PermitABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20PermitApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20PermitABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: erc20PermitABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof erc20PermitABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20PermitABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20PermitTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20PermitABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: erc20PermitABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof erc20PermitABI, "Transfer">);
}
