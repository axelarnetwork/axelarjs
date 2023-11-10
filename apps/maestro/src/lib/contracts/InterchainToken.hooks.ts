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
// InterchainToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenABI = [
  { type: "error", inputs: [], name: "InvalidAccount" },
  {
    type: "error",
    inputs: [
      { name: "fromAccount", internalType: "address", type: "address" },
      { name: "toAccount", internalType: "address", type: "address" },
      { name: "accountRoles", internalType: "uint256", type: "uint256" },
    ],
    name: "InvalidProposedRoles",
  },
  { type: "error", inputs: [], name: "InvalidS" },
  { type: "error", inputs: [], name: "InvalidSignature" },
  { type: "error", inputs: [], name: "InvalidV" },
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
  { type: "error", inputs: [], name: "NotProxy" },
  { type: "error", inputs: [], name: "PermitExpired" },
  { type: "error", inputs: [], name: "TokenManagerAddressZero" },
  { type: "error", inputs: [], name: "TokenNameEmpty" },
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "fromDistributor", internalType: "address", type: "address" },
    ],
    name: "acceptDistributorship",
    outputs: [],
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
      { name: "account", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "burn",
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
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
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
    inputs: [{ name: "addr", internalType: "address", type: "address" }],
    name: "isDistributor",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "distributor_", internalType: "address", type: "address" },
    ],
    name: "proposeDistributorship",
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
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenManager",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
      { name: "distributor_", internalType: "address", type: "address" },
    ],
    name: "transferDistributorship",
    outputs: [],
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
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__.
 */
export function useInterchainTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useInterchainTokenDomainSeparator<
  TFunctionName extends "DOMAIN_SEPARATOR",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "DOMAIN_SEPARATOR",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"allowance"`.
 */
export function useInterchainTokenAllowance<
  TFunctionName extends "allowance",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "allowance",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useInterchainTokenBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"contractId"`.
 */
export function useInterchainTokenContractId<
  TFunctionName extends "contractId",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "contractId",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"decimals"`.
 */
export function useInterchainTokenDecimals<
  TFunctionName extends "decimals",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "decimals",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"hasRole"`.
 */
export function useInterchainTokenHasRole<
  TFunctionName extends "hasRole",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "hasRole",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"isDistributor"`.
 */
export function useInterchainTokenIsDistributor<
  TFunctionName extends "isDistributor",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "isDistributor",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"name"`.
 */
export function useInterchainTokenName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"nameHash"`.
 */
export function useInterchainTokenNameHash<
  TFunctionName extends "nameHash",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "nameHash",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"nonces"`.
 */
export function useInterchainTokenNonces<
  TFunctionName extends "nonces",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "nonces",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"symbol"`.
 */
export function useInterchainTokenSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"tokenManager"`.
 */
export function useInterchainTokenTokenManager<
  TFunctionName extends "tokenManager",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "tokenManager",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useInterchainTokenTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof interchainTokenABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<
      typeof interchainTokenABI,
      TFunctionName,
      TSelectData
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: interchainTokenABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof interchainTokenABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__.
 */
export function useInterchainTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          string
        >["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        TFunctionName,
        TMode
      > & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, TFunctionName, TMode>({
    abi: interchainTokenABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"acceptDistributorship"`.
 */
export function useInterchainTokenAcceptDistributorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "acceptDistributorship"
        >["request"]["abi"],
        "acceptDistributorship",
        TMode
      > & { functionName?: "acceptDistributorship" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "acceptDistributorship",
        TMode
      > & {
        abi?: never;
        functionName?: "acceptDistributorship";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "acceptDistributorship",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "acceptDistributorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"approve"`.
 */
export function useInterchainTokenApprove<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof interchainTokenABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "approve", TMode>({
    abi: interchainTokenABI,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"burn"`.
 */
export function useInterchainTokenBurn<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "burn"
        >["request"]["abi"],
        "burn",
        TMode
      > & { functionName?: "burn" }
    : UseContractWriteConfig<typeof interchainTokenABI, "burn", TMode> & {
        abi?: never;
        functionName?: "burn";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "burn", TMode>({
    abi: interchainTokenABI,
    functionName: "burn",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useInterchainTokenDecreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "decreaseAllowance"
        >["request"]["abi"],
        "decreaseAllowance",
        TMode
      > & { functionName?: "decreaseAllowance" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "decreaseAllowance",
        TMode
      > & {
        abi?: never;
        functionName?: "decreaseAllowance";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "decreaseAllowance",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "decreaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useInterchainTokenIncreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "increaseAllowance"
        >["request"]["abi"],
        "increaseAllowance",
        TMode
      > & { functionName?: "increaseAllowance" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "increaseAllowance",
        TMode
      > & {
        abi?: never;
        functionName?: "increaseAllowance";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "increaseAllowance",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "increaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function useInterchainTokenInterchainTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "interchainTransfer"
        >["request"]["abi"],
        "interchainTransfer",
        TMode
      > & { functionName?: "interchainTransfer" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "interchainTransfer",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransfer";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "interchainTransfer",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "interchainTransfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"interchainTransferFrom"`.
 */
export function useInterchainTokenInterchainTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "interchainTransferFrom"
        >["request"]["abi"],
        "interchainTransferFrom",
        TMode
      > & { functionName?: "interchainTransferFrom" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "interchainTransferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "interchainTransferFrom";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "interchainTransferFrom",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "interchainTransferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"mint"`.
 */
export function useInterchainTokenMint<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "mint"
        >["request"]["abi"],
        "mint",
        TMode
      > & { functionName?: "mint" }
    : UseContractWriteConfig<typeof interchainTokenABI, "mint", TMode> & {
        abi?: never;
        functionName?: "mint";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "mint", TMode>({
    abi: interchainTokenABI,
    functionName: "mint",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"permit"`.
 */
export function useInterchainTokenPermit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "permit"
        >["request"]["abi"],
        "permit",
        TMode
      > & { functionName?: "permit" }
    : UseContractWriteConfig<typeof interchainTokenABI, "permit", TMode> & {
        abi?: never;
        functionName?: "permit";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "permit", TMode>({
    abi: interchainTokenABI,
    functionName: "permit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"proposeDistributorship"`.
 */
export function useInterchainTokenProposeDistributorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "proposeDistributorship"
        >["request"]["abi"],
        "proposeDistributorship",
        TMode
      > & { functionName?: "proposeDistributorship" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "proposeDistributorship",
        TMode
      > & {
        abi?: never;
        functionName?: "proposeDistributorship";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "proposeDistributorship",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "proposeDistributorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"setup"`.
 */
export function useInterchainTokenSetup<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "setup"
        >["request"]["abi"],
        "setup",
        TMode
      > & { functionName?: "setup" }
    : UseContractWriteConfig<typeof interchainTokenABI, "setup", TMode> & {
        abi?: never;
        functionName?: "setup";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "setup", TMode>({
    abi: interchainTokenABI,
    functionName: "setup",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function useInterchainTokenTransfer<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "transfer"
        >["request"]["abi"],
        "transfer",
        TMode
      > & { functionName?: "transfer" }
    : UseContractWriteConfig<typeof interchainTokenABI, "transfer", TMode> & {
        abi?: never;
        functionName?: "transfer";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "transfer", TMode>({
    abi: interchainTokenABI,
    functionName: "transfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"transferDistributorship"`.
 */
export function useInterchainTokenTransferDistributorship<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "transferDistributorship"
        >["request"]["abi"],
        "transferDistributorship",
        TMode
      > & { functionName?: "transferDistributorship" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "transferDistributorship",
        TMode
      > & {
        abi?: never;
        functionName?: "transferDistributorship";
      } = {} as any
) {
  return useContractWrite<
    typeof interchainTokenABI,
    "transferDistributorship",
    TMode
  >({
    abi: interchainTokenABI,
    functionName: "transferDistributorship",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useInterchainTokenTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof interchainTokenABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<
        typeof interchainTokenABI,
        "transferFrom",
        TMode
      > & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof interchainTokenABI, "transferFrom", TMode>({
    abi: interchainTokenABI,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__.
 */
export function usePrepareInterchainTokenWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"acceptDistributorship"`.
 */
export function usePrepareInterchainTokenAcceptDistributorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "acceptDistributorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "acceptDistributorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "acceptDistributorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareInterchainTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareInterchainTokenBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "burn">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "burn",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "burn">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareInterchainTokenDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "decreaseAllowance"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "decreaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "decreaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareInterchainTokenIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "increaseAllowance"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "increaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "increaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"interchainTransfer"`.
 */
export function usePrepareInterchainTokenInterchainTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "interchainTransfer"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "interchainTransfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "interchainTransfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"interchainTransferFrom"`.
 */
export function usePrepareInterchainTokenInterchainTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "interchainTransferFrom"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "interchainTransferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "interchainTransferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareInterchainTokenMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "mint">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "mint",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "mint">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"permit"`.
 */
export function usePrepareInterchainTokenPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "permit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "permit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "permit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"proposeDistributorship"`.
 */
export function usePrepareInterchainTokenProposeDistributorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "proposeDistributorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "proposeDistributorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "proposeDistributorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"setup"`.
 */
export function usePrepareInterchainTokenSetup(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "setup">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "setup",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "setup">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareInterchainTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "transfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "transfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "transfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"transferDistributorship"`.
 */
export function usePrepareInterchainTokenTransferDistributorship(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof interchainTokenABI,
      "transferDistributorship"
    >,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "transferDistributorship",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "transferDistributorship">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link interchainTokenABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareInterchainTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof interchainTokenABI, "transferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: interchainTokenABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof interchainTokenABI, "transferFrom">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenABI}__.
 */
export function useInterchainTokenEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenABI,
    ...config,
  } as UseContractEventConfig<typeof interchainTokenABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenABI}__ and `eventName` set to `"Approval"`.
 */
export function useInterchainTokenApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenABI}__ and `eventName` set to `"RolesAdded"`.
 */
export function useInterchainTokenRolesAddedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenABI, "RolesAdded">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenABI,
    eventName: "RolesAdded",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenABI, "RolesAdded">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenABI}__ and `eventName` set to `"RolesProposed"`.
 */
export function useInterchainTokenRolesProposedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenABI, "RolesProposed">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenABI,
    eventName: "RolesProposed",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenABI, "RolesProposed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenABI}__ and `eventName` set to `"RolesRemoved"`.
 */
export function useInterchainTokenRolesRemovedEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenABI, "RolesRemoved">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenABI,
    eventName: "RolesRemoved",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenABI, "RolesRemoved">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link interchainTokenABI}__ and `eventName` set to `"Transfer"`.
 */
export function useInterchainTokenTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof interchainTokenABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: interchainTokenABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof interchainTokenABI, "Transfer">);
}
