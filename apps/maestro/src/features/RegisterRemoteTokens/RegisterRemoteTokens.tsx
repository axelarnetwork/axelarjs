import { Button, ExternalLinkIcon, LinkButton } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toast";
import { maskAddress } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, type FC } from "react";

import { useAccount, useWaitForTransaction } from "wagmi";

import {
  useTransactionState,
  type TransactionState,
} from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import useRegisterRemoteCanonicalTokens from "./hooks/useRegisterRemoteCanonicalTokens";
import useRegisterRemoteStandardizedTokens from "./hooks/useRegisterRemoteStandardizedTokens";

export type RegisterRemoteTokensProps = {
  tokenAddress: `0x${string}`;
  chainIds: number[];
  originChainId?: number;
  onTxStateChange?: (status: TransactionState) => void;
  existingTxHash?: `0x${string}` | null;
  deploymentKind: "canonical" | "standardized";
};

export const RegisterRemoteTokens: FC<RegisterRemoteTokensProps> = (props) => {
  const { address: deployerAddress } = useAccount();
  const [txState, setTxState] = useTransactionState();

  useEffect(
    () => {
      props.onTxStateChange?.(txState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txState]
  );

  const { mutateAsync: recordRemoteTokenDeployment } =
    trpc.interchainToken.recordRemoteTokensDeployment.useMutation();

  const { computed } = useEVMChainConfigsQuery();

  const txHash = useMemo(() => {
    if (txState.status === "submitted") {
      return txState.hash;
    }
    return props.existingTxHash;
  }, [txState, props.existingTxHash]);

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash:
      txState.status === "submitted"
        ? txState.hash
        : props.existingTxHash ?? undefined,
  });

  const pendingChains = useMemo(
    () =>
      statuses
        ? props.chainIds.filter(
            (chainId) => statuses[chainId]?.status !== "executed"
          )
        : undefined,
    [props.chainIds, statuses]
  );

  useEffect(() => {
    if (pendingChains && pendingChains.length === 0) {
      toast.success("Remote tokens registered");
    }
  }, [pendingChains]);

  useWaitForTransaction({
    hash: txState.status === "submitted" ? txState.hash : undefined,
    confirmations: 8,
    async onSuccess(receipt) {
      await recordRemoteTokenDeployment({
        tokenAddress: props.tokenAddress,
        chainId: props.originChainId ?? -1,
        remoteTokens: props.chainIds.map((chainId) => ({
          address: props.tokenAddress,
          chainId,
          tokenAddress: props.tokenAddress,
          deploymentStatus: "pending",
          deploymentTxHash: receipt.transactionHash,
          axelarChainId: computed.indexedByChainId[chainId].id,
        })),
      });

      setTxState({
        status: "confirmed",
        receipt,
      });
    },
  });

  const { writeAsync: registerCanonicalTokensAsync } =
    useRegisterRemoteCanonicalTokens({
      chainIds: props.chainIds,
      deployerAddress: deployerAddress as `0x${string}`,
      tokenAddress: props.tokenAddress,
      originChainId: props.originChainId ?? -1,
    });

  const { writeAsync: registerStandardizedTokensAsync } =
    useRegisterRemoteStandardizedTokens({
      chainIds: props.chainIds,
      deployerAddress: deployerAddress as `0x${string}`,
      tokenAddress: props.tokenAddress,
      originChainId: props.originChainId ?? -1,
    });

  const registerTokensAsync = useMemo(() => {
    switch (props.deploymentKind) {
      case "canonical":
        return registerCanonicalTokensAsync;
      case "standardized":
        return registerStandardizedTokensAsync;
    }
  }, [
    props.deploymentKind,
    registerCanonicalTokensAsync,
    registerStandardizedTokensAsync,
  ]);

  const handleClick = useCallback(async () => {
    if (!registerTokensAsync) return;

    setTxState({
      status: "awaiting_approval",
    });

    const txPromise = registerTokensAsync();

    await handleTransactionResult(txPromise, {
      onSuccess(tx) {
        setTxState({
          status: "submitted",
          hash: tx.hash,
        });
      },
      onTransactionError(error) {
        setTxState({
          status: "idle",
        });

        toast.error(`Transaction failed: ${error.cause.shortMessage}`);

        logger.error("Failed to register remote tokens", error.cause);
      },
    });
  }, [setTxState, registerTokensAsync]);

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
        return (
          <>
            Register token on {props.chainIds.length} additional chain
            {props.chainIds.length > 1 ? "s" : ""}
          </>
        );
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Registering remote tokens";
    }
  }, [props.chainIds.length, txState.status]);

  return txHash ? (
    <LinkButton
      variant="accent"
      outline
      href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}`}
      className="flex items-center gap-2"
      target="_blank"
    >
      View on Axelarscan {maskAddress(txHash)}{" "}
      <ExternalLinkIcon className="h-4 w-4" />
    </LinkButton>
  ) : (
    <Button
      onClick={handleClick}
      disabled={!registerTokensAsync}
      variant="primary"
      loading={txState.status === "awaiting_approval"}
    >
      {buttonChildren}
    </Button>
  );
};
