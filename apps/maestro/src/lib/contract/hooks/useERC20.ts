import { ERC20Client } from "@axelarjs/evm";
import { getContract, type GetContractParameters } from "viem";
import {
  useContractWrite,
  usePublicClient,
  useWalletClient,
  type WalletClient,
} from "wagmi";

const { ABI } = ERC20Client;

type Config = Omit<
  GetContractParameters,
  "abi" | "publicClient" | "walletClient"
>;

export function useERC20Reads(config: Config) {
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

export function useERC20Writes(
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

export function useERC20Approve(config: Config) {
  return useContractWrite({
    address: config.address,
    abi: ABI,
    functionName: "approve",
  });
}
