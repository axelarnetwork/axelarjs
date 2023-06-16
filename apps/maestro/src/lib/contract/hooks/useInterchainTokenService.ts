import { InterchainTokenServiceClient } from "@axelarjs/evm";

import { useContractWrite, usePublicClient, type WalletClient } from "wagmi";
import { getContract, type GetContractArgs } from "wagmi/actions";

type Config = Omit<GetContractArgs, "abi" | "walletClient" | "publicClient">;

const { ABI } = InterchainTokenServiceClient;

export function useInterchainTokenServiceReads(config: Config) {
  if (!config.address) {
    throw new Error("address is required");
  }

  const publicClient = usePublicClient();

  const { read } = getContract({
    abi: ABI,
    address: config.address,
    walletClient: publicClient,
  });

  return read;
}

export function useInterchainTokenServiceWrites(
  config: Config & {
    walletClient?: WalletClient | null;
  }
) {
  if (!config.address) {
    throw new Error("address is required");
  }

  if (!config.walletClient) {
    return null;
  }

  const { write } = getContract({
    abi: ABI,
    address: config.address,
    walletClient: config.walletClient,
  });

  return write;
}

export function useInterchainTokenServiceDeployInterchainToken(
  config: Config & {
    value: bigint;
  }
) {
  return useContractWrite({
    abi: ABI,
    functionName: "deployInterchainToken",
    address: config.address,
    value: config.value,
  });
}

export function useInterchainTokenServiceRegisterOriginToken(config: Config) {
  return useContractWrite({
    abi: ABI,
    functionName: "registerOriginToken",
    address: config.address,
  });
}

export function useInterchainTokenServiceDeployRemoteTokens(
  config: Config & {
    value: bigint;
  }
) {
  return useContractWrite({
    abi: ABI,
    address: config.address,
    functionName: "deployRemoteTokens",
    value: config.value,
  });
}

export function useInterchainTokenServiceSeTokentMintLimit(
  config: Config & {
    value: bigint;
  }
) {
  return useContractWrite({
    abi: ABI,
    address: config.address,
    functionName: "setTokenMintLimit",
  });
}
