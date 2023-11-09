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
// TokenManagerMintBurnFrom
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenManagerMintBurnFromABI = [
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__.
 */
export function useTokenManagerMintBurnFromRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"contractId"`.
 */
export function useTokenManagerMintBurnFromContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"flowInAmount"`.
 */
export function useTokenManagerMintBurnFromFlowInAmount<
  TFunctionName extends "flowInAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "flowInAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"flowLimit"`.
 */
export function useTokenManagerMintBurnFromFlowLimit<
  TFunctionName extends "flowLimit",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "flowLimit",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"flowOutAmount"`.
 */
export function useTokenManagerMintBurnFromFlowOutAmount<
  TFunctionName extends "flowOutAmount",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "flowOutAmount",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"hasRole"`.
 */
export function useTokenManagerMintBurnFromHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"implementationType"`.
 */
export function useTokenManagerMintBurnFromImplementationType<
  TFunctionName extends "implementationType",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "implementationType",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useTokenManagerMintBurnFromInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"interchainTokenService"`.
 */
export function useTokenManagerMintBurnFromInterchainTokenService<
  TFunctionName extends "interchainTokenService",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "interchainTokenService",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"isOperator"`.
 */
export function useTokenManagerMintBurnFromIsOperator<
  TFunctionName extends "isOperator",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "isOperator",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"params"`.
 */
export function useTokenManagerMintBurnFromParams<
  TFunctionName extends "params",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "params",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"tokenAddress"`.
 */
export function useTokenManagerMintBurnFromTokenAddress<
  TFunctionName extends "tokenAddress",
  TSelectData = ReadContractResult<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: tokenManagerMintBurnFromABI,
    functionName: "tokenAddress",
    ...config,
  } as UseContractReadConfig<typeof tokenManagerMintBurnFromABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__.
 */
export function useTokenManagerMintBurnFromWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    TFunctionName,
    TMode
  >({ abi: tokenManagerMintBurnFromABI, ...config } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function useTokenManagerMintBurnFromAcceptOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "acceptOperatorship"
        >["request"]["abi"],
        "acceptOperatorship",
        TMode
      > & { functionName?: "acceptOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "acceptOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "acceptOperatorship",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "acceptOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function useTokenManagerMintBurnFromAddFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "addFlowLimiter"
        >["request"]["abi"],
        "addFlowLimiter",
        TMode
      > & { functionName?: "addFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "addFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "addFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "addFlowLimiter",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "addFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function useTokenManagerMintBurnFromCallContractWithInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "callContractWithInterchainToken"
        >["request"]["abi"],
        "callContractWithInterchainToken",
        TMode
      > & { functionName?: "callContractWithInterchainToken" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "callContractWithInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "callContractWithInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "callContractWithInterchainToken",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"giveToken"`.
 */
export function useTokenManagerMintBurnFromGiveToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "giveToken"
        >["request"]["abi"],
        "giveToken",
        TMode
      > & { functionName?: "giveToken" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "giveToken",
        TMode
      > & {
        abi?: never;
        functionName?: "giveToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "giveToken",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "giveToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useTokenManagerMintBurnFromInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "interchainTransfer",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function useTokenManagerMintBurnFromProposeOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "proposeOperatorship"
        >["request"]["abi"],
        "proposeOperatorship",
        TMode
      > & { functionName?: "proposeOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "proposeOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "proposeOperatorship",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "proposeOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function useTokenManagerMintBurnFromRemoveFlowLimiter<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "removeFlowLimiter"
        >["request"]["abi"],
        "removeFlowLimiter",
        TMode
      > & { functionName?: "removeFlowLimiter" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "removeFlowLimiter",
        TMode
      > & {
        abi?: never;
        functionName?: "removeFlowLimiter";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "removeFlowLimiter",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function useTokenManagerMintBurnFromSetFlowLimit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "setFlowLimit"
        >["request"]["abi"],
        "setFlowLimit",
        TMode
      > & { functionName?: "setFlowLimit" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "setFlowLimit",
        TMode
      > & {
        abi?: never;
        functionName?: "setFlowLimit";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "setFlowLimit",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "setFlowLimit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"setup"`.
 */
export function useTokenManagerMintBurnFromSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof tokenManagerMintBurnFromABI, "setup", TMode>({
    abi: tokenManagerMintBurnFromABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"takeToken"`.
 */
export function useTokenManagerMintBurnFromTakeToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "takeToken"
        >["request"]["abi"],
        "takeToken",
        TMode
      > & { functionName?: "takeToken" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "takeToken",
        TMode
      > & {
        abi?: never;
        functionName?: "takeToken";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "takeToken",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "takeToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function useTokenManagerMintBurnFromTransferOperatorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "transferOperatorship"
        >["request"]["abi"],
        "transferOperatorship",
        TMode
      > & { functionName?: "transferOperatorship" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "transferOperatorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOperatorship";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "transferOperatorship",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "transferOperatorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function useTokenManagerMintBurnFromTransmitInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenManagerMintBurnFromABI,
          "transmitInterchainTransfer"
        >["request"]["abi"],
        "transmitInterchainTransfer",
        TMode
      > & { functionName?: "transmitInterchainTransfer" }
    : UseContractWriteConfig<
        typeof tokenManagerMintBurnFromABI,
        "transmitInterchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "transmitInterchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof tokenManagerMintBurnFromABI,
    "transmitInterchainTransfer",
    TMode
  >({
    abi: tokenManagerMintBurnFromABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__.
 */
export function usePrepareTokenManagerMintBurnFromWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      TFunctionName
    >,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"acceptOperatorship"`.
 */
export function usePrepareTokenManagerMintBurnFromAcceptOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "acceptOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "acceptOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "acceptOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"addFlowLimiter"`.
 */
export function usePrepareTokenManagerMintBurnFromAddFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "addFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "addFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "addFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"callContractWithInterchainToken"`.
 */
export function usePrepareTokenManagerMintBurnFromCallContractWithInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "callContractWithInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "callContractWithInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "callContractWithInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"giveToken"`.
 */
export function usePrepareTokenManagerMintBurnFromGiveToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "giveToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "giveToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "giveToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareTokenManagerMintBurnFromInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"proposeOperatorship"`.
 */
export function usePrepareTokenManagerMintBurnFromProposeOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "proposeOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "proposeOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "proposeOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"removeFlowLimiter"`.
 */
export function usePrepareTokenManagerMintBurnFromRemoveFlowLimiter(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "removeFlowLimiter"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "removeFlowLimiter",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "removeFlowLimiter">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"setFlowLimit"`.
 */
export function usePrepareTokenManagerMintBurnFromSetFlowLimit(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "setFlowLimit"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "setFlowLimit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "setFlowLimit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareTokenManagerMintBurnFromSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"takeToken"`.
 */
export function usePrepareTokenManagerMintBurnFromTakeToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "takeToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "takeToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "takeToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"transferOperatorship"`.
 */
export function usePrepareTokenManagerMintBurnFromTransferOperatorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "transferOperatorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "transferOperatorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "transferOperatorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `functionName` set to `"transmitInterchainTransfer"`.
 */
export function usePrepareTokenManagerMintBurnFromTransmitInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof tokenManagerMintBurnFromABI,
      "transmitInterchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: tokenManagerMintBurnFromABI,
    functionName: "transmitInterchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenManagerMintBurnFromABI, "transmitInterchainTransfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__.
 */
export function useTokenManagerMintBurnFromEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerMintBurnFromABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerMintBurnFromABI,
    ...config,
  } as UseContractEventConfig<typeof tokenManagerMintBurnFromABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `eventName` set to `"FlowLimitSet"`.
 */
export function useTokenManagerMintBurnFromFlowLimitSetEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "FlowLimitSet">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerMintBurnFromABI,
    eventName: "FlowLimitSet",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "FlowLimitSet">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useTokenManagerMintBurnFromRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "RolesAdded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerMintBurnFromABI,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useTokenManagerMintBurnFromRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "RolesProposed">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerMintBurnFromABI,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenManagerMintBurnFromABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useTokenManagerMintBurnFromRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "RolesRemoved">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: tokenManagerMintBurnFromABI,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof tokenManagerMintBurnFromABI, "RolesRemoved">);
}
