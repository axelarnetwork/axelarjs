import { usePublicClient } from "wagmi";

import { NEXT_PUBLIC_NETWORK_ENV } from "~/config/env";
import {
  useWriteHederaTokenAssociation,
  useWriteHederaTokenDissociation,
} from "~/lib/contracts/hedera/HederaTokenServicePrecompile.abi";
import { HEDERA_CHAIN_ID, useAccount, useChainId } from "~/lib/hooks";

export const useHederaTokenAssociation = () => {
  const { address, chain } = useAccount();
  const chainId = useChainId();

  const wallet = usePublicClient();

  const API_URL =
    NEXT_PUBLIC_NETWORK_ENV === "mainnet"
      ? "https://mainnet-public.mirrornode.hedera.com/api/v1"
      : "https://testnet-public.mirrornode.hedera.com/api/v1";

  const isHederaChain = chainId === HEDERA_CHAIN_ID;

  const associate = useWriteHederaTokenAssociation();
  const dissociate = useWriteHederaTokenDissociation();
  const isReady = address && isHederaChain && chain && wallet;

  const checkHederaTokenAssociation = async (tokenAddress: `0x${string}`) => {
    if (!isReady) {
      throw new Error("Hedera Client not ready");
    }

    let result = await fetch(`${API_URL}/tokens/${tokenAddress}`);
    if (!result.ok) {
      throw new Error(`API token lookup failed (${result.status})`);
    }

    const tokenId = ((await result.json()) as { token_id?: string }).token_id;
    if (!tokenId) {
      throw new Error("Token not found");
    }

    result = await fetch(
      `${API_URL}/accounts/${address}/tokens?token.id=${tokenId}`
    );
    if (!result.ok) {
      throw new Error(`API relationship lookup failed (${result.status})`);
    }
    const tokens = ((await result.json()) as { tokens?: any[] }).tokens;
    return (tokens?.length ?? 0) > 0;
  };

  const associateHederaToken = async (tokenAddress: `0x${string}`) => {
    if (!isReady) {
      throw new Error("Hedera Client not ready");
    }

    let txHash: `0x${string}` | null = null;
    try {
      txHash = await associate.writeContractAsync({
        args: [address, tokenAddress],
        account: address,
        chainId: HEDERA_CHAIN_ID,
      });

      await wallet.waitForTransactionReceipt({
        hash: txHash,
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        "Failed to associate token. Please check console for more details."
      );
    }

    if (!txHash) {
      throw new Error("Failed to associate token");
    }

    return txHash;
  };

  const dissociateHederaToken = async (tokenAddress: `0x${string}`) => {
    if (!isReady) {
      throw new Error("Hedera Client not ready");
    }

    let txHash: `0x${string}` | null = null;
    try {
      txHash = await dissociate.writeContractAsync({
        args: [address, tokenAddress],
        account: address,
        chainId: HEDERA_CHAIN_ID,
      });

      await wallet.waitForTransactionReceipt({
        hash: txHash,
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        "Failed to dissociate token. Please check console for more details."
      );
    }

    if (!txHash) {
      throw new Error("Failed to dissociate token");
    }

    return txHash;
  };

  return {
    checkHederaTokenAssociation,
    associateHederaToken,
    dissociateHederaToken,
  };
};
