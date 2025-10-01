import type { TransactionReceipt } from "viem";
import { usePublicClient } from "wagmi";

import { HEDERA_CHAIN_ID } from "~/config/chains";
import {
  useWriteHederaTokenAssociation,
  useWriteHederaTokenDissociation,
} from "~/lib/contracts/hedera/HederaTokenServicePrecompile.abi";
import { useAccount, useChainId } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

export const WAIT_FOR_TRANSACTION_RECEIPT_TIMEOUT = 60_000; // 60 seconds

export const useHederaTokenAssociation = (
  tokenAddress?: `0x${string}`,
  options?: { accountAddress?: string; enabled?: boolean }
) => {
  const { address, chain } = useAccount();
  const chainId = useChainId();

  const wallet = usePublicClient();
  const trpcUtils = trpc.useUtils();

  const isHederaChain = chainId === HEDERA_CHAIN_ID;

  const associate = useWriteHederaTokenAssociation();
  const dissociate = useWriteHederaTokenDissociation();
  const isReady = address && isHederaChain && chain && wallet;

  const accountAddressToCheck = options?.accountAddress ?? address;

  const {
    data: associationData,
    isFetching: isCheckingAssociation,
    isError: hasAssociationError,
  } = trpc.hedera.checkAssociation.useQuery(
    {
      tokenAddress: tokenAddress ?? "",
      accountAddress: accountAddressToCheck ?? "",
    },
    {
      enabled:
        (options?.enabled ?? true) &&
        Boolean(tokenAddress) &&
        Boolean(accountAddressToCheck) &&
        // If checking for arbitrary account (override provided), no wallet/chain requirements
        (options?.accountAddress
          ? true
          : Boolean(address) &&
            Boolean(chain) &&
            Boolean(wallet) &&
            Boolean(isHederaChain)),
      retry: false,
    }
  );

  const invalidateAssociation = async () => {
    if (!tokenAddress || !accountAddressToCheck) return;
    await trpcUtils.hedera.checkAssociation.invalidate({
      tokenAddress,
      accountAddress: accountAddressToCheck,
    });
  };

  const associateHederaToken = async (tokenAddress: `0x${string}`) => {
    if (!isReady) {
      throw new Error("Hedera Client not ready");
    }

    let txHash: `0x${string}` | null = null;
    let receipt: TransactionReceipt | null = null;
    try {
      txHash = await associate.writeContractAsync({
        args: [address, tokenAddress],
        account: address,
        chainId: HEDERA_CHAIN_ID,
      });

      receipt = await wallet.waitForTransactionReceipt({
        hash: txHash,
        timeout: WAIT_FOR_TRANSACTION_RECEIPT_TIMEOUT,
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

    if (!receipt) {
      throw new Error("Failed to get transaction receipt");
    }

    return txHash;
  };

  const dissociateHederaToken = async (tokenAddress: `0x${string}`) => {
    if (!isReady) {
      throw new Error("Hedera Client not ready");
    }

    let txHash: `0x${string}` | null = null;
    let receipt: TransactionReceipt | null = null;
    try {
      txHash = await dissociate.writeContractAsync({
        args: [address, tokenAddress],
        account: address,
        chainId: HEDERA_CHAIN_ID,
      });

      receipt = await wallet.waitForTransactionReceipt({
        hash: txHash,
        timeout: WAIT_FOR_TRANSACTION_RECEIPT_TIMEOUT,
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

    if (!receipt) {
      throw new Error("Failed to get transaction receipt");
    }

    return txHash;
  };

  return {
    isAssociated: associationData?.isAssociated ?? null,
    isCheckingAssociation,
    invalidateAssociation,
    hasAssociationError,
    associateHederaToken,
    dissociateHederaToken,
  };
};
