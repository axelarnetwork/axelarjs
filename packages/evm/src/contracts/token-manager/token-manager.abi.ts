export default {
  _format: "hh-sol-artifact-1",
  contractName: "TokenManager",
  sourceName: "contracts/token-manager/TokenManager.sol",
  abi: [
    {
      inputs: [],
      name: "FlowLimitExceeded",
      type: "error",
    },
    {
      inputs: [],
      name: "GiveTokenFailed",
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
      name: "NotAdmin",
      type: "error",
    },
    {
      inputs: [],
      name: "NotProxy",
      type: "error",
    },
    {
      inputs: [],
      name: "NotService",
      type: "error",
    },
    {
      inputs: [],
      name: "NotToken",
      type: "error",
    },
    {
      inputs: [],
      name: "TakeTokenFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "TokenLinkerZeroAddress",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "admin",
          type: "address",
        },
      ],
      name: "AdminChanged",
      type: "event",
    },
    {
      inputs: [],
      name: "admin",
      outputs: [
        {
          internalType: "address",
          name: "distr",
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
          name: "data",
          type: "bytes",
        },
      ],
      name: "callContractWithInterchainToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getFlowInAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "flowInAmount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getFlowLimit",
      outputs: [
        {
          internalType: "uint256",
          name: "flowLimit",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getFlowOutAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "flowOutAmount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
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
      ],
      name: "giveToken",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "implementationType",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "interchainTokenService",
      outputs: [
        {
          internalType: "contract IInterchainTokenService",
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
      name: "sendToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "admin_",
          type: "address",
        },
      ],
      name: "setAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
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
          internalType: "bytes",
          name: "params",
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
      name: "tokenAddress",
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
          name: "sender",
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
      name: "transmitInterchainTransfer",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
  bytecode: "0x",
  deployedBytecode: "0x",
  linkReferences: {},
  deployedLinkReferences: {},
} as const;
