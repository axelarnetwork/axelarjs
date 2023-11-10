/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from "wagmi";
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from "wagmi/actions";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterchainTokenFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenFactoryABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      {
        name: "interchainTokenServiceAddress",
        internalType: "address",
        type: "address",
      },
    ],
  },
  { type: "error", inputs: [], name: "ApproveFailed" },
  {
    type: "error",
    inputs: [{ name: "bytesAddress", internalType: "bytes", type: "bytes" }],
    name: "InvalidBytesLength",
  },
  { type: "error", inputs: [], name: "InvalidChainName" },
  { type: "error", inputs: [], name: "InvalidCodeHash" },
  { type: "error", inputs: [], name: "InvalidImplementation" },
  { type: "error", inputs: [], name: "InvalidOwner" },
  { type: "error", inputs: [], name: "InvalidOwnerAddress" },
  { type: "error", inputs: [], name: "MulticallFailed" },
  { type: "error", inputs: [], name: "NonZeroMintAmount" },
  {
    type: "error",
    inputs: [{ name: "distributor", internalType: "address", type: "address" }],
    name: "NotDistributor",
  },
  {
    type: "error",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "NotOperator",
  },
  { type: "error", inputs: [], name: "NotOwner" },
  { type: "error", inputs: [], name: "NotProxy" },
  { type: "error", inputs: [], name: "SetupFailed" },
  { type: "error", inputs: [], name: "TokenTransferFailed" },
  { type: "error", inputs: [], name: "ZeroAddress" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnershipTransferStarted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnershipTransferred",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newImplementation",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Upgraded",
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "canonicalInterchainTokenId",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [
      { name: "chainNameHash_", internalType: "bytes32", type: "bytes32" },
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "canonicalInterchainTokenSalt",
    outputs: [{ name: "salt", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "chainNameHash",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [],
    name: "contractId",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "name", internalType: "string", type: "string" },
      { name: "symbol", internalType: "string", type: "string" },
      { name: "decimals", internalType: "uint8", type: "uint8" },
      { name: "mintAmount", internalType: "uint256", type: "uint256" },
      { name: "distributor", internalType: "address", type: "address" },
    ],
    name: "deployInterchainToken",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "originalChain", internalType: "string", type: "string" },
      {
        name: "originalTokenAddress",
        internalType: "address",
        type: "address",
      },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployRemoteCanonicalInterchainToken",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "originalChainName", internalType: "string", type: "string" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "distributor", internalType: "address", type: "address" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployRemoteInterchainToken",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "implementation",
    outputs: [
      { name: "implementation_", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "interchainTokenAddress",
    outputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "interchainTokenId",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [
      { name: "chainNameHash_", internalType: "bytes32", type: "bytes32" },
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "interchainTokenSalt",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "interchainTransfer",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [{ name: "data", internalType: "bytes[]", type: "bytes[]" }],
    name: "multicall",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "owner_", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "pendingOwner",
    outputs: [{ name: "owner_", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "proposeOwnership",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "registerCanonicalInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "service",
    outputs: [
      {
        name: "",
        internalType: "contract IInterchainTokenService",
        type: "address",
      },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "setup",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "tokenApprove",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "tokenTransferFrom",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "newImplementation", internalType: "address", type: "address" },
      {
        name: "newImplementationCodeHash",
        internalType: "bytes32",
        type: "bytes32",
      },
      { name: "params", internalType: "bytes", type: "bytes" },
    ],
    name: "upgrade",
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function useInterchainTokenFactoryRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"canonicalInterchainTokenId"`.
 */
export function useInterchainTokenFactoryCanonicalInterchainTokenId<
  TFunctionName extends "canonicalInterchainTokenId",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "canonicalInterchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"canonicalInterchainTokenSalt"`.
 */
export function useInterchainTokenFactoryCanonicalInterchainTokenSalt<
  TFunctionName extends "canonicalInterchainTokenSalt",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "canonicalInterchainTokenSalt",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"chainNameHash"`.
 */
export function useInterchainTokenFactoryChainNameHash<
  TFunctionName extends "chainNameHash",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "chainNameHash",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"contractId"`.
 */
export function useInterchainTokenFactoryContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"implementation"`.
 */
export function useInterchainTokenFactoryImplementation<
  TFunctionName extends "implementation",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "implementation",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTokenAddress"`.
 */
export function useInterchainTokenFactoryInterchainTokenAddress<
  TFunctionName extends "interchainTokenAddress",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "interchainTokenAddress",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTokenId"`.
 */
export function useInterchainTokenFactoryInterchainTokenId<
  TFunctionName extends "interchainTokenId",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "interchainTokenId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTokenSalt"`.
 */
export function useInterchainTokenFactoryInterchainTokenSalt<
  TFunctionName extends "interchainTokenSalt",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "interchainTokenSalt",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"owner"`.
 */
export function useInterchainTokenFactoryOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"pendingOwner"`.
 */
export function useInterchainTokenFactoryPendingOwner<
  TFunctionName extends "pendingOwner",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "pendingOwner",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"service"`.
 */
export function useInterchainTokenFactoryService<
  TFunctionName extends "service",
  TSelectData = ReadContractResult<
    typeof interchainTokenFactoryABI,
    TFunctionName
  >
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenFactoryABI,
    functionName: "service",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenFactoryABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function useInterchainTokenFactoryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    TFunctionName,
    TMode
  >({ abi: interchainTokenFactoryABI, ...config } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"acceptOwnership"`.
 */
export function useInterchainTokenFactoryAcceptOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "acceptOwnership"
        >["request"]["abi"],
        "acceptOwnership",
        TMode
      > & { functionName?: "acceptOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "acceptOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "acceptOwnership",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "acceptOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployInterchainToken"`.
 */
export function useInterchainTokenFactoryDeployInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "deployInterchainToken"
        >["request"]["abi"],
        "deployInterchainToken",
        TMode
      > & { functionName?: "deployInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "deployInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "deployInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "deployInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteCanonicalInterchainToken"`.
 */
export function useInterchainTokenFactoryDeployRemoteCanonicalInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "deployRemoteCanonicalInterchainToken"
        >["request"]["abi"],
        "deployRemoteCanonicalInterchainToken",
        TMode
      > & { functionName?: "deployRemoteCanonicalInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "deployRemoteCanonicalInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployRemoteCanonicalInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "deployRemoteCanonicalInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "deployRemoteCanonicalInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteInterchainToken"`.
 */
export function useInterchainTokenFactoryDeployRemoteInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "deployRemoteInterchainToken"
        >["request"]["abi"],
        "deployRemoteInterchainToken",
        TMode
      > & { functionName?: "deployRemoteInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "deployRemoteInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "deployRemoteInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "deployRemoteInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "deployRemoteInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useInterchainTokenFactoryInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "interchainTransfer",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"multicall"`.
 */
export function useInterchainTokenFactoryMulticall<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "multicall"
        >["request"]["abi"],
        "multicall",
        TMode
      > & { functionName?: "multicall" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "multicall",
        TMode
      > & {
        abi?: never;
        functionName?: "multicall";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenFactoryABI, "multicall", TMode>(
    {
      abi: interchainTokenFactoryABI,
      functionName: "multicall",
      ...config,
    } as any
  );
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"proposeOwnership"`.
 */
export function useInterchainTokenFactoryProposeOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "proposeOwnership"
        >["request"]["abi"],
        "proposeOwnership",
        TMode
      > & { functionName?: "proposeOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "proposeOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "proposeOwnership",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "proposeOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"registerCanonicalInterchainToken"`.
 */
export function useInterchainTokenFactoryRegisterCanonicalInterchainToken<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "registerCanonicalInterchainToken"
        >["request"]["abi"],
        "registerCanonicalInterchainToken",
        TMode
      > & { functionName?: "registerCanonicalInterchainToken" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "registerCanonicalInterchainToken",
        TMode
      > & {
        abi?: never;
        functionName?: "registerCanonicalInterchainToken";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "registerCanonicalInterchainToken",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "registerCanonicalInterchainToken",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"setup"`.
 */
export function useInterchainTokenFactorySetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "setup",
        TMode
      > & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenFactoryABI, "setup", TMode>({
    abi: interchainTokenFactoryABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenApprove"`.
 */
export function useInterchainTokenFactoryTokenApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "tokenApprove"
        >["request"]["abi"],
        "tokenApprove",
        TMode
      > & { functionName?: "tokenApprove" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "tokenApprove",
        TMode
      > & {
        abi?: never;
        functionName?: "tokenApprove";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "tokenApprove",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "tokenApprove",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenTransferFrom"`.
 */
export function useInterchainTokenFactoryTokenTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "tokenTransferFrom"
        >["request"]["abi"],
        "tokenTransferFrom",
        TMode
      > & { functionName?: "tokenTransferFrom" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "tokenTransferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "tokenTransferFrom";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "tokenTransferFrom",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "tokenTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useInterchainTokenFactoryTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "transferOwnership",
        TMode
      > & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenFactoryABI,
    "transferOwnership",
    TMode
  >({
    abi: interchainTokenFactoryABI,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"upgrade"`.
 */
export function useInterchainTokenFactoryUpgrade<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenFactoryABI,
          "upgrade"
        >["request"]["abi"],
        "upgrade",
        TMode
      > & { functionName?: "upgrade" }
    : UseContractWriteConfig<
        typeof interchainTokenFactoryABI,
        "upgrade",
        TMode
      > & {
        abi?: never;
        functionName?: "upgrade";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenFactoryABI, "upgrade", TMode>({
    abi: interchainTokenFactoryABI,
    functionName: "upgrade",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function usePrepareInterchainTokenFactoryWrite<
  TFunctionName extends string
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      TFunctionName
    >,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"acceptOwnership"`.
 */
export function usePrepareInterchainTokenFactoryAcceptOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "acceptOwnership"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "acceptOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "acceptOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryDeployInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "deployInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "deployInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "deployInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteCanonicalInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryDeployRemoteCanonicalInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "deployRemoteCanonicalInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "deployRemoteCanonicalInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "deployRemoteCanonicalInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"deployRemoteInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryDeployRemoteInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "deployRemoteInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "deployRemoteInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "deployRemoteInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareInterchainTokenFactoryInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"multicall"`.
 */
export function usePrepareInterchainTokenFactoryMulticall(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "multicall"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "multicall",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "multicall">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"proposeOwnership"`.
 */
export function usePrepareInterchainTokenFactoryProposeOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "proposeOwnership"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "proposeOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "proposeOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"registerCanonicalInterchainToken"`.
 */
export function usePrepareInterchainTokenFactoryRegisterCanonicalInterchainToken(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "registerCanonicalInterchainToken"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "registerCanonicalInterchainToken",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "registerCanonicalInterchainToken">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareInterchainTokenFactorySetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenApprove"`.
 */
export function usePrepareInterchainTokenFactoryTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "tokenApprove"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "tokenApprove",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "tokenApprove">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"tokenTransferFrom"`.
 */
export function usePrepareInterchainTokenFactoryTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "tokenTransferFrom"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "tokenTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "tokenTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareInterchainTokenFactoryTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenFactoryABI,
      "transferOwnership"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "transferOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `functionName` set to `"upgrade"`.
 */
export function usePrepareInterchainTokenFactoryUpgrade(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "upgrade">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenFactoryABI,
    functionName: "upgrade",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenFactoryABI, "upgrade">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function useInterchainTokenFactoryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenFactoryABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `eventName` set to `"OwnershipTransferStarted"`.
 */
export function useInterchainTokenFactoryOwnershipTransferStartedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenFactoryABI,
      "OwnershipTransferStarted"
    >,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    eventName: "OwnershipTransferStarted",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, "OwnershipTransferStarted">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useInterchainTokenFactoryOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<
      typeof interchainTokenFactoryABI,
      "OwnershipTransferred"
    >,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenFactoryABI}__ and `eventName` set to `"Upgraded"`.
 */
export function useInterchainTokenFactoryUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenFactoryABI, "Upgraded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenFactoryABI,
    eventName: "Upgraded",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenFactoryABI, "Upgraded">);
}
