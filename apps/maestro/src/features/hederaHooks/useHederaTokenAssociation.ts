import { usePublicClient } from "wagmi";

import {
  useWriteHederaTokenAssociation,
  useWriteHederaTokenDissociation,
} from "~/lib/contracts/hedera/HederaTokenServicePrecompile.abi";
import { HEDERA_CHAIN_ID, useAccount, useChainId } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

export const useHederaTokenAssociation = () => {
  const { address, chain } = useAccount();
  const chainId = useChainId();

  const wallet = usePublicClient();
  const trpcUtils = trpc.useUtils();

  const isHederaChain = chainId === HEDERA_CHAIN_ID;

  const associate = useWriteHederaTokenAssociation();
  const dissociate = useWriteHederaTokenDissociation();
  const isReady = address && isHederaChain && chain && wallet;

  const checkHederaTokenAssociation = async (tokenAddress: `0x${string}`) => {
    if (!isReady) {
      throw new Error("Hedera Client not ready");
    }

    const result = await trpcUtils.hedera.checkAssociation.fetch({
      tokenAddress,
      accountAddress: address,
    });
    return Boolean(result?.isAssociated);
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
