/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterchainTokenService
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenServiceAbi = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      {
        name: "tokenManagerDeployer_",
        internalType: "address",
        type: "address",
      },
      {
        name: "interchainTokenDeployer_",
        internalType: "address",
        type: "address",
      },
      { name: "gateway_", internalType: "address", type: "address" },
      { name: "gasService_", internalType: "address", type: "address" },
      {
        name: "interchainTokenFactory_",
        internalType: "address",
        type: "address",
      },
      { name: "chainName_", internalType: "string", type: "string" },
      {
        name: "tokenManagerImplementation_",
        internalType: "address",
        type: "address",
      },
      { name: "tokenHandler_", internalType: "address", type: "address" },
    ],
  },
  { type: "error", inputs: [], name: "AlreadyExecuted" },
  { type: "error", inputs: [], name: "EmptyData" },
  {
    type: "error",
    inputs: [
      { name: "contractAddress", internalType: "address", type: "address" },
    ],
    name: "ExecuteWithInterchainTokenFailed",
  },
  { type: "error", inputs: [], name: "ExecuteWithTokenNotSupported" },
  {
    type: "error",
    inputs: [
      { name: "contractAddress", internalType: "address", type: "address" },
    ],
    name: "ExpressExecuteWithInterchainTokenFailed",
  },
  { type: "error", inputs: [], name: "ExpressExecutorAlreadySet" },
  { type: "error", inputs: [], name: "GatewayToken" },
  {
    type: "error",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "GiveTokenFailed",
  },
  { type: "error", inputs: [], name: "InsufficientValue" },
  {
    type: "error",
    inputs: [{ name: "error", internalType: "bytes", type: "bytes" }],
    name: "InterchainTokenDeploymentFailed",
  },
  { type: "error", inputs: [], name: "InvalidAddress" },
  {
    type: "error",
    inputs: [{ name: "bytesAddress", internalType: "bytes", type: "bytes" }],
    name: "InvalidBytesLength",
  },
  { type: "error", inputs: [], name: "InvalidChainName" },
  { type: "error", inputs: [], name: "InvalidCodeHash" },
  {
    type: "error",
    inputs: [{ name: "messageType", internalType: "uint256", type: "uint256" }],
    name: "InvalidExpressMessageType",
  },
  { type: "error", inputs: [], name: "InvalidImplementation" },
  {
    type: "error",
    inputs: [{ name: "messageType", internalType: "uint256", type: "uint256" }],
    name: "InvalidMessageType",
  },
  {
    type: "error",
    inputs: [{ name: "version", internalType: "uint32", type: "uint32" }],
    name: "InvalidMetadataVersion",
  },
  { type: "error", inputs: [], name: "InvalidOwner" },
  { type: "error", inputs: [], name: "InvalidOwnerAddress" },
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
      { name: "implementation", internalType: "address", type: "address" },
    ],
    name: "InvalidTokenManagerImplementationType",
  },
  { type: "error", inputs: [], name: "LengthMismatch" },
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
  { type: "error", inputs: [], name: "MulticallFailed" },
  { type: "error", inputs: [], name: "NotApprovedByGateway" },
  { type: "error", inputs: [], name: "NotOwner" },
  { type: "error", inputs: [], name: "NotPaused" },
  { type: "error", inputs: [], name: "NotProxy" },
  { type: "error", inputs: [], name: "NotRemoteService" },
  {
    type: "error",
    inputs: [
      { name: "caller", internalType: "address", type: "address" },
      { name: "token", internalType: "address", type: "address" },
    ],
    name: "NotToken",
  },
  { type: "error", inputs: [], name: "Pause" },
  { type: "error", inputs: [], name: "SetupFailed" },
  {
    type: "error",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "TakeTokenFailed",
  },
  {
    type: "error",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "TokenHandlerFailed",
  },
  {
    type: "error",
    inputs: [{ name: "error", internalType: "bytes", type: "bytes" }],
    name: "TokenManagerDeploymentFailed",
  },
  {
    type: "error",
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "TokenManagerDoesNotExist",
  },
  { type: "error", inputs: [], name: "UntrustedChain" },
  { type: "error", inputs: [], name: "ZeroAddress" },
  { type: "error", inputs: [], name: "ZeroStringLength" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "commandId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "sourceChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "sourceAddress",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "payloadHash",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
      {
        name: "expressExecutor",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "ExpressExecuted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "commandId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "sourceChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "sourceAddress",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "payloadHash",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
      {
        name: "symbol",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "expressExecutor",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "ExpressExecutedWithToken",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "commandId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "sourceChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "sourceAddress",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "payloadHash",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
      {
        name: "expressExecutor",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "ExpressExecutionFulfilled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "commandId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "sourceChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "sourceAddress",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "payloadHash",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
      {
        name: "symbol",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "expressExecutor",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "ExpressExecutionWithTokenFulfilled",
  },
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
        name: "tokenAddress",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "minter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "name", internalType: "string", type: "string", indexed: false },
      {
        name: "symbol",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "decimals",
        internalType: "uint8",
        type: "uint8",
        indexed: false,
      },
    ],
    name: "InterchainTokenDeployed",
  },
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
        name: "tokenName",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "tokenSymbol",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "tokenDecimals",
        internalType: "uint8",
        type: "uint8",
        indexed: false,
      },
      { name: "minter", internalType: "bytes", type: "bytes", indexed: false },
      {
        name: "destinationChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "InterchainTokenDeploymentStarted",
  },
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
        name: "deployer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "salt", internalType: "bytes32", type: "bytes32", indexed: true },
    ],
    name: "InterchainTokenIdClaimed",
  },
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
        name: "sourceAddress",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "destinationChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "destinationAddress",
        internalType: "bytes",
        type: "bytes",
        indexed: false,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "dataHash",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
    ],
    name: "InterchainTransfer",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "commandId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "tokenId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "sourceChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "sourceAddress",
        internalType: "bytes",
        type: "bytes",
        indexed: false,
      },
      {
        name: "destinationAddress",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "dataHash",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
    ],
    name: "InterchainTransferReceived",
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
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Paused",
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
      {
        name: "tokenId",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true,
      },
      {
        name: "tokenManager",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "tokenManagerType",
        internalType: "enum ITokenManagerType.TokenManagerType",
        type: "uint8",
        indexed: true,
      },
      { name: "params", internalType: "bytes", type: "bytes", indexed: false },
    ],
    name: "TokenManagerDeployed",
  },
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
        name: "destinationChain",
        internalType: "string",
        type: "string",
        indexed: false,
      },
      {
        name: "tokenManagerType",
        internalType: "enum ITokenManagerType.TokenManagerType",
        type: "uint8",
        indexed: true,
      },
      { name: "params", internalType: "bytes", type: "bytes", indexed: false },
    ],
    name: "TokenManagerDeploymentStarted",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "chain", internalType: "string", type: "string", indexed: false },
    ],
    name: "TrustedAddressRemoved",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "chain", internalType: "string", type: "string", indexed: false },
      {
        name: "address_",
        internalType: "string",
        type: "string",
        indexed: false,
      },
    ],
    name: "TrustedAddressSet",
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
    ],
    name: "Unpaused",
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
    inputs: [
      { name: "fromOperator", internalType: "address", type: "address" },
    ],
    name: "acceptOperatorship",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "data", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "callContractWithInterchainToken",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "chainName",
    outputs: [{ name: "chainName_", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "chainNameHash",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "sourceChain", internalType: "string", type: "string" },
      { name: "sourceAddress", internalType: "string", type: "string" },
      { name: "payload", internalType: "bytes", type: "bytes" },
    ],
    name: "contractCallValue",
    outputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "bytes", type: "bytes" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    name: "contractCallWithTokenValue",
    outputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
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
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "name", internalType: "string", type: "string" },
      { name: "symbol", internalType: "string", type: "string" },
      { name: "decimals", internalType: "uint8", type: "uint8" },
      { name: "minter", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployInterchainToken",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "salt", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      {
        name: "tokenManagerType",
        internalType: "enum ITokenManagerType.TokenManagerType",
        type: "uint8",
      },
      { name: "params", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployTokenManager",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "commandId", internalType: "bytes32", type: "bytes32" },
      { name: "sourceChain", internalType: "string", type: "string" },
      { name: "sourceAddress", internalType: "string", type: "string" },
      { name: "payload", internalType: "bytes", type: "bytes" },
    ],
    name: "execute",
    outputs: [],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [
      { name: "", internalType: "bytes32", type: "bytes32" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "bytes", type: "bytes" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    name: "executeWithToken",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "commandId", internalType: "bytes32", type: "bytes32" },
      { name: "sourceChain", internalType: "string", type: "string" },
      { name: "sourceAddress", internalType: "string", type: "string" },
      { name: "payload", internalType: "bytes", type: "bytes" },
    ],
    name: "expressExecute",
    outputs: [],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "", internalType: "bytes32", type: "bytes32" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "bytes", type: "bytes" },
      { name: "", internalType: "string", type: "string" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
    name: "expressExecuteWithToken",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "flowInAmount",
    outputs: [
      { name: "flowInAmount_", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "flowLimit",
    outputs: [{ name: "flowLimit_", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "flowOutAmount",
    outputs: [
      { name: "flowOutAmount_", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "gasService",
    outputs: [
      { name: "", internalType: "contract IAxelarGasService", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "gateway",
    outputs: [
      { name: "", internalType: "contract IAxelarGateway", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "commandId", internalType: "bytes32", type: "bytes32" },
      { name: "sourceChain", internalType: "string", type: "string" },
      { name: "sourceAddress", internalType: "string", type: "string" },
      { name: "payloadHash", internalType: "bytes32", type: "bytes32" },
    ],
    name: "getExpressExecutor",
    outputs: [
      { name: "expressExecutor", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "commandId", internalType: "bytes32", type: "bytes32" },
      { name: "sourceChain", internalType: "string", type: "string" },
      { name: "sourceAddress", internalType: "string", type: "string" },
      { name: "payloadHash", internalType: "bytes32", type: "bytes32" },
      { name: "symbol", internalType: "string", type: "string" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "getExpressExecutorWithToken",
    outputs: [
      { name: "expressExecutor", internalType: "address", type: "address" },
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
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "interchainTokenAddress",
    outputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "interchainTokenDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "interchainTokenFactory",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "pure",
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "salt", internalType: "bytes32", type: "bytes32" },
    ],
    name: "interchainTokenId",
    outputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
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
    inputs: [
      { name: "chain", internalType: "string", type: "string" },
      { name: "address_", internalType: "string", type: "string" },
    ],
    name: "isTrustedAddress",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
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
    name: "paused",
    outputs: [{ name: "paused_", internalType: "bool", type: "bool" }],
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
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "proposeOperatorship",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "proposeOwnership",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "chain", internalType: "string", type: "string" }],
    name: "removeTrustedAddress",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenIds", internalType: "bytes32[]", type: "bytes32[]" },
      { name: "flowLimits", internalType: "uint256[]", type: "uint256[]" },
    ],
    name: "setFlowLimits",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "paused", internalType: "bool", type: "bool" }],
    name: "setPauseStatus",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "chain", internalType: "string", type: "string" },
      { name: "address_", internalType: "string", type: "string" },
    ],
    name: "setTrustedAddress",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "setup",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenHandler",
    outputs: [{ name: "", internalType: "address", type: "address" }],
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
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "tokenManagerAddress",
    outputs: [
      {
        name: "tokenManagerAddress_",
        internalType: "address",
        type: "address",
      },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenManagerDeployer",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "tokenManagerImplementation",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "operator", internalType: "address", type: "address" }],
    name: "transferOperatorship",
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
    stateMutability: "payable",
    type: "function",
    inputs: [
      { name: "tokenId", internalType: "bytes32", type: "bytes32" },
      { name: "sourceAddress", internalType: "address", type: "address" },
      { name: "destinationChain", internalType: "string", type: "string" },
      { name: "destinationAddress", internalType: "bytes", type: "bytes" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "metadata", internalType: "bytes", type: "bytes" },
    ],
    name: "transmitInterchainTransfer",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "chain", internalType: "string", type: "string" }],
    name: "trustedAddress",
    outputs: [
      { name: "trustedAddress_", internalType: "string", type: "string" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "chain", internalType: "string", type: "string" }],
    name: "trustedAddressHash",
    outputs: [
      { name: "trustedAddressHash_", internalType: "bytes32", type: "bytes32" },
    ],
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
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "validTokenAddress",
    outputs: [
      { name: "tokenAddress", internalType: "address", type: "address" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "tokenId", internalType: "bytes32", type: "bytes32" }],
    name: "validTokenManagerAddress",
    outputs: [
      {
        name: "tokenManagerAddress_",
        internalType: "address",
        type: "address",
      },
    ],
  },
] as const;

export const interchainTokenServiceAddress =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C" as const;

export const interchainTokenServiceConfig = {
  address: interchainTokenServiceAddress,
  abi: interchainTokenServiceAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__
 */
export const useReadInterchainTokenService =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"chainName"`
 */
export const useReadInterchainTokenServiceChainName =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "chainName",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"chainNameHash"`
 */
export const useReadInterchainTokenServiceChainNameHash =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "chainNameHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"contractCallValue"`
 */
export const useReadInterchainTokenServiceContractCallValue =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "contractCallValue",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"contractCallWithTokenValue"`
 */
export const useReadInterchainTokenServiceContractCallWithTokenValue =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "contractCallWithTokenValue",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"contractId"`
 */
export const useReadInterchainTokenServiceContractId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "contractId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"executeWithToken"`
 */
export const useReadInterchainTokenServiceExecuteWithToken =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "executeWithToken",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"flowInAmount"`
 */
export const useReadInterchainTokenServiceFlowInAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "flowInAmount",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"flowLimit"`
 */
export const useReadInterchainTokenServiceFlowLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "flowLimit",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"flowOutAmount"`
 */
export const useReadInterchainTokenServiceFlowOutAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "flowOutAmount",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"gasService"`
 */
export const useReadInterchainTokenServiceGasService =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "gasService",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"gateway"`
 */
export const useReadInterchainTokenServiceGateway =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "gateway",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"getExpressExecutor"`
 */
export const useReadInterchainTokenServiceGetExpressExecutor =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "getExpressExecutor",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"getExpressExecutorWithToken"`
 */
export const useReadInterchainTokenServiceGetExpressExecutorWithToken =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "getExpressExecutorWithToken",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadInterchainTokenServiceHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "hasRole",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"implementation"`
 */
export const useReadInterchainTokenServiceImplementation =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "implementation",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"interchainTokenAddress"`
 */
export const useReadInterchainTokenServiceInterchainTokenAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"interchainTokenDeployer"`
 */
export const useReadInterchainTokenServiceInterchainTokenDeployer =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenDeployer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"interchainTokenFactory"`
 */
export const useReadInterchainTokenServiceInterchainTokenFactory =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenFactory",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"interchainTokenId"`
 */
export const useReadInterchainTokenServiceInterchainTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "interchainTokenId",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"isOperator"`
 */
export const useReadInterchainTokenServiceIsOperator =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "isOperator",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"isTrustedAddress"`
 */
export const useReadInterchainTokenServiceIsTrustedAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "isTrustedAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"owner"`
 */
export const useReadInterchainTokenServiceOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "owner",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"paused"`
 */
export const useReadInterchainTokenServicePaused =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "paused",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadInterchainTokenServicePendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "pendingOwner",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"tokenHandler"`
 */
export const useReadInterchainTokenServiceTokenHandler =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "tokenHandler",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"tokenManager"`
 */
export const useReadInterchainTokenServiceTokenManager =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "tokenManager",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"tokenManagerAddress"`
 */
export const useReadInterchainTokenServiceTokenManagerAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "tokenManagerAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"tokenManagerDeployer"`
 */
export const useReadInterchainTokenServiceTokenManagerDeployer =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "tokenManagerDeployer",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"tokenManagerImplementation"`
 */
export const useReadInterchainTokenServiceTokenManagerImplementation =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "tokenManagerImplementation",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"trustedAddress"`
 */
export const useReadInterchainTokenServiceTrustedAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "trustedAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"trustedAddressHash"`
 */
export const useReadInterchainTokenServiceTrustedAddressHash =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "trustedAddressHash",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"validTokenAddress"`
 */
export const useReadInterchainTokenServiceValidTokenAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "validTokenAddress",
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"validTokenManagerAddress"`
 */
export const useReadInterchainTokenServiceValidTokenManagerAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "validTokenManagerAddress",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__
 */
export const useWriteInterchainTokenService =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"acceptOperatorship"`
 */
export const useWriteInterchainTokenServiceAcceptOperatorship =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "acceptOperatorship",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteInterchainTokenServiceAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "acceptOwnership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"callContractWithInterchainToken"`
 */
export const useWriteInterchainTokenServiceCallContractWithInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "callContractWithInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"deployInterchainToken"`
 */
export const useWriteInterchainTokenServiceDeployInterchainToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "deployInterchainToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"deployTokenManager"`
 */
export const useWriteInterchainTokenServiceDeployTokenManager =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "deployTokenManager",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteInterchainTokenServiceExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "execute",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"expressExecute"`
 */
export const useWriteInterchainTokenServiceExpressExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "expressExecute",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"expressExecuteWithToken"`
 */
export const useWriteInterchainTokenServiceExpressExecuteWithToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "expressExecuteWithToken",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"interchainTransfer"`
 */
export const useWriteInterchainTokenServiceInterchainTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "interchainTransfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteInterchainTokenServiceMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "multicall",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"proposeOperatorship"`
 */
export const useWriteInterchainTokenServiceProposeOperatorship =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "proposeOperatorship",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"proposeOwnership"`
 */
export const useWriteInterchainTokenServiceProposeOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "proposeOwnership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"removeTrustedAddress"`
 */
export const useWriteInterchainTokenServiceRemoveTrustedAddress =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "removeTrustedAddress",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setFlowLimits"`
 */
export const useWriteInterchainTokenServiceSetFlowLimits =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setFlowLimits",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setPauseStatus"`
 */
export const useWriteInterchainTokenServiceSetPauseStatus =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setPauseStatus",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setTrustedAddress"`
 */
export const useWriteInterchainTokenServiceSetTrustedAddress =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setTrustedAddress",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setup"`
 */
export const useWriteInterchainTokenServiceSetup =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setup",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"transferOperatorship"`
 */
export const useWriteInterchainTokenServiceTransferOperatorship =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "transferOperatorship",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteInterchainTokenServiceTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"transmitInterchainTransfer"`
 */
export const useWriteInterchainTokenServiceTransmitInterchainTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "transmitInterchainTransfer",
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"upgrade"`
 */
export const useWriteInterchainTokenServiceUpgrade =
  /*#__PURE__*/ createUseWriteContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "upgrade",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__
 */
export const useSimulateInterchainTokenService =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"acceptOperatorship"`
 */
export const useSimulateInterchainTokenServiceAcceptOperatorship =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "acceptOperatorship",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateInterchainTokenServiceAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "acceptOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"callContractWithInterchainToken"`
 */
export const useSimulateInterchainTokenServiceCallContractWithInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "callContractWithInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"deployInterchainToken"`
 */
export const useSimulateInterchainTokenServiceDeployInterchainToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "deployInterchainToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"deployTokenManager"`
 */
export const useSimulateInterchainTokenServiceDeployTokenManager =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "deployTokenManager",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateInterchainTokenServiceExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "execute",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"expressExecute"`
 */
export const useSimulateInterchainTokenServiceExpressExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "expressExecute",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"expressExecuteWithToken"`
 */
export const useSimulateInterchainTokenServiceExpressExecuteWithToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "expressExecuteWithToken",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"interchainTransfer"`
 */
export const useSimulateInterchainTokenServiceInterchainTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "interchainTransfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateInterchainTokenServiceMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "multicall",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"proposeOperatorship"`
 */
export const useSimulateInterchainTokenServiceProposeOperatorship =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "proposeOperatorship",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"proposeOwnership"`
 */
export const useSimulateInterchainTokenServiceProposeOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "proposeOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"removeTrustedAddress"`
 */
export const useSimulateInterchainTokenServiceRemoveTrustedAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "removeTrustedAddress",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setFlowLimits"`
 */
export const useSimulateInterchainTokenServiceSetFlowLimits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setFlowLimits",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setPauseStatus"`
 */
export const useSimulateInterchainTokenServiceSetPauseStatus =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setPauseStatus",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setTrustedAddress"`
 */
export const useSimulateInterchainTokenServiceSetTrustedAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setTrustedAddress",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"setup"`
 */
export const useSimulateInterchainTokenServiceSetup =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "setup",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"transferOperatorship"`
 */
export const useSimulateInterchainTokenServiceTransferOperatorship =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "transferOperatorship",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateInterchainTokenServiceTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "transferOwnership",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"transmitInterchainTransfer"`
 */
export const useSimulateInterchainTokenServiceTransmitInterchainTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "transmitInterchainTransfer",
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `functionName` set to `"upgrade"`
 */
export const useSimulateInterchainTokenServiceUpgrade =
  /*#__PURE__*/ createUseSimulateContract({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    functionName: "upgrade",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__
 */
export const useWatchInterchainTokenServiceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"ExpressExecuted"`
 */
export const useWatchInterchainTokenServiceExpressExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecuted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"ExpressExecutedWithToken"`
 */
export const useWatchInterchainTokenServiceExpressExecutedWithTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecutedWithToken",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"ExpressExecutionFulfilled"`
 */
export const useWatchInterchainTokenServiceExpressExecutionFulfilledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecutionFulfilled",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"ExpressExecutionWithTokenFulfilled"`
 */
export const useWatchInterchainTokenServiceExpressExecutionWithTokenFulfilledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "ExpressExecutionWithTokenFulfilled",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"InterchainTokenDeployed"`
 */
export const useWatchInterchainTokenServiceInterchainTokenDeployedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTokenDeployed",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"InterchainTokenDeploymentStarted"`
 */
export const useWatchInterchainTokenServiceInterchainTokenDeploymentStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTokenDeploymentStarted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"InterchainTokenIdClaimed"`
 */
export const useWatchInterchainTokenServiceInterchainTokenIdClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTokenIdClaimed",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"InterchainTransfer"`
 */
export const useWatchInterchainTokenServiceInterchainTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTransfer",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"InterchainTransferReceived"`
 */
export const useWatchInterchainTokenServiceInterchainTransferReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "InterchainTransferReceived",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchInterchainTokenServiceOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "OwnershipTransferStarted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchInterchainTokenServiceOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "OwnershipTransferred",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchInterchainTokenServicePausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "Paused",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"RolesAdded"`
 */
export const useWatchInterchainTokenServiceRolesAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "RolesAdded",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"RolesProposed"`
 */
export const useWatchInterchainTokenServiceRolesProposedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "RolesProposed",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"RolesRemoved"`
 */
export const useWatchInterchainTokenServiceRolesRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "RolesRemoved",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"TokenManagerDeployed"`
 */
export const useWatchInterchainTokenServiceTokenManagerDeployedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "TokenManagerDeployed",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"TokenManagerDeploymentStarted"`
 */
export const useWatchInterchainTokenServiceTokenManagerDeploymentStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "TokenManagerDeploymentStarted",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"TrustedAddressRemoved"`
 */
export const useWatchInterchainTokenServiceTrustedAddressRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "TrustedAddressRemoved",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"TrustedAddressSet"`
 */
export const useWatchInterchainTokenServiceTrustedAddressSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "TrustedAddressSet",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchInterchainTokenServiceUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "Unpaused",
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link interchainTokenServiceAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchInterchainTokenServiceUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: interchainTokenServiceAbi,
    address: interchainTokenServiceAddress,
    eventName: "Upgraded",
  });
