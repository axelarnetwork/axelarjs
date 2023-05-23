import { InterchainTokenClient } from "@axelarjs/evm";
import { getContract, type GetContractParameters } from "viem";
import {
  useContractWrite,
  usePublicClient,
  useWalletClient,
  type WalletClient,
} from "wagmi";

const { ABI } = InterchainTokenClient;

type Config = Omit<
  GetContractParameters,
  "abi" | "publicClient" | "walletClient"
>;

export function useInterchainTokenReads(config: Config) {
  if (!config.address) {
    throw new Error("address is required");
  }

  const publicClient = usePublicClient();

  const { read } = getContract({
    abi: ABI,
    address: config.address,
    publicClient,
  });

  return read;
}

export function useInterchainTokenWrites(
  config: Config & {
    walletClient?: WalletClient | null;
  }
) {
  if (!config.address) {
    throw new Error("address is required");
  }

  const { data: walletClient } = useWalletClient();

  if (!walletClient) {
    return null;
  }

  const { write } = getContract({
    abi: ABI,
    address: config.address,
    walletClient,
  });

  return write;
}

export function useMintInterchainToken(config: Config) {
  return useContractWrite({
    address: config.address,
    abi: ABI,
    functionName: "mint",
  });
}

export function useTransferInterchainToken(
  config: Config & {
    value: bigint;
  }
) {
  return useContractWrite({
    address: config.address,
    abi: ABI,
    functionName: "interchainTransfer",
    value: config.value,
  });
}
