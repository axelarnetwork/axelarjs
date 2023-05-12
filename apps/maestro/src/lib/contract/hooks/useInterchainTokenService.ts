import { InterchainTokenServiceClient } from "@axelarjs/evm";
import { useContractWrite, usePublicClient, WalletClient } from "wagmi";
import { getContract, GetContractArgs } from "wagmi/actions";

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
    gas: bigint;
  }
) {
  return useContractWrite({
    address: config.address,
    abi: ABI,
    functionName: "deployInterchainToken",
    value: config.gas,
  });
}

export function useInterchainTokenServiceDeployRemoteTokens(
  config: Config & {
    gas: bigint;
  }
) {
  return useContractWrite({
    address: config.address,
    abi: ABI,
    functionName: "deployRemoteTokens",
    value: config.gas,
  });
}
