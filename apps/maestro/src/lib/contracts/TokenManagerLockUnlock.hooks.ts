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
// TokenManagerLockUnlock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenManagerLockUnlockABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      {
        name: "interchainTokenService_",
        internalType: "address",
        type: "address",
      },
    ],
  },
  {
    type: "error",
    inputs: [{ name: "flowLimiter", internalType: "address", type: "address" }],
    name: "AlreadyFlowLimiter",
  },
  {
    type: "error",
    inputs: [
      { name: "limit", internalType: "uint256", type: "uint256" },
      { name: "flowAmount", internalType: "uint256", type: "uint256" },
    ],
    name: "FlowLimitExceeded",
  },
  { type: "error", inputs: [], name: "GiveTokenFailed" },
  {
    type: "error",
    inputs: [{ name: "bytesAddress", internalType: "bytes", type: "bytes" }],
    name: "InvalidBytesLength",
  },
  {
    type: "error",
    inputs: [
      { name: "fromAccount", internalType: "address", type: "address" },
      { name: "toAccount", internalType: "address", type: "address" },
      { name: "accountRoles", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidProposedRoles",
  },
  {
    type: "error",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "accountRoles", internalType: "uint256", type: "uint256" },
    ],
    name: "MissingAllRoles",
  },
  {
    type: "error",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "accountRoles", internalType: "uint256", type: "uint256" },
    ],
    name: "MissingAnyOfRoles",
  },
  {
    type: "error",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "role", internalType: "uint8", type: "uint8" },
    ],
    name: "MissingRole",
  },
  {
    type: "error",
    inputs: [{ name: "flowLimiter", internalType: "address", type: "address" }],
    name: "NotFlowLimiter",
  },
  { type: "error", inputs: [], name: "NotProxy" },
  {
    type: "error",
    inputs: [{ name: "caller", internalType: "address", type: "address" }],
    name: "NotService",
  },
  {
    type: "error",
    inputs: [{ name: "caller", internalType: "address", type: "address" }],
    name: "NotToken",
  },
  { type: "error", inputs: [], name: "TakeTokenFailed" },
  { type: "error", inputs: [], name: "TokenLinkerZeroAddress" },
  { type: "error", inputs: [], name: "TokenTransferFailed" },
  { type: "error", inputs: [], name: "ZeroAddress" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "tokenId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "operator",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "flowLimit_",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "FlowLimitSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "accountRoles",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "RolesAdded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "fromAccount",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "toAccount",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "accountRoles",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "RolesProposed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "accountRoles",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "RolesRemoved",
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "fromOperator", internalType: "address", type: "address" },
    ],
    name: "acceptOperatorship",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "flowLimiter", internalType: "address", type: "address" }],
    name: "addFlowLimiter",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "callContractWithInterchainToken",
    outputs: [],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "contractId",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "flowInAmount",
    outputs: [
      { name: "flowInAmount_", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "flowLimit",
    outputs: [{ name: "flowLimit_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "flowOutAmount",
    outputs: [
      { name: "flowOutAmount_", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "destinationAddress", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "giveToken",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "role", internalType: "uint8", type: "uint8" },
    ],
    name: "hasRole",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "implementationType",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "interchainTokenId",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "interchainTokenService",
    outputs: [
      {
        name: "",
        internalType: "contract IInterchainTokenService",
        type: "address",
      },
    ],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "interchainTransfer",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "addr", internalType: "address", type: "address" }],
    name: "isOperator",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [
      { name: "operator_", internalType: "bytes", type: "bytes" },
      { name: "tokenAddress_", internalType: "address", type: "address" },
    ],
    name: "params",
    outputs: [{ name: "params_", internalType: "bytes", type: "bytes" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "proposeOperatorship",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "flowLimiter", internalType: "address", type: "address" }],
    name: "removeFlowLimiter",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "flowLimit_", internalType: "uint256", type: "uint256" }],
    name: "setFlowLimit",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "params", internalType: "bytes", type: "bytes" }],
    name: "setup",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "sourceAddress", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "takeToken",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenAddress",
    outputs: [
      { name: "tokenAddress_", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "transferOperatorship",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "transmitInterchainTransfer",
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__.
 */
export function useTokenManagerLockUnlockRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"contractId"`.
 */
export function useTokenManagerLockUnlockContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"flowInAmount"`.
 */
export function useTokenManagerLockUnlockFlowInAmount<
  TFunctionName extends "flowInAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "flowInAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"flowLimit"`.
 */
export function useTokenManagerLockUnlockFlowLimit<
  TFunctionName extends "flowLimit",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "flowLimit",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"flowOutAmount"`.
 */
export function useTokenManagerLockUnlockFlowOutAmount<
  TFunctionName extends "flowOutAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "flowOutAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"hasRole"`.
 */
export function useTokenManagerLockUnlockHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"implementationType"`.
 */
export function useTokenManagerLockUnlockImplementationType<
  TFunctionName extends "implementationType",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "implementationType",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useTokenManagerLockUnlockInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"interchainTokenService"`.
 */
export function useTokenManagerLockUnlockInterchainTokenService<
  TFunctionName extends "interchainTokenService",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "interchainTokenService",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"isOperator"`.
 */
export function useTokenManagerLockUnlockIsOperator<
  TFunctionName extends "isOperator",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "isOperator",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"params"`.
 */
export function useTokenManagerLockUnlockParams<
  TFunctionName extends "params",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "params",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"tokenAddress"`.
 */
export function useTokenManagerLockUnlockTokenAddress<
  TFunctionName extends "tokenAddress",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockABI,
    functionName: "tokenAddress",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__.
 */
export function useTokenManagerLockUnlockWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    TFunctionName,
    TMode
  >({ abi: tokenManagerLockUnlockABI, ...config } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function useTokenManagerLockUnlockAcceptOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "acceptOperatorship"
        >["request"]["abi"],
        "acceptOperatorship",
        TMode
      > & { functionName?: "acceptOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "acceptOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "acceptOperatorship",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "acceptOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function useTokenManagerLockUnlockAddFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "addFlowLimiter"
        >["request"]["abi"],
        "addFlowLimiter",
        TMode
      > & { functionName?: "addFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "addFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "addFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "addFlowLimiter",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "addFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function useTokenManagerLockUnlockCallContractWithInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "callContractWithInterchainToken"
        >["request"]["abi"],
        "callContractWithInterchainToken",
        TMode
      > & { functionName?: "callContractWithInterchainToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "callContractWithInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "callContractWithInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "callContractWithInterchainToken",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"giveToken"`.
 */
export function useTokenManagerLockUnlockGiveToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "giveToken"
        >["request"]["abi"],
        "giveToken",
        TMode
      > & { functionName?: "giveToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "giveToken",
        TMode
      > & {
        abi?: never;
        functionName?: "giveToken";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerLockUnlockABI, "giveToken", TMode>(
    {
      abi: tokenManagerLockUnlockABI,
      functionName: "giveToken",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useTokenManagerLockUnlockInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "interchainTransfer",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function useTokenManagerLockUnlockProposeOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "proposeOperatorship"
        >["request"]["abi"],
        "proposeOperatorship",
        TMode
      > & { functionName?: "proposeOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "proposeOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "proposeOperatorship",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "proposeOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function useTokenManagerLockUnlockRemoveFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "removeFlowLimiter"
        >["request"]["abi"],
        "removeFlowLimiter",
        TMode
      > & { functionName?: "removeFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "removeFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "removeFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "removeFlowLimiter",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function useTokenManagerLockUnlockSetFlowLimit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "setFlowLimit"
        >["request"]["abi"],
        "setFlowLimit",
        TMode
      > & { functionName?: "setFlowLimit" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "setFlowLimit",
        TMode
      > & {
        abi?: never;
        functionName?: "setFlowLimit";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "setFlowLimit",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "setFlowLimit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"setup"`.
 */
export function useTokenManagerLockUnlockSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerLockUnlockABI, "setup", TMode>({
    abi: tokenManagerLockUnlockABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"takeToken"`.
 */
export function useTokenManagerLockUnlockTakeToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "takeToken"
        >["request"]["abi"],
        "takeToken",
        TMode
      > & { functionName?: "takeToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "takeToken",
        TMode
      > & {
        abi?: never;
        functionName?: "takeToken";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerLockUnlockABI, "takeToken", TMode>(
    {
      abi: tokenManagerLockUnlockABI,
      functionName: "takeToken",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function useTokenManagerLockUnlockTransferOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "transferOperatorship"
        >["request"]["abi"],
        "transferOperatorship",
        TMode
      > & { functionName?: "transferOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "transferOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "transferOperatorship",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "transferOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function useTokenManagerLockUnlockTransmitInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockABI,
          "transmitInterchainTransfer"
        >["request"]["abi"],
        "transmitInterchainTransfer",
        TMode
      > & { functionName?: "transmitInterchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockABI,
        "transmitInterchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transmitInterchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockABI,
    "transmitInterchainTransfer",
    TMode
  >({
    abi: tokenManagerLockUnlockABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__.
 */
export function usePrepareTokenManagerLockUnlockWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      TFunctionName
    >,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function usePrepareTokenManagerLockUnlockAcceptOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "acceptOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "acceptOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "acceptOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function usePrepareTokenManagerLockUnlockAddFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "addFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "addFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "addFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function usePrepareTokenManagerLockUnlockCallContractWithInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "callContractWithInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "callContractWithInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"giveToken"`.
 */
export function usePrepareTokenManagerLockUnlockGiveToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "giveToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "giveToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "giveToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareTokenManagerLockUnlockInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function usePrepareTokenManagerLockUnlockProposeOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "proposeOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "proposeOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "proposeOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function usePrepareTokenManagerLockUnlockRemoveFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "removeFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "removeFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function usePrepareTokenManagerLockUnlockSetFlowLimit(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "setFlowLimit"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "setFlowLimit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "setFlowLimit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareTokenManagerLockUnlockSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"takeToken"`.
 */
export function usePrepareTokenManagerLockUnlockTakeToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "takeToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "takeToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "takeToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function usePrepareTokenManagerLockUnlockTransferOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "transferOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "transferOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "transferOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function usePrepareTokenManagerLockUnlockTransmitInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockABI,
      "transmitInterchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockABI, "transmitInterchainTransfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__.
 */
export function useTokenManagerLockUnlockEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockABI,
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `eventName` set to `"FlowLimitSet"`.
 */
export function useTokenManagerLockUnlockFlowLimitSetEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockABI, "FlowLimitSet">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockABI,
    eventName: "FlowLimitSet",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockABI, "FlowLimitSet">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useTokenManagerLockUnlockRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockABI, "RolesAdded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockABI,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useTokenManagerLockUnlockRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockABI, "RolesProposed">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockABI,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useTokenManagerLockUnlockRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockABI, "RolesRemoved">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockABI,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockABI, "RolesRemoved">);
}
