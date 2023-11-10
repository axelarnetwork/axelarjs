/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
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
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function getInterchainTokenFactory(
  config: Omit<GetContractArgs, "abi">
) {
  return getContract({ abi: interchainTokenFactoryABI, ...config });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function readInterchainTokenFactory<
  TAbi extends readonly unknown[] = typeof interchainTokenFactoryABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi">) {
  return readContract({
    abi: interchainTokenFactoryABI,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function writeInterchainTokenFactory<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<
          typeof interchainTokenFactoryABI,
          TFunctionName
        >,
        "abi"
      >
    | Omit<
        WriteContractUnpreparedArgs<
          typeof interchainTokenFactoryABI,
          TFunctionName
        >,
        "abi"
      >
) {
  return writeContract({
    abi: interchainTokenFactoryABI,
    ...config,
  } as unknown as WriteContractArgs<typeof interchainTokenFactoryABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link interchainTokenFactoryABI}__.
 */
export function prepareWriteInterchainTokenFactory<
  TAbi extends readonly unknown[] = typeof interchainTokenFactoryABI,
  TFunctionName extends string = string
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, "abi">) {
  return prepareWriteContract({
    abi: interchainTokenFactoryABI,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}
