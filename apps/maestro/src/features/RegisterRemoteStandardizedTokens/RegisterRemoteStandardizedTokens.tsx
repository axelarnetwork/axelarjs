import { Button, LinkButton, toast } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, type FC } from "react";

import { ExternalLinkIcon } from "lucide-react";
import { TransactionExecutionError } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";

import {
  useTransactionState,
  type TransactionState,
} from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { useRegisterRemoteStandardizedTokens } from "./hooks";

type Props = {
  tokenAddress: `0x${string}`;
  chainIds: number[];
  originChainId?: number;
  onTxStateChange?: (status: TransactionState) => void;
};

export const RegisterRemoteStandardizedTokens: FC<Props> = ({
  tokenAddress,
  chainIds,
  originChainId,
  onTxStateChange,
}) => {
  const { address } = useAccount();

  const [txState, setTxState] = useTransactionState();

  useEffect(
    () => {
      onTxStateChange?.(txState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txState]
  );

  const { writeAsync } = useRegisterRemoteStandardizedTokens({
    chainIds: chainIds,
    deployerAddress: address as `0x${string}`,
    tokenAddress,
    originChainId: originChainId ?? -1,
  });

  const { mutateAsync: recordRemoteTokenDeployment } =
    trpc.interchainToken.recordRemoteTokensDeployment.useMutation();

  const { computed } = useEVMChainConfigsQuery();

  useWaitForTransaction({
    hash: txState.status === "submitted" ? txState.hash : undefined,
    confirmations: 1,
    async onSuccess(receipt) {
      await recordRemoteTokenDeployment({
        tokenAddress,
        chainId: originChainId ?? -1,
        deployerAddress: address as `0x${string}`,
        remoteTokens: chainIds.map((chainId) => ({
          address: tokenAddress,
          status: "pending",
          chainId,
          tokenAddress,
          deplymentTxHash: receipt.transactionHash,
          axelarChainId: computed.indexedByChainId[chainId].id,
        })),
      });

      setTxState({
        status: "confirmed",
        receipt,
      });
    },
  });

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash: txState.status === "submitted" ? txState.hash : undefined,
  });

  const pendingChains = useMemo(
    () =>
      statuses
        ? chainIds.filter((chainId) => statuses[chainId]?.status !== "executed")
        : undefined,
    [chainIds, statuses]
  );

  useEffect(() => {
    if (pendingChains && pendingChains.length === 0) {
      toast.success("Remote tokens registered");
    }
  }, [pendingChains]);

  const handleClick = useCallback(async () => {
    if (!writeAsync) return;

    setTxState({
      status: "awaiting_approval",
    });

    try {
      const tx = await writeAsync();
      if (tx.hash) {
        setTxState({
          status: "submitted",
          hash: tx.hash,
        });
      }
    } catch (error) {
      setTxState({
        status: "idle",
      });
      if (error instanceof TransactionExecutionError) {
        toast.error(`Transaction failed: ${error.cause.shortMessage}`);

        logger.error("Failed to register remote tokens", error.cause);
      }
    }
  }, [setTxState, writeAsync]);

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
        return (
          <>
            Register token on {chainIds.length} additional chain
            {chainIds.length > 1 ? "s" : ""}
          </>
        );
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Registering remote tokens";
    }
  }, [chainIds.length, txState.status]);

  return "hash" in txState && txState.hash ? (
    <LinkButton
      variant="accent"
      outline
      href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txState.hash}`}
      className="flex items-center gap-2"
      target="_blank"
    >
      View on Axelarscan {maskAddress(txState.hash)}{" "}
      <ExternalLinkIcon className="h-4 w-4" />
    </LinkButton>
  ) : (
    <Button
      onClick={handleClick}
      disabled={!writeAsync}
      variant="primary"
      loading={txState.status === "awaiting_approval"}
    >
      {buttonChildren}
    </Button>
  );
};
