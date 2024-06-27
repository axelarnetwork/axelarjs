/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterchainToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenAbi = [
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
  { type: "error", inputs: [], name: "AlreadyInitialized" },
  { type: "error", inputs: [], name: "InterchainTokenServiceAddressZero" },
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
  { type: "error", inputs: [], name: "PermitExpired" },
  { type: "error", inputs: [], name: "TokenIdZero" },
  { type: "error", inputs: [], name: "TokenNameEmpty" },
  { type: "error", inputs: [], name: "TokenSymbolEmpty" },
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
    inputs: [{ name: "fromMinter", internalType: "address", type: "address" }],
    name: "acceptMintership",
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenId_", internalType: "bytes32", type: "bytes32" },
      { name: "minter", internalType: "address", type: "address" },
      { name: "tokenName", internalType: "string", type: "string" },
      { name: "tokenSymbol", internalType: "string", type: "string" },
      { name: "tokenDecimals", internalType: "uint8", type: "uint8" },
    ],
    name: "init",
    outputs: [],
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
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
    name: "isMinter",
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
    inputs: [{ name: "minter_", internalType: "address", type: "address" }],
    name: "proposeMintership",
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
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "minter_", internalType: "address", type: "address" }],
    name: "transferMintership",
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__
 */
export const useReadInterchainToken = /*#__PURE__*/ createUseReadContract({
  abi: interchainTokenAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadInterchainTokenDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "DOMAIN_SEPARATOR",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadInterchainTokenAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "allowance",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadInterchainTokenBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "balanceOf",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadInterchainTokenDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "decimals",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadInterchainTokenHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "hasRole",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"interchainTokenId"`
 */
export const useReadInterchainTokenInterchainTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "interchainTokenId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"interchainTokenService"`
 */
export const useReadInterchainTokenInterchainTokenService =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "interchainTokenService",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"isMinter"`
 */
export const useReadInterchainTokenIsMinter =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "isMinter",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadInterchainTokenName = /*#__PURE__*/ createUseReadContract({
  abi: interchainTokenAbi,
  functionName: "name",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"nameHash"`
 */
export const useReadInterchainTokenNameHash =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "nameHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadInterchainTokenNonces = /*#__PURE__*/ createUseReadContract(
  { abi: interchainTokenAbi, functionName: "nonces" },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadInterchainTokenSymbol = /*#__PURE__*/ createUseReadContract(
  { abi: interchainTokenAbi, functionName: "symbol" },
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadInterchainTokenTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenAbi,
    functionName: "totalSupply",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__
 */
export const useWriteInterchainToken = /*#__PURE__*/ createUseWriteContract({
  abi: interchainTokenAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"acceptMintership"`
 */
export const useWriteInterchainTokenAcceptMintership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "acceptMintership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteInterchainTokenApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteInterchainTokenBurn = /*#__PURE__*/ createUseWriteContract(
  { abi: interchainTokenAbi, functionName: "burn" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteInterchainTokenDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "decreaseAllowance",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteInterchainTokenIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "increaseAllowance",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"init"`
 */
export const useWriteInterchainTokenInit = /*#__PURE__*/ createUseWriteContract(
  { abi: interchainTokenAbi, functionName: "init" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"interchainTransfer"`
 */
export const useWriteInterchainTokenInterchainTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "interchainTransfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"interchainTransferFrom"`
 */
export const useWriteInterchainTokenInterchainTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "interchainTransferFrom",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteInterchainTokenMint = /*#__PURE__*/ createUseWriteContract(
  { abi: interchainTokenAbi, functionName: "mint" },
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteInterchainTokenPermit =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "permit",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"proposeMintership"`
 */
export const useWriteInterchainTokenProposeMintership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "proposeMintership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteInterchainTokenTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteInterchainTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"transferMintership"`
 */
export const useWriteInterchainTokenTransferMintership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenAbi,
    functionName: "transferMintership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__
 */
export const useSimulateInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({ abi: interchainTokenAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"acceptMintership"`
 */
export const useSimulateInterchainTokenAcceptMintership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "acceptMintership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateInterchainTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "approve",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateInterchainTokenBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "burn",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateInterchainTokenDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "decreaseAllowance",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateInterchainTokenIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "increaseAllowance",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"init"`
 */
export const useSimulateInterchainTokenInit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "init",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"interchainTransfer"`
 */
export const useSimulateInterchainTokenInterchainTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "interchainTransfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"interchainTransferFrom"`
 */
export const useSimulateInterchainTokenInterchainTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "interchainTransferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateInterchainTokenMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "mint",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateInterchainTokenPermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "permit",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"proposeMintership"`
 */
export const useSimulateInterchainTokenProposeMintership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "proposeMintership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateInterchainTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "transfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateInterchainTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "transferFrom",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenAbi}__ and `functionName` set to `"transferMintership"`
 */
export const useSimulateInterchainTokenTransferMintership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenAbi,
    functionName: "transferMintership",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenAbi}__
 */
export const useWatchInterchainTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: interchainTokenAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchInterchainTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenAbi,
    eventName: "Approval",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenAbi}__ and `eventName` set to `"RolesAdded"`
 */
export const useWatchInterchainTokenRolesAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenAbi,
    eventName: "RolesAdded",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenAbi}__ and `eventName` set to `"RolesProposed"`
 */
export const useWatchInterchainTokenRolesProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenAbi,
    eventName: "RolesProposed",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenAbi}__ and `eventName` set to `"RolesRemoved"`
 */
export const useWatchInterchainTokenRolesRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenAbi,
    eventName: "RolesRemoved",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchInterchainTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenAbi,
    eventName: "Transfer",
  });
