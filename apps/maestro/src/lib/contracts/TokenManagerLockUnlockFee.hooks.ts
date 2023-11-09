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
// TokenManagerLockUnlockFee
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenManagerLockUnlockFeeABI = [
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
  { type: "error", inputs: [], name: "ReentrantCall" },
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__.
 */
export function useTokenManagerLockUnlockFeeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"contractId"`.
 */
export function useTokenManagerLockUnlockFeeContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"flowInAmount"`.
 */
export function useTokenManagerLockUnlockFeeFlowInAmount<
  TFunctionName extends "flowInAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "flowInAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"flowLimit"`.
 */
export function useTokenManagerLockUnlockFeeFlowLimit<
  TFunctionName extends "flowLimit",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "flowLimit",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"flowOutAmount"`.
 */
export function useTokenManagerLockUnlockFeeFlowOutAmount<
  TFunctionName extends "flowOutAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "flowOutAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"hasRole"`.
 */
export function useTokenManagerLockUnlockFeeHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"implementationType"`.
 */
export function useTokenManagerLockUnlockFeeImplementationType<
  TFunctionName extends "implementationType",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "implementationType",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useTokenManagerLockUnlockFeeInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"interchainTokenService"`.
 */
export function useTokenManagerLockUnlockFeeInterchainTokenService<
  TFunctionName extends "interchainTokenService",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "interchainTokenService",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"isOperator"`.
 */
export function useTokenManagerLockUnlockFeeIsOperator<
  TFunctionName extends "isOperator",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "isOperator",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"params"`.
 */
export function useTokenManagerLockUnlockFeeParams<
  TFunctionName extends "params",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "params",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"tokenAddress"`.
 */
export function useTokenManagerLockUnlockFeeTokenAddress<
  TFunctionName extends "tokenAddress",
  TSelectData = ReadContractResult<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "tokenAddress",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__.
 */
export function useTokenManagerLockUnlockFeeWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    TFunctionName,
    TMode
  >({ abi: tokenManagerLockUnlockFeeABI, ...config } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function useTokenManagerLockUnlockFeeAcceptOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "acceptOperatorship"
        >["request"]["abi"],
        "acceptOperatorship",
        TMode
      > & { functionName?: "acceptOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "acceptOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "acceptOperatorship",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "acceptOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function useTokenManagerLockUnlockFeeAddFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "addFlowLimiter"
        >["request"]["abi"],
        "addFlowLimiter",
        TMode
      > & { functionName?: "addFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "addFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "addFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "addFlowLimiter",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "addFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function useTokenManagerLockUnlockFeeCallContractWithInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "callContractWithInterchainToken"
        >["request"]["abi"],
        "callContractWithInterchainToken",
        TMode
      > & { functionName?: "callContractWithInterchainToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "callContractWithInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "callContractWithInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "callContractWithInterchainToken",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"giveToken"`.
 */
export function useTokenManagerLockUnlockFeeGiveToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "giveToken"
        >["request"]["abi"],
        "giveToken",
        TMode
      > & { functionName?: "giveToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "giveToken",
        TMode
      > & {
        abi?: never;
        functionName?: "giveToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "giveToken",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "giveToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useTokenManagerLockUnlockFeeInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "interchainTransfer",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function useTokenManagerLockUnlockFeeProposeOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "proposeOperatorship"
        >["request"]["abi"],
        "proposeOperatorship",
        TMode
      > & { functionName?: "proposeOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "proposeOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "proposeOperatorship",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "proposeOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function useTokenManagerLockUnlockFeeRemoveFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "removeFlowLimiter"
        >["request"]["abi"],
        "removeFlowLimiter",
        TMode
      > & { functionName?: "removeFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "removeFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "removeFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "removeFlowLimiter",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function useTokenManagerLockUnlockFeeSetFlowLimit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "setFlowLimit"
        >["request"]["abi"],
        "setFlowLimit",
        TMode
      > & { functionName?: "setFlowLimit" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "setFlowLimit",
        TMode
      > & {
        abi?: never;
        functionName?: "setFlowLimit";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "setFlowLimit",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "setFlowLimit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"setup"`.
 */
export function useTokenManagerLockUnlockFeeSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerLockUnlockFeeABI, "setup", TMode>({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"takeToken"`.
 */
export function useTokenManagerLockUnlockFeeTakeToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "takeToken"
        >["request"]["abi"],
        "takeToken",
        TMode
      > & { functionName?: "takeToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "takeToken",
        TMode
      > & {
        abi?: never;
        functionName?: "takeToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "takeToken",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "takeToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function useTokenManagerLockUnlockFeeTransferOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "transferOperatorship"
        >["request"]["abi"],
        "transferOperatorship",
        TMode
      > & { functionName?: "transferOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "transferOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "transferOperatorship",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "transferOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function useTokenManagerLockUnlockFeeTransmitInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLockUnlockFeeABI,
          "transmitInterchainTransfer"
        >["request"]["abi"],
        "transmitInterchainTransfer",
        TMode
      > & { functionName?: "transmitInterchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerLockUnlockFeeABI,
        "transmitInterchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transmitInterchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLockUnlockFeeABI,
    "transmitInterchainTransfer",
    TMode
  >({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__.
 */
export function usePrepareTokenManagerLockUnlockFeeWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      TFunctionName
    >,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function usePrepareTokenManagerLockUnlockFeeAcceptOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "acceptOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "acceptOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "acceptOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function usePrepareTokenManagerLockUnlockFeeAddFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "addFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "addFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "addFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function usePrepareTokenManagerLockUnlockFeeCallContractWithInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "callContractWithInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "callContractWithInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"giveToken"`.
 */
export function usePrepareTokenManagerLockUnlockFeeGiveToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "giveToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "giveToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "giveToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareTokenManagerLockUnlockFeeInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function usePrepareTokenManagerLockUnlockFeeProposeOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "proposeOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "proposeOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "proposeOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function usePrepareTokenManagerLockUnlockFeeRemoveFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "removeFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "removeFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function usePrepareTokenManagerLockUnlockFeeSetFlowLimit(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "setFlowLimit"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "setFlowLimit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "setFlowLimit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareTokenManagerLockUnlockFeeSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"takeToken"`.
 */
export function usePrepareTokenManagerLockUnlockFeeTakeToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "takeToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "takeToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "takeToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function usePrepareTokenManagerLockUnlockFeeTransferOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "transferOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "transferOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "transferOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function usePrepareTokenManagerLockUnlockFeeTransmitInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "transmitInterchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLockUnlockFeeABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLockUnlockFeeABI, "transmitInterchainTransfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__.
 */
export function useTokenManagerLockUnlockFeeEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockFeeABI,
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `eventName` set to `"FlowLimitSet"`.
 */
export function useTokenManagerLockUnlockFeeFlowLimitSetEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "FlowLimitSet">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockFeeABI,
    eventName: "FlowLimitSet",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "FlowLimitSet">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useTokenManagerLockUnlockFeeRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "RolesAdded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockFeeABI,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useTokenManagerLockUnlockFeeRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof tokenManagerLockUnlockFeeABI,
      "RolesProposed"
    >,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockFeeABI,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLockUnlockFeeABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useTokenManagerLockUnlockFeeRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "RolesRemoved">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLockUnlockFeeABI,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLockUnlockFeeABI, "RolesRemoved">);
}
