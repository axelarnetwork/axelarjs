/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file was generated by scripts/codegen.ts
 *
 * Original abi file:
 * - node_modules/@axelar-network/interchain-token-service/artifacts/contracts/interfaces/IInterchainTokenFactory.sol/IInterchainTokenFactory.json
 *
 * DO NOT EDIT MANUALLY
 */

import { encodeFunctionData } from "viem";

import type { PublicContractClient } from "../../PublicContractClient";
import ABI_FILE from "./IInterchainTokenFactory.abi";

export type IInterchainTokenFactoryCanonicalInterchainTokenIdArgs = {
  tokenAddress: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.canonicalInterchainTokenId function args
 */
export const encodeIInterchainTokenFactoryCanonicalInterchainTokenIdArgs = ({
  tokenAddress,
}: IInterchainTokenFactoryCanonicalInterchainTokenIdArgs) =>
  [tokenAddress] as const;

/**
 * Encoder function for IInterchainTokenFactory.canonicalInterchainTokenId function data
 */
export const encodeIInterchainTokenFactoryCanonicalInterchainTokenIdData = ({
  tokenAddress,
}: IInterchainTokenFactoryCanonicalInterchainTokenIdArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "canonicalInterchainTokenId",
    abi: ABI_FILE.abi,
    args: [tokenAddress],
  });

export type IInterchainTokenFactoryCanonicalInterchainTokenSaltArgs = {
  chainNameHash_: `0x${string}`;
  tokenAddress: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.canonicalInterchainTokenSalt function args
 */
export const encodeIInterchainTokenFactoryCanonicalInterchainTokenSaltArgs = ({
  chainNameHash_,
  tokenAddress,
}: IInterchainTokenFactoryCanonicalInterchainTokenSaltArgs) =>
  [chainNameHash_, tokenAddress] as const;

/**
 * Encoder function for IInterchainTokenFactory.canonicalInterchainTokenSalt function data
 */
export const encodeIInterchainTokenFactoryCanonicalInterchainTokenSaltData = ({
  chainNameHash_,
  tokenAddress,
}: IInterchainTokenFactoryCanonicalInterchainTokenSaltArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "canonicalInterchainTokenSalt",
    abi: ABI_FILE.abi,
    args: [chainNameHash_, tokenAddress],
  });

export type IInterchainTokenFactoryDeployInterchainTokenArgs = {
  salt: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  mintAmount: bigint;
  distributor: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.deployInterchainToken function args
 */
export const encodeIInterchainTokenFactoryDeployInterchainTokenArgs = ({
  salt,
  name,
  symbol,
  decimals,
  mintAmount,
  distributor,
}: IInterchainTokenFactoryDeployInterchainTokenArgs) =>
  [salt, name, symbol, decimals, mintAmount, distributor] as const;

/**
 * Encoder function for IInterchainTokenFactory.deployInterchainToken function data
 */
export const encodeIInterchainTokenFactoryDeployInterchainTokenData = ({
  salt,
  name,
  symbol,
  decimals,
  mintAmount,
  distributor,
}: IInterchainTokenFactoryDeployInterchainTokenArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "deployInterchainToken",
    abi: ABI_FILE.abi,
    args: [salt, name, symbol, decimals, mintAmount, distributor],
  });

export type IInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenArgs = {
  originalChain: string;
  originalTokenAddress: `0x${string}`;
  destinationChain: string;
  gasValue: bigint;
};

/**
 * Factory function for IInterchainTokenFactory.deployRemoteCanonicalInterchainToken function args
 */
export const encodeIInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenArgs =
  ({
    originalChain,
    originalTokenAddress,
    destinationChain,
    gasValue,
  }: IInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenArgs) =>
    [originalChain, originalTokenAddress, destinationChain, gasValue] as const;

/**
 * Encoder function for IInterchainTokenFactory.deployRemoteCanonicalInterchainToken function data
 */
export const encodeIInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenData =
  ({
    originalChain,
    originalTokenAddress,
    destinationChain,
    gasValue,
  }: IInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenArgs): `0x${string}` =>
    encodeFunctionData({
      functionName: "deployRemoteCanonicalInterchainToken",
      abi: ABI_FILE.abi,
      args: [originalChain, originalTokenAddress, destinationChain, gasValue],
    });

export type IInterchainTokenFactoryDeployRemoteInterchainTokenArgs = {
  originalChainName: string;
  salt: `0x${string}`;
  distributor: `0x${string}`;
  destinationChain: string;
  gasValue: bigint;
};

/**
 * Factory function for IInterchainTokenFactory.deployRemoteInterchainToken function args
 */
export const encodeIInterchainTokenFactoryDeployRemoteInterchainTokenArgs = ({
  originalChainName,
  salt,
  distributor,
  destinationChain,
  gasValue,
}: IInterchainTokenFactoryDeployRemoteInterchainTokenArgs) =>
  [originalChainName, salt, distributor, destinationChain, gasValue] as const;

/**
 * Encoder function for IInterchainTokenFactory.deployRemoteInterchainToken function data
 */
export const encodeIInterchainTokenFactoryDeployRemoteInterchainTokenData = ({
  originalChainName,
  salt,
  distributor,
  destinationChain,
  gasValue,
}: IInterchainTokenFactoryDeployRemoteInterchainTokenArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "deployRemoteInterchainToken",
    abi: ABI_FILE.abi,
    args: [originalChainName, salt, distributor, destinationChain, gasValue],
  });

export type IInterchainTokenFactoryInterchainTokenAddressArgs = {
  deployer: `0x${string}`;
  salt: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.interchainTokenAddress function args
 */
export const encodeIInterchainTokenFactoryInterchainTokenAddressArgs = ({
  deployer,
  salt,
}: IInterchainTokenFactoryInterchainTokenAddressArgs) =>
  [deployer, salt] as const;

/**
 * Encoder function for IInterchainTokenFactory.interchainTokenAddress function data
 */
export const encodeIInterchainTokenFactoryInterchainTokenAddressData = ({
  deployer,
  salt,
}: IInterchainTokenFactoryInterchainTokenAddressArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "interchainTokenAddress",
    abi: ABI_FILE.abi,
    args: [deployer, salt],
  });

export type IInterchainTokenFactoryInterchainTokenIdArgs = {
  deployer: `0x${string}`;
  salt: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.interchainTokenId function args
 */
export const encodeIInterchainTokenFactoryInterchainTokenIdArgs = ({
  deployer,
  salt,
}: IInterchainTokenFactoryInterchainTokenIdArgs) => [deployer, salt] as const;

/**
 * Encoder function for IInterchainTokenFactory.interchainTokenId function data
 */
export const encodeIInterchainTokenFactoryInterchainTokenIdData = ({
  deployer,
  salt,
}: IInterchainTokenFactoryInterchainTokenIdArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "interchainTokenId",
    abi: ABI_FILE.abi,
    args: [deployer, salt],
  });

export type IInterchainTokenFactoryInterchainTokenSaltArgs = {
  chainNameHash_: `0x${string}`;
  deployer: `0x${string}`;
  salt: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.interchainTokenSalt function args
 */
export const encodeIInterchainTokenFactoryInterchainTokenSaltArgs = ({
  chainNameHash_,
  deployer,
  salt,
}: IInterchainTokenFactoryInterchainTokenSaltArgs) =>
  [chainNameHash_, deployer, salt] as const;

/**
 * Encoder function for IInterchainTokenFactory.interchainTokenSalt function data
 */
export const encodeIInterchainTokenFactoryInterchainTokenSaltData = ({
  chainNameHash_,
  deployer,
  salt,
}: IInterchainTokenFactoryInterchainTokenSaltArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "interchainTokenSalt",
    abi: ABI_FILE.abi,
    args: [chainNameHash_, deployer, salt],
  });

export type IInterchainTokenFactoryInterchainTransferArgs = {
  tokenId: `0x${string}`;
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  gasValue: bigint;
};

/**
 * Factory function for IInterchainTokenFactory.interchainTransfer function args
 */
export const encodeIInterchainTokenFactoryInterchainTransferArgs = ({
  tokenId,
  destinationChain,
  destinationAddress,
  amount,
  gasValue,
}: IInterchainTokenFactoryInterchainTransferArgs) =>
  [tokenId, destinationChain, destinationAddress, amount, gasValue] as const;

/**
 * Encoder function for IInterchainTokenFactory.interchainTransfer function data
 */
export const encodeIInterchainTokenFactoryInterchainTransferData = ({
  tokenId,
  destinationChain,
  destinationAddress,
  amount,
  gasValue,
}: IInterchainTokenFactoryInterchainTransferArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "interchainTransfer",
    abi: ABI_FILE.abi,
    args: [tokenId, destinationChain, destinationAddress, amount, gasValue],
  });

export type IInterchainTokenFactoryRegisterCanonicalInterchainTokenArgs = {
  tokenAddress: `0x${string}`;
};

/**
 * Factory function for IInterchainTokenFactory.registerCanonicalInterchainToken function args
 */
export const encodeIInterchainTokenFactoryRegisterCanonicalInterchainTokenArgs =
  ({
    tokenAddress,
  }: IInterchainTokenFactoryRegisterCanonicalInterchainTokenArgs) =>
    [tokenAddress] as const;

/**
 * Encoder function for IInterchainTokenFactory.registerCanonicalInterchainToken function data
 */
export const encodeIInterchainTokenFactoryRegisterCanonicalInterchainTokenData =
  ({
    tokenAddress,
  }: IInterchainTokenFactoryRegisterCanonicalInterchainTokenArgs): `0x${string}` =>
    encodeFunctionData({
      functionName: "registerCanonicalInterchainToken",
      abi: ABI_FILE.abi,
      args: [tokenAddress],
    });

export type IInterchainTokenFactoryTokenApproveArgs = {
  tokenId: `0x${string}`;
  amount: bigint;
};

/**
 * Factory function for IInterchainTokenFactory.tokenApprove function args
 */
export const encodeIInterchainTokenFactoryTokenApproveArgs = ({
  tokenId,
  amount,
}: IInterchainTokenFactoryTokenApproveArgs) => [tokenId, amount] as const;

/**
 * Encoder function for IInterchainTokenFactory.tokenApprove function data
 */
export const encodeIInterchainTokenFactoryTokenApproveData = ({
  tokenId,
  amount,
}: IInterchainTokenFactoryTokenApproveArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "tokenApprove",
    abi: ABI_FILE.abi,
    args: [tokenId, amount],
  });

export type IInterchainTokenFactoryTokenTransferFromArgs = {
  tokenId: `0x${string}`;
  amount: bigint;
};

/**
 * Factory function for IInterchainTokenFactory.tokenTransferFrom function args
 */
export const encodeIInterchainTokenFactoryTokenTransferFromArgs = ({
  tokenId,
  amount,
}: IInterchainTokenFactoryTokenTransferFromArgs) => [tokenId, amount] as const;

/**
 * Encoder function for IInterchainTokenFactory.tokenTransferFrom function data
 */
export const encodeIInterchainTokenFactoryTokenTransferFromData = ({
  tokenId,
  amount,
}: IInterchainTokenFactoryTokenTransferFromArgs): `0x${string}` =>
  encodeFunctionData({
    functionName: "tokenTransferFrom",
    abi: ABI_FILE.abi,
    args: [tokenId, amount],
  });

export const IINTERCHAIN_TOKEN_FACTORY_ENCODERS = {
  canonicalInterchainTokenId: {
    args: encodeIInterchainTokenFactoryCanonicalInterchainTokenIdArgs,
    data: encodeIInterchainTokenFactoryCanonicalInterchainTokenIdData,
  },
  canonicalInterchainTokenSalt: {
    args: encodeIInterchainTokenFactoryCanonicalInterchainTokenSaltArgs,
    data: encodeIInterchainTokenFactoryCanonicalInterchainTokenSaltData,
  },
  deployInterchainToken: {
    args: encodeIInterchainTokenFactoryDeployInterchainTokenArgs,
    data: encodeIInterchainTokenFactoryDeployInterchainTokenData,
  },
  deployRemoteCanonicalInterchainToken: {
    args: encodeIInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenArgs,
    data: encodeIInterchainTokenFactoryDeployRemoteCanonicalInterchainTokenData,
  },
  deployRemoteInterchainToken: {
    args: encodeIInterchainTokenFactoryDeployRemoteInterchainTokenArgs,
    data: encodeIInterchainTokenFactoryDeployRemoteInterchainTokenData,
  },
  interchainTokenAddress: {
    args: encodeIInterchainTokenFactoryInterchainTokenAddressArgs,
    data: encodeIInterchainTokenFactoryInterchainTokenAddressData,
  },
  interchainTokenId: {
    args: encodeIInterchainTokenFactoryInterchainTokenIdArgs,
    data: encodeIInterchainTokenFactoryInterchainTokenIdData,
  },
  interchainTokenSalt: {
    args: encodeIInterchainTokenFactoryInterchainTokenSaltArgs,
    data: encodeIInterchainTokenFactoryInterchainTokenSaltData,
  },
  interchainTransfer: {
    args: encodeIInterchainTokenFactoryInterchainTransferArgs,
    data: encodeIInterchainTokenFactoryInterchainTransferData,
  },
  registerCanonicalInterchainToken: {
    args: encodeIInterchainTokenFactoryRegisterCanonicalInterchainTokenArgs,
    data: encodeIInterchainTokenFactoryRegisterCanonicalInterchainTokenData,
  },
  tokenApprove: {
    args: encodeIInterchainTokenFactoryTokenApproveArgs,
    data: encodeIInterchainTokenFactoryTokenApproveData,
  },
  tokenTransferFrom: {
    args: encodeIInterchainTokenFactoryTokenTransferFromArgs,
    data: encodeIInterchainTokenFactoryTokenTransferFromData,
  },
};

export function createIInterchainTokenFactoryReadClient(
  publicClient: PublicContractClient<typeof ABI_FILE.abi>
) {
  return {
    canonicalInterchainTokenId(
      canonicalInterchainTokenIdArgs: IInterchainTokenFactoryCanonicalInterchainTokenIdArgs
    ) {
      const encoder =
        IINTERCHAIN_TOKEN_FACTORY_ENCODERS["canonicalInterchainTokenId"];
      const encodedArgs = encoder.args(canonicalInterchainTokenIdArgs);

      return publicClient.read("canonicalInterchainTokenId", {
        args: encodedArgs,
      });
    },
    canonicalInterchainTokenSalt(
      canonicalInterchainTokenSaltArgs: IInterchainTokenFactoryCanonicalInterchainTokenSaltArgs
    ) {
      const encoder =
        IINTERCHAIN_TOKEN_FACTORY_ENCODERS["canonicalInterchainTokenSalt"];
      const encodedArgs = encoder.args(canonicalInterchainTokenSaltArgs);

      return publicClient.read("canonicalInterchainTokenSalt", {
        args: encodedArgs,
      });
    },
    interchainTokenAddress(
      interchainTokenAddressArgs: IInterchainTokenFactoryInterchainTokenAddressArgs
    ) {
      const encoder =
        IINTERCHAIN_TOKEN_FACTORY_ENCODERS["interchainTokenAddress"];
      const encodedArgs = encoder.args(interchainTokenAddressArgs);

      return publicClient.read("interchainTokenAddress", { args: encodedArgs });
    },
    interchainTokenId(
      interchainTokenIdArgs: IInterchainTokenFactoryInterchainTokenIdArgs
    ) {
      const encoder = IINTERCHAIN_TOKEN_FACTORY_ENCODERS["interchainTokenId"];
      const encodedArgs = encoder.args(interchainTokenIdArgs);

      return publicClient.read("interchainTokenId", { args: encodedArgs });
    },
    interchainTokenSalt(
      interchainTokenSaltArgs: IInterchainTokenFactoryInterchainTokenSaltArgs
    ) {
      const encoder = IINTERCHAIN_TOKEN_FACTORY_ENCODERS["interchainTokenSalt"];
      const encodedArgs = encoder.args(interchainTokenSaltArgs);

      return publicClient.read("interchainTokenSalt", { args: encodedArgs });
    },
  };
}