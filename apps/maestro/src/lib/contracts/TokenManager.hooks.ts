/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenManagerAbi = [
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
      { name: "tokenManager", internalType: "address", type: "address" },
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
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "addFlowIn",
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
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "addFlowOut",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "approveService",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenAddress_", internalType: "address", type: "address" },
      { name: "from", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "burnToken",
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
    stateMutability: "pure",
    type: "function",
    inputs: [{ name: "params_", internalType: "bytes", type: "bytes" }],
    name: "getTokenAddressFromParams",
    outputs: [
      { name: "tokenAddress_", internalType: "address", type: "address" },
    ],
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
    stateMutability: "pure",
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
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "addr", internalType: "address", type: "address" }],
    name: "isFlowLimiter",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "addr", internalType: "address", type: "address" }],
    name: "isOperator",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenAddress_", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mintToken",
    outputs: [],
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
    inputs: [{ name: "params_", internalType: "bytes", type: "bytes" }],
    name: "setup",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenAddress",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "transferOperatorship",
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__
 */
export const useReadTokenManager = /*#__PURE__*/ createUseReadContract({
  abi: tokenManagerAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"contractId"`
 */
export const useReadTokenManagerContractId =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "contractId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"flowInAmount"`
 */
export const useReadTokenManagerFlowInAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "flowInAmount",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"flowLimit"`
 */
export const useReadTokenManagerFlowLimit = /*#__PURE__*/ createUseReadContract(
  { abi: tokenManagerAbi, functionName: "flowLimit" }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"flowOutAmount"`
 */
export const useReadTokenManagerFlowOutAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "flowOutAmount",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"getTokenAddressFromParams"`
 */
export const useReadTokenManagerGetTokenAddressFromParams =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "getTokenAddressFromParams",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadTokenManagerHasRole = /*#__PURE__*/ createUseReadContract({
  abi: tokenManagerAbi,
  functionName: "hasRole",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"implementationType"`
 */
export const useReadTokenManagerImplementationType =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "implementationType",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"interchainTokenId"`
 */
export const useReadTokenManagerInterchainTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "interchainTokenId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"interchainTokenService"`
 */
export const useReadTokenManagerInterchainTokenService =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "interchainTokenService",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"isFlowLimiter"`
 */
export const useReadTokenManagerIsFlowLimiter =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "isFlowLimiter",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"isOperator"`
 */
export const useReadTokenManagerIsOperator =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "isOperator",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"params"`
 */
export const useReadTokenManagerParams = /*#__PURE__*/ createUseReadContract({
  abi: tokenManagerAbi,
  functionName: "params",
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"tokenAddress"`
 */
export const useReadTokenManagerTokenAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenManagerAbi,
    functionName: "tokenAddress",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__
 */
export const useWriteTokenManager = /*#__PURE__*/ createUseWriteContract({
  abi: tokenManagerAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"acceptOperatorship"`
 */
export const useWriteTokenManagerAcceptOperatorship =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "acceptOperatorship",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"addFlowIn"`
 */
export const useWriteTokenManagerAddFlowIn =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "addFlowIn",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"addFlowLimiter"`
 */
export const useWriteTokenManagerAddFlowLimiter =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "addFlowLimiter",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"addFlowOut"`
 */
export const useWriteTokenManagerAddFlowOut =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "addFlowOut",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"approveService"`
 */
export const useWriteTokenManagerApproveService =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "approveService",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"burnToken"`
 */
export const useWriteTokenManagerBurnToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "burnToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"mintToken"`
 */
export const useWriteTokenManagerMintToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "mintToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"proposeOperatorship"`
 */
export const useWriteTokenManagerProposeOperatorship =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "proposeOperatorship",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"removeFlowLimiter"`
 */
export const useWriteTokenManagerRemoveFlowLimiter =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "removeFlowLimiter",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"setFlowLimit"`
 */
export const useWriteTokenManagerSetFlowLimit =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "setFlowLimit",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"setup"`
 */
export const useWriteTokenManagerSetup = /*#__PURE__*/ createUseWriteContract({
  abi: tokenManagerAbi,
  functionName: "setup",
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"transferOperatorship"`
 */
export const useWriteTokenManagerTransferOperatorship =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenManagerAbi,
    functionName: "transferOperatorship",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__
 */
export const useSimulateTokenManager = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenManagerAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"acceptOperatorship"`
 */
export const useSimulateTokenManagerAcceptOperatorship =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "acceptOperatorship",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"addFlowIn"`
 */
export const useSimulateTokenManagerAddFlowIn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "addFlowIn",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"addFlowLimiter"`
 */
export const useSimulateTokenManagerAddFlowLimiter =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "addFlowLimiter",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"addFlowOut"`
 */
export const useSimulateTokenManagerAddFlowOut =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "addFlowOut",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"approveService"`
 */
export const useSimulateTokenManagerApproveService =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "approveService",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"burnToken"`
 */
export const useSimulateTokenManagerBurnToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "burnToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"mintToken"`
 */
export const useSimulateTokenManagerMintToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "mintToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"proposeOperatorship"`
 */
export const useSimulateTokenManagerProposeOperatorship =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "proposeOperatorship",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"removeFlowLimiter"`
 */
export const useSimulateTokenManagerRemoveFlowLimiter =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "removeFlowLimiter",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"setFlowLimit"`
 */
export const useSimulateTokenManagerSetFlowLimit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "setFlowLimit",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"setup"`
 */
export const useSimulateTokenManagerSetup =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "setup",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenManagerAbi}__ and `functionName` set to `"transferOperatorship"`
 */
export const useSimulateTokenManagerTransferOperatorship =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenManagerAbi,
    functionName: "transferOperatorship",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenManagerAbi}__
 */
export const useWatchTokenManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: tokenManagerAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenManagerAbi}__ and `eventName` set to `"FlowLimitSet"`
 */
export const useWatchTokenManagerFlowLimitSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenManagerAbi,
    eventName: "FlowLimitSet",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenManagerAbi}__ and `eventName` set to `"RolesAdded"`
 */
export const useWatchTokenManagerRolesAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenManagerAbi,
    eventName: "RolesAdded",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenManagerAbi}__ and `eventName` set to `"RolesProposed"`
 */
export const useWatchTokenManagerRolesProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenManagerAbi,
    eventName: "RolesProposed",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenManagerAbi}__ and `eventName` set to `"RolesRemoved"`
 */
export const useWatchTokenManagerRolesRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenManagerAbi,
    eventName: "RolesRemoved",
  });
