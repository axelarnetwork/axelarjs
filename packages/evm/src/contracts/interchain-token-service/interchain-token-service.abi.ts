export default {
  _format: "hh-sol-artifact-1",
  contractName: "InterchainTokenService",
  sourceName: "contracts/interchainTokenService/InterchainTokenService.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "gatewayAddress_",
          type: "address",
        },
        {
          internalType: "address",
          name: "gasServiceAddress_",
          type: "address",
        },
        {
          internalType: "address",
          name: "linkerRouterAddress_",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenDeployerAddress_",
          type: "address",
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
      inputs: [],
      name: "AlreadyRegistered",
      type: "error",
    },
    {
      inputs: [],
      name: "BurnFailed",
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
      name: "ExceedMintLimit",
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
      name: "LengthMismatch",
      type: "error",
    },
    {
      inputs: [],
      name: "MintFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "NotApprovedByGateway",
      type: "error",
    },
    {
      inputs: [],
      name: "NotGatewayToken",
      type: "error",
    },
    {
      inputs: [],
      name: "NotOriginToken",
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
      name: "NotSelf",
      type: "error",
    },
    {
      inputs: [],
      name: "SetupFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "TokenDeploymentFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "TokenServiceZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFromFailed",
      type: "error",
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
      name: "Receiving",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
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
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "ReceivingWithData",
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
          indexed: false,
          internalType: "uint256",
          name: "gasValue",
          type: "uint256",
        },
      ],
      name: "RemoteTokenRegisterInitialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
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
      name: "Sending",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
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
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "SendingWithData",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "tokenAddress",
          type: "address",
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
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "TokenDeployed",
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
          name: "tokenAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "native",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "gateway",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "remoteGateway",
          type: "bool",
        },
      ],
      name: "TokenRegistered",
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
          internalType: "bytes",
          name: "to",
          type: "bytes",
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
      ],
      name: "callContractWithInterToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "to",
          type: "bytes",
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
      ],
      name: "callContractWithSelf",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "chainName",
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
      inputs: [],
      name: "chainNameHash",
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
          internalType: "string",
          name: "tokenName",
          type: "string",
        },
        {
          internalType: "string",
          name: "tokenSymbol",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      name: "deployInterchainToken",
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
          internalType: "string[]",
          name: "destinationChains",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "gasValues",
          type: "uint256[]",
        },
      ],
      name: "deployRemoteTokens",
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
          internalType: "bytes32",
          name: "key",
          type: "bytes32",
        },
      ],
      name: "getAddress",
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
          internalType: "bytes32",
          name: "key",
          type: "bytes32",
        },
      ],
      name: "getBool",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "key",
          type: "bytes32",
        },
      ],
      name: "getBytes",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
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
      name: "getDeploymentAddress",
      outputs: [
        {
          internalType: "address",
          name: "deployment",
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
          name: "key",
          type: "bytes32",
        },
      ],
      name: "getInt",
      outputs: [
        {
          internalType: "int256",
          name: "",
          type: "int256",
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
      name: "getOriginTokenId",
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
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getOriginalChain",
      outputs: [
        {
          internalType: "string",
          name: "originalChain",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "key",
          type: "bytes32",
        },
      ],
      name: "getString",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
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
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getTokenData",
      outputs: [
        {
          internalType: "bytes32",
          name: "tokenData",
          type: "bytes32",
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
      name: "getTokenId",
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
      inputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      name: "getTokenMintLimit",
      outputs: [
        {
          internalType: "uint256",
          name: "mintLimit",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "key",
          type: "bytes32",
        },
      ],
      name: "getUint",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
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
          internalType: "string",
          name: "symbol",
          type: "string",
        },
      ],
      name: "registerOriginGatewayToken",
      outputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      stateMutability: "nonpayable",
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
      name: "registerOriginToken",
      outputs: [
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address",
        },
        {
          internalType: "string[]",
          name: "destinationChains",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "gasValues",
          type: "uint256[]",
        },
      ],
      name: "registerOriginTokenAndDeployRemoteTokens",
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
          internalType: "string",
          name: "symbol",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "tokenId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "origin",
          type: "string",
        },
      ],
      name: "registerRemoteGatewayToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "string",
          name: "destinationChain",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "to",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "sendSelf",
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
          internalType: "bytes",
          name: "to",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "sendToken",
      outputs: [],
      stateMutability: "payable",
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
      name: "tokenDeployer",
      outputs: [
        {
          internalType: "contract ITokenDeployer",
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
