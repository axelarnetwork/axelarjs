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
// TokenManagerLiquidityPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenManagerLiquidityPoolABI = [
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
  { type: "error", inputs: [], name: "NotSupported" },
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
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "liquidityPool",
    outputs: [
      { name: "liquidityPool_", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [
      { name: "operator_", internalType: "bytes", type: "bytes" },
      { name: "tokenAddress_", internalType: "address", type: "address" },
      {
        name: "liquidityPoolAddress",
        internalType: "address",
        type: "address",
      },
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
    inputs: [
      { name: "newLiquidityPool", internalType: "address", type: "address" },
    ],
    name: "setLiquidityPool",
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__.
 */
export function useTokenManagerLiquidityPoolRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"contractId"`.
 */
export function useTokenManagerLiquidityPoolContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"flowInAmount"`.
 */
export function useTokenManagerLiquidityPoolFlowInAmount<
  TFunctionName extends "flowInAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "flowInAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"flowLimit"`.
 */
export function useTokenManagerLiquidityPoolFlowLimit<
  TFunctionName extends "flowLimit",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "flowLimit",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"flowOutAmount"`.
 */
export function useTokenManagerLiquidityPoolFlowOutAmount<
  TFunctionName extends "flowOutAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "flowOutAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"hasRole"`.
 */
export function useTokenManagerLiquidityPoolHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"implementationType"`.
 */
export function useTokenManagerLiquidityPoolImplementationType<
  TFunctionName extends "implementationType",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "implementationType",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useTokenManagerLiquidityPoolInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"interchainTokenService"`.
 */
export function useTokenManagerLiquidityPoolInterchainTokenService<
  TFunctionName extends "interchainTokenService",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "interchainTokenService",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"isOperator"`.
 */
export function useTokenManagerLiquidityPoolIsOperator<
  TFunctionName extends "isOperator",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "isOperator",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"liquidityPool"`.
 */
export function useTokenManagerLiquidityPoolLiquidityPool<
  TFunctionName extends "liquidityPool",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "liquidityPool",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"params"`.
 */
export function useTokenManagerLiquidityPoolParams<
  TFunctionName extends "params",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "params",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"tokenAddress"`.
 */
export function useTokenManagerLiquidityPoolTokenAddress<
  TFunctionName extends "tokenAddress",
  TSelectData = ReadContractResult<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "tokenAddress",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__.
 */
export function useTokenManagerLiquidityPoolWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    TFunctionName,
    TMode
  >({ abi: tokenManagerLiquidityPoolABI, ...config } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function useTokenManagerLiquidityPoolAcceptOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "acceptOperatorship"
        >["request"]["abi"],
        "acceptOperatorship",
        TMode
      > & { functionName?: "acceptOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "acceptOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "acceptOperatorship",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "acceptOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function useTokenManagerLiquidityPoolAddFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "addFlowLimiter"
        >["request"]["abi"],
        "addFlowLimiter",
        TMode
      > & { functionName?: "addFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "addFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "addFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "addFlowLimiter",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "addFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function useTokenManagerLiquidityPoolCallContractWithInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "callContractWithInterchainToken"
        >["request"]["abi"],
        "callContractWithInterchainToken",
        TMode
      > & { functionName?: "callContractWithInterchainToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "callContractWithInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "callContractWithInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "callContractWithInterchainToken",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"giveToken"`.
 */
export function useTokenManagerLiquidityPoolGiveToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "giveToken"
        >["request"]["abi"],
        "giveToken",
        TMode
      > & { functionName?: "giveToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "giveToken",
        TMode
      > & {
        abi?: never;
        functionName?: "giveToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "giveToken",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "giveToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useTokenManagerLiquidityPoolInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "interchainTransfer",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function useTokenManagerLiquidityPoolProposeOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "proposeOperatorship"
        >["request"]["abi"],
        "proposeOperatorship",
        TMode
      > & { functionName?: "proposeOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "proposeOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "proposeOperatorship",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "proposeOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function useTokenManagerLiquidityPoolRemoveFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "removeFlowLimiter"
        >["request"]["abi"],
        "removeFlowLimiter",
        TMode
      > & { functionName?: "removeFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "removeFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "removeFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "removeFlowLimiter",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function useTokenManagerLiquidityPoolSetFlowLimit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "setFlowLimit"
        >["request"]["abi"],
        "setFlowLimit",
        TMode
      > & { functionName?: "setFlowLimit" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "setFlowLimit",
        TMode
      > & {
        abi?: never;
        functionName?: "setFlowLimit";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "setFlowLimit",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "setFlowLimit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"setLiquidityPool"`.
 */
export function useTokenManagerLiquidityPoolSetLiquidityPool<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "setLiquidityPool"
        >["request"]["abi"],
        "setLiquidityPool",
        TMode
      > & { functionName?: "setLiquidityPool" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "setLiquidityPool",
        TMode
      > & {
        abi?: never;
        functionName?: "setLiquidityPool";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "setLiquidityPool",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "setLiquidityPool",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"setup"`.
 */
export function useTokenManagerLiquidityPoolSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerLiquidityPoolABI, "setup", TMode>({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"takeToken"`.
 */
export function useTokenManagerLiquidityPoolTakeToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "takeToken"
        >["request"]["abi"],
        "takeToken",
        TMode
      > & { functionName?: "takeToken" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "takeToken",
        TMode
      > & {
        abi?: never;
        functionName?: "takeToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "takeToken",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "takeToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function useTokenManagerLiquidityPoolTransferOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "transferOperatorship"
        >["request"]["abi"],
        "transferOperatorship",
        TMode
      > & { functionName?: "transferOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "transferOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "transferOperatorship",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "transferOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function useTokenManagerLiquidityPoolTransmitInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerLiquidityPoolABI,
          "transmitInterchainTransfer"
        >["request"]["abi"],
        "transmitInterchainTransfer",
        TMode
      > & { functionName?: "transmitInterchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerLiquidityPoolABI,
        "transmitInterchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transmitInterchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerLiquidityPoolABI,
    "transmitInterchainTransfer",
    TMode
  >({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__.
 */
export function usePrepareTokenManagerLiquidityPoolWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      TFunctionName
    >,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function usePrepareTokenManagerLiquidityPoolAcceptOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "acceptOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "acceptOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "acceptOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function usePrepareTokenManagerLiquidityPoolAddFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "addFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "addFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "addFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function usePrepareTokenManagerLiquidityPoolCallContractWithInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "callContractWithInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "callContractWithInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"giveToken"`.
 */
export function usePrepareTokenManagerLiquidityPoolGiveToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "giveToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "giveToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "giveToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareTokenManagerLiquidityPoolInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function usePrepareTokenManagerLiquidityPoolProposeOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "proposeOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "proposeOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "proposeOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function usePrepareTokenManagerLiquidityPoolRemoveFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "removeFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "removeFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function usePrepareTokenManagerLiquidityPoolSetFlowLimit(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "setFlowLimit"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "setFlowLimit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "setFlowLimit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"setLiquidityPool"`.
 */
export function usePrepareTokenManagerLiquidityPoolSetLiquidityPool(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "setLiquidityPool"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "setLiquidityPool",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "setLiquidityPool">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareTokenManagerLiquidityPoolSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"takeToken"`.
 */
export function usePrepareTokenManagerLiquidityPoolTakeToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "takeToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "takeToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "takeToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function usePrepareTokenManagerLiquidityPoolTransferOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "transferOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "transferOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "transferOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function usePrepareTokenManagerLiquidityPoolTransmitInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerLiquidityPoolABI,
      "transmitInterchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerLiquidityPoolABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerLiquidityPoolABI, "transmitInterchainTransfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__.
 */
export function useTokenManagerLiquidityPoolEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLiquidityPoolABI,
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `eventName` set to `"FlowLimitSet"`.
 */
export function useTokenManagerLiquidityPoolFlowLimitSetEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "FlowLimitSet">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLiquidityPoolABI,
    eventName: "FlowLimitSet",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "FlowLimitSet">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useTokenManagerLiquidityPoolRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "RolesAdded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLiquidityPoolABI,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useTokenManagerLiquidityPoolRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof tokenManagerLiquidityPoolABI,
      "RolesProposed"
    >,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLiquidityPoolABI,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerLiquidityPoolABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useTokenManagerLiquidityPoolRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "RolesRemoved">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerLiquidityPoolABI,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerLiquidityPoolABI, "RolesRemoved">);
}
