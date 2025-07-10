/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterchainTokenFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenFactoryAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "interchainTokenService_",
        internalType: "address",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  { type: "error", inputs: [], name: "InvalidChainName" },
  { type: "error", inputs: [], name: "InvalidCodeHash" },
  { type: "error", inputs: [], name: "InvalidImplementation" },
  {
    type: "error",
    inputs: [{ name: "minter", internalType: "address", type: "address" }],
    name: "InvalidMinter",
  },
  { type: "error", inputs: [], name: "InvalidOwner" },
  { type: "error", inputs: [], name: "InvalidOwnerAddress" },
  {
    type: "error",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "expectedTokenId", internalType: "bytes32", type: "bytes32" },
    ],
    name: "InvalidTokenId",
  },
  { type: "error", inputs: [], name: "MulticallFailed" },
  {
    type: "error",
    inputs: [{ name: "minter", internalType: "address", type: "address" }],
    name: "NotMinter",
  },
  { type: "error", inputs: [], name: "NotOwner" },
  { type: "error", inputs: [], name: "NotProxy" },
  { type: "error", inputs: [], name: "NotSupported" },
  {
    type: "error",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "NotToken",
  },
  { type: "error", inputs: [], name: "RemoteDeploymentNotApproved" },
  { type: "error", inputs: [], name: "SetupFailed" },
  { type: "error", inputs: [], name: "ZeroAddress" },
  { type: "error", inputs: [], name: "ZeroSupplyToken" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "minter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "deployer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "tokenId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "destinationChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "destinationMinter",
        internalType: "bytes",
        type: "bytes",
        indexed: false,
      },
    ],
    name: "DeployRemoteInterchainTokenApproval",
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
        name: "minter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "deployer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "tokenId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "destinationChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "RevokedDeployRemoteInterchainTokenApproval",
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
    type: "function",
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationMinter", internalType: "bytes", type: "bytes" },
    ],
    name: "approveDeployRemoteInterchainToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "canonicalInterchainTokenDeploySalt",
    outputs: [{ name: "deploySalt", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "canonicalInterchainTokenId",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "chainNameHash",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "contractId",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "name", internalType: "string", type: "string" },
      { name: "symbol", internalType: "string", type: "string" },
      { name: "decimals", internalType: "uint8", type: "uint8" },
      { name: "initialSupply", internalType: "uint256", type: "uint256" },
      { name: "minter", internalType: "address", type: "address" },
    ],
    name: "deployInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
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
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "originalTokenAddress",
        internalType: "address",
        type: "address",
      },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployRemoteCanonicalInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployRemoteInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "originalChainName", internalType: "string", type: "string" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "minter", internalType: "address", type: "address" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployRemoteInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "minter", internalType: "address", type: "address" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationMinter", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployRemoteInterchainTokenWithMinter",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "implementation",
    outputs: [
      { name: "implementation_", internalType: "address", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "interchainTokenDeploySalt",
    outputs: [{ name: "deploySalt", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "interchainTokenId",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
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
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationTokenAddress", internalType: "bytes", type: "bytes" },
      {
        name: "tokenManagerType",
        internalType: "enum ITokenManagerType.TokenManagerType",
        type: "uint8",
      },
      { name: "linkParams", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "linkToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "linkedTokenDeploySalt",
    outputs: [{ name: "deploySalt", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "linkedTokenId",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "data", internalType: "bytes[]", type: "bytes[]" }],
    name: "multicall",
    outputs: [{ name: "results", internalType: "bytes[]", type: "bytes[]" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "owner_", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "pendingOwner",
    outputs: [{ name: "owner_", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "proposeOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
    name: "registerCanonicalInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "tokenAddress", internalType: "address", type: "address" },
      {
        name: "tokenManagerType",
        internalType: "enum ITokenManagerType.TokenManagerType",
        type: "uint8",
      },
      { name: "operator", internalType: "address", type: "address" },
    ],
    name: "registerCustomToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "deployer", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
    ],
    name: "revokeDeployRemoteInterchainToken",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "setup",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
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
    stateMutability: "nonpayable",
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__
 */
export const useReadInterchainTokenFactory =
  /*#__PURE__*/ createUseReadContract({ abi: interchainTokenFactoryAbi });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"canonicalInterchainTokenDeploySalt"`
 */
export const useReadInterchainTokenFactoryCanonicalInterchainTokenDeploySalt =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "canonicalInterchainTokenDeploySalt",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"canonicalInterchainTokenId"`
 */
export const useReadInterchainTokenFactoryCanonicalInterchainTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "canonicalInterchainTokenId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"chainNameHash"`
 */
export const useReadInterchainTokenFactoryChainNameHash =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "chainNameHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"contractId"`
 */
export const useReadInterchainTokenFactoryContractId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "contractId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"implementation"`
 */
export const useReadInterchainTokenFactoryImplementation =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "implementation",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"interchainTokenDeploySalt"`
 */
export const useReadInterchainTokenFactoryInterchainTokenDeploySalt =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "interchainTokenDeploySalt",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"interchainTokenId"`
 */
export const useReadInterchainTokenFactoryInterchainTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "interchainTokenId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"interchainTokenService"`
 */
export const useReadInterchainTokenFactoryInterchainTokenService =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "interchainTokenService",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"linkedTokenDeploySalt"`
 */
export const useReadInterchainTokenFactoryLinkedTokenDeploySalt =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "linkedTokenDeploySalt",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"linkedTokenId"`
 */
export const useReadInterchainTokenFactoryLinkedTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "linkedTokenId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const useReadInterchainTokenFactoryOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "owner",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadInterchainTokenFactoryPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenFactoryAbi,
    functionName: "pendingOwner",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__
 */
export const useWriteInterchainTokenFactory =
  /*#__PURE__*/ createUseWriteContract({ abi: interchainTokenFactoryAbi });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteInterchainTokenFactoryAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "acceptOwnership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"approveDeployRemoteInterchainToken"`
 */
export const useWriteInterchainTokenFactoryApproveDeployRemoteInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "approveDeployRemoteInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployInterchainToken"`
 */
export const useWriteInterchainTokenFactoryDeployInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployRemoteCanonicalInterchainToken"`
 */
export const useWriteInterchainTokenFactoryDeployRemoteCanonicalInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployRemoteCanonicalInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployRemoteInterchainToken"`
 */
export const useWriteInterchainTokenFactoryDeployRemoteInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployRemoteInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployRemoteInterchainTokenWithMinter"`
 */
export const useWriteInterchainTokenFactoryDeployRemoteInterchainTokenWithMinter =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployRemoteInterchainTokenWithMinter",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"linkToken"`
 */
export const useWriteInterchainTokenFactoryLinkToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "linkToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteInterchainTokenFactoryMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "multicall",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"proposeOwnership"`
 */
export const useWriteInterchainTokenFactoryProposeOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "proposeOwnership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"registerCanonicalInterchainToken"`
 */
export const useWriteInterchainTokenFactoryRegisterCanonicalInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "registerCanonicalInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"registerCustomToken"`
 */
export const useWriteInterchainTokenFactoryRegisterCustomToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "registerCustomToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"revokeDeployRemoteInterchainToken"`
 */
export const useWriteInterchainTokenFactoryRevokeDeployRemoteInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "revokeDeployRemoteInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"setup"`
 */
export const useWriteInterchainTokenFactorySetup =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "setup",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteInterchainTokenFactoryTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"upgrade"`
 */
export const useWriteInterchainTokenFactoryUpgrade =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenFactoryAbi,
    functionName: "upgrade",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__
 */
export const useSimulateInterchainTokenFactory =
  /*#__PURE__*/ createUseSimulateContract({ abi: interchainTokenFactoryAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateInterchainTokenFactoryAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "acceptOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"approveDeployRemoteInterchainToken"`
 */
export const useSimulateInterchainTokenFactoryApproveDeployRemoteInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "approveDeployRemoteInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployInterchainToken"`
 */
export const useSimulateInterchainTokenFactoryDeployInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployRemoteCanonicalInterchainToken"`
 */
export const useSimulateInterchainTokenFactoryDeployRemoteCanonicalInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployRemoteCanonicalInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployRemoteInterchainToken"`
 */
export const useSimulateInterchainTokenFactoryDeployRemoteInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployRemoteInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"deployRemoteInterchainTokenWithMinter"`
 */
export const useSimulateInterchainTokenFactoryDeployRemoteInterchainTokenWithMinter =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "deployRemoteInterchainTokenWithMinter",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"linkToken"`
 */
export const useSimulateInterchainTokenFactoryLinkToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "linkToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateInterchainTokenFactoryMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "multicall",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"proposeOwnership"`
 */
export const useSimulateInterchainTokenFactoryProposeOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "proposeOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"registerCanonicalInterchainToken"`
 */
export const useSimulateInterchainTokenFactoryRegisterCanonicalInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "registerCanonicalInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"registerCustomToken"`
 */
export const useSimulateInterchainTokenFactoryRegisterCustomToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "registerCustomToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"revokeDeployRemoteInterchainToken"`
 */
export const useSimulateInterchainTokenFactoryRevokeDeployRemoteInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "revokeDeployRemoteInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"setup"`
 */
export const useSimulateInterchainTokenFactorySetup =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "setup",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateInterchainTokenFactoryTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `functionName` set to `"upgrade"`
 */
export const useSimulateInterchainTokenFactoryUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenFactoryAbi,
    functionName: "upgrade",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenFactoryAbi}__
 */
export const useWatchInterchainTokenFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: interchainTokenFactoryAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `eventName` set to `"DeployRemoteInterchainTokenApproval"`
 */
export const useWatchInterchainTokenFactoryDeployRemoteInterchainTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenFactoryAbi,
    eventName: "DeployRemoteInterchainTokenApproval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchInterchainTokenFactoryOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenFactoryAbi,
    eventName: "OwnershipTransferStarted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchInterchainTokenFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenFactoryAbi,
    eventName: "OwnershipTransferred",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `eventName` set to `"RevokedDeployRemoteInterchainTokenApproval"`
 */
export const useWatchInterchainTokenFactoryRevokedDeployRemoteInterchainTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenFactoryAbi,
    eventName: "RevokedDeployRemoteInterchainTokenApproval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenFactoryAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchInterchainTokenFactoryUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenFactoryAbi,
    eventName: "Upgraded",
  });
