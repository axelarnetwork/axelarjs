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
// InterchainTokenService
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interchainTokenServiceABI = [
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
        name: "tokenManagerImplementations",
        internalType: "address[]",
        type: "address[]",
      },
    ],
  },
  { type: "error", inputs: [], name: "AlreadyExecuted" },
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
      { name: "tokenManager", internalType: "address", type: "address" },
    ],
    name: "NotTokenManager",
  },
  { type: "error", inputs: [], name: "Pause" },
  { type: "error", inputs: [], name: "SetupFailed" },
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
  { type: "error", inputs: [], name: "TokenTransferFailed" },
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
        name: "distributor",
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
      {
        name: "distributor",
        internalType: "bytes",
        type: "bytes",
        indexed: false,
      },
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
        indexed: true,
      },
    ],
    name: "InterchainTransferReceived",
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
        indexed: true,
      },
    ],
    name: "InterchainTransferReceivedWithData",
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
        name: "destinationAddress",
        internalType: "bytes",
        type: "bytes",
        indexed: false,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "sourceAddress",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "data", internalType: "bytes", type: "bytes", indexed: false },
    ],
    name: "InterchainTransferWithData",
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
      { name: "distributor", internalType: "bytes", type: "bytes" },
      { name: "gasValue", internalType: "uint256", type: "uint256" },
    ],
    name: "deployInterchainToken",
    outputs: [],
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
    inputs: [
      { name: "tokenManagerType", internalType: "uint256", type: "uint256" },
    ],
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
  "0xF786e21509A9D50a9aFD033B5940A2b7D872C208" as const;

export const interchainTokenServiceConfig = {
  address: interchainTokenServiceAddress,
  abi: interchainTokenServiceABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function getInterchainTokenService(
  config: Omit<GetContractArgs, "abi" | "address">
) {
  return getContract({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  });
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function readInterchainTokenService<
  TAbi extends readonly unknown[] = typeof interchainTokenServiceABI,
  TFunctionName extends string = string
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, "abi" | "address">) {
  return readContract({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as unknown as ReadContractConfig<TAbi, TFunctionName>);
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function writeInterchainTokenService<TFunctionName extends string>(
  config:
    | Omit<
        WriteContractPreparedArgs<
          typeof interchainTokenServiceABI,
          TFunctionName
        >,
        "abi" | "address"
      >
    | Omit<
        WriteContractUnpreparedArgs<
          typeof interchainTokenServiceABI,
          TFunctionName
        >,
        "abi" | "address"
      >
) {
  return writeContract({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as unknown as WriteContractArgs<typeof interchainTokenServiceABI, TFunctionName>);
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link interchainTokenServiceABI}__.
 */
export function prepareWriteInterchainTokenService<
  TAbi extends readonly unknown[] = typeof interchainTokenServiceABI,
  TFunctionName extends string = string
>(
  config: Omit<
    PrepareWriteContractConfig<TAbi, TFunctionName>,
    "abi" | "address"
  >
) {
  return prepareWriteContract({
    abi: interchainTokenServiceABI,
    address: interchainTokenServiceAddress,
    ...config,
  } as unknown as PrepareWriteContractConfig<TAbi, TFunctionName>);
}
