export default {
  _format: "hh-sol-artifact-1",
  contractName: "InterchainTokenService",
  sourceName: "contracts/interchain-token-service/InterchainTokenService.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenManagerDeployer_",
          type: "address",
        },
        {
          internalType: "address",
          name: "standardizedTokenDeployer_",
          type: "address",
        },
        {
          internalType: "address",
          name: "gateway_",
          type: "address",
        },
        {
          internalType: "address",
          name: "gasService_",
          type: "address",
        },
        {
          internalType: "address",
          name: "linkerRouter_",
          type: "address",
        },
        {
          internalType: "address[]",
          name: "tokenManagerImplementations",
          type: "address[]",
        },
        {
          internalType: "string",
          name: "chainName_",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
      ],
      name: "AlreadyExecuted",
      type: "error",
    },
    {
      inputs: [],
      name: "AlreadyExpressCalled",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
      ],
      name: "DoesNotAcceptExpressExecute",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
      ],
      name: "ExecuteWithInterchainTokenFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "GatewayToken",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "bytesAddress",
          type: "bytes",
        },
      ],
      name: "InvalidBytesLength",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidCodeHash",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidImplementation",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "version",
          type: "uint32",
        },
      ],
      name: "InvalidMetadataVersion",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidStringLength",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidTokenManagerImplementation",
      type: "error",
    },
    {
      inputs: [],
      name: "LengthMismatch",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "err",
          type: "bytes",
        },
      ],
      name: "MulticallFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "NotApprovedByGateway",
      type: "error",
    },
    {
      inputs: [],
      name: "NotCanonicalTokenManager",
      type: "error",
    },
    {
      inputs: [],
      name: "NotOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "NotProxy",
      type: "error",
    },
    {
      inputs: [],
      name: "NotRemoteService",
      type: "error",
    },
    {
      inputs: [],
      name: "NotTokenManager",
      type: "error",
    },
    {
      inputs: [],
      name: "Paused",
      type: "error",
    },
    {
      inputs: [],
      name: "SameDestinationAsCaller",
      type: "error",
    },
    {
      inputs: [],
      name: "SelectorUnknown",
      type: "error",
    },
    {
      inputs: [],
      name: "SetupFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "StandardizedTokenDeploymentFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "TokenManagerDeploymentFailed",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "TokenManagerDoesNotExist",
      type: "error",
    },
    {
      inputs: [],
      name: "TokenTransferFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "ZeroAddress",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "sendHash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "expressCaller",
          type: "address",
        },
      ],
      name: "ExpressExecutionFulfilled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "sourceAddress",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "sendHash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "expressCaller",
          type: "address",
        },
      ],
      name: "ExpressExecutionWithDataFulfilled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "sendHash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "expressCaller",
          type: "address",
        },
      ],
      name: "ExpressReceived",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "sourceAddress",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "sendHash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "expressCaller",
          type: "address",
        },
      ],
      name: "ExpressReceivedWithData",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferStarted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "paused",
          type: "bool",
        },
      ],
      name: "PausedSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "gasValue",
          type: "uint256",
        },
      ],
      name: "RemoteStandardizedTokenAndManagerDeploymentInitialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "gasValue",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "enum ITokenManagerType.TokenManagerType",
          name: "tokenManagerType",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      name: "RemoteTokenManagerDeploymentInitialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "symbol",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "mintAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "mintTo",
          type: "address",
        },
      ],
      name: "StandardizedTokenDeployed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "enum ITokenManagerType.TokenManagerType",
          name: "tokenManagerType",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      name: "TokenManagerDeployed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TokenReceived",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "sourceAddress",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "TokenReceivedWithData",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "destinationAddress",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TokenSent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "destinationAddress",
          type: "bytes",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sourceAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "TokenSentWithData",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
      ],
      name: "Upgraded",
      type: "event",
    },
    {
      inputs: [],
      name: "acceptOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "contractId",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          internalType: "bytes",
          name: "distributor",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "admin",
          type: "bytes",
        },
        {
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "gasValue",
          type: "uint256",
        },
      ],
      name: "deployAndRegisterRemoteStandardizedTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "mintAmount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "distributor",
          type: "address",
        },
      ],
      name: "deployAndRegisterStandardizedToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "enum ITokenManagerType.TokenManagerType",
          name: "tokenManagerType",
          type: "uint8",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      name: "deployCustomTokenManager",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "gasValue",
          type: "uint256",
        },
      ],
      name: "deployRemoteCanonicalToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          internalType: "enum ITokenManagerType.TokenManagerType",
          name: "tokenManagerType",
          type: "uint8",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "gasValue",
          type: "uint256",
        },
      ],
      name: "deployRemoteCustomTokenManager",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          internalType: "string",
          name: "sourceAddress",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "payload",
          type: "bytes",
        },
      ],
      name: "execute",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          internalType: "string",
          name: "sourceAddress",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "payload",
          type: "bytes",
        },
        {
          internalType: "string",
          name: "tokenSymbol",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "executeWithToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
      ],
      name: "expressReceiveToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "sourceAddress",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
      ],
      name: "expressReceiveTokenWithData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "gasService",
      outputs: [
        {
          internalType: "contract IAxelarGasService",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "gateway",
      outputs: [
        {
          internalType: "contract IAxelarGateway",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "getCanonicalTokenId",
      outputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getChainName",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
      ],
      name: "getCustomTokenId",
      outputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
      ],
      name: "getExpressReceiveToken",
      outputs: [
        {
          internalType: "address",
          name: "expressCaller",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "sourceChain",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "sourceAddress",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "destinationAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes32",
          name: "commandId",
          type: "bytes32",
        },
      ],
      name: "getExpressReceiveTokenWithData",
      outputs: [
        {
          internalType: "address",
          name: "expressCaller",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenManagerType",
          type: "uint256",
        },
      ],
      name: "getImplementation",
      outputs: [
        {
          internalType: "address",
          name: "tokenManagerAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "admin",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "liquidityPoolAddress",
          type: "address",
        },
      ],
      name: "getParamsLiquidityPool",
      outputs: [
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "admin",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "getParamsLockUnlock",
      outputs: [
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "admin",
          type: "bytes",
        },
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "getParamsMintBurn",
      outputs: [
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getStandardizedTokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getTokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getTokenManagerAddress",
      outputs: [
        {
          internalType: "address",
          name: "tokenManagerAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getValidTokenManagerAddress",
      outputs: [
        {
          internalType: "address",
          name: "tokenManagerAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "implementation",
      outputs: [
        {
          internalType: "address",
          name: "implementation_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isPaused",
      outputs: [
        {
          internalType: "bool",
          name: "paused",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "linkerRouter",
      outputs: [
        {
          internalType: "contract ILinkerRouter",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      name: "multicall",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "owner_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [
        {
          internalType: "address",
          name: "owner_",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
      ],
      name: "registerCanonicalToken",
      outputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "flowLimit",
          type: "uint256",
        },
      ],
      name: "setFlowLimit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "paused",
          type: "bool",
        },
      ],
      name: "setPaused",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "setup",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "standardizedTokenDeployer",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenManagerDeployer",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "sourceAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "destinationAddress",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "metadata",
          type: "bytes",
        },
      ],
      name: "transmitSendToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "newImplementationCodeHash",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      name: "upgrade",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  bytecode: "0x",
  deployedBytecode: "0x",
  linkReferences: {},
  deployedLinkReferences: {},
} as const;
