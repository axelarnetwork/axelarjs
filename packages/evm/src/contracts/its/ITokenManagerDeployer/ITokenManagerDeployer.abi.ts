/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file was generated by scripts/codegen.ts
 *
 * Original abi file:
 * - node_modules/@axelar-network/interchain-token-service/artifacts/contracts/interfaces/ITokenManagerDeployer.sol/ITokenManagerDeployer.json
 *
 * DO NOT EDIT MANUALLY
 */

export default {
  contractName: "ITokenManagerDeployer",
  abi: [
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
        {
          internalType: "uint256",
          name: "implementationType",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      name: "deployTokenManager",
      outputs: [
        {
          internalType: "address",
          name: "tokenManager",
          type: "address",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
  ],
} as const;
