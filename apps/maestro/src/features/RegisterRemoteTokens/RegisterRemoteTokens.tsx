import { Button } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
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
import useRegisterRemoteCanonicalTokens from "./hooks/useRegisterRemoteCanonicalTokens";
import useRegisterRemoteInterchainTokens from "./hooks/useRegisterRemoteInterchainTokens";

export type RegisterRemoteTokensProps = {
  tokenAddress: `0x${string}`;
  chainIds: number[];
  originChainId?: number;
  onTxStateChange?: (status: TransactionState) => void;
  deploymentKind: "canonical" | "interchain" | "custom";
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

  useWaitForTransaction({
    hash: txState.status === "submitted" ? txState.hash : undefined,
    confirmations: 8,
    async onSuccess(receipt) {
      await recordRemoteTokenDeployment({
        tokenAddress: props.tokenAddress,
        chainId: props.originChainId ?? -1,
        deploymentMessageId: `${receipt.transactionHash}-0`,
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

  const { writeAsync: registerInterchainTokensAsync } =
    useRegisterRemoteInterchainTokens({
      chainIds: props.chainIds,
      minter: deployerAddress as `0x${string}`,
      tokenAddress: props.tokenAddress,
      originChainId: props.originChainId ?? -1,
    });

  const registerTokensAsync = useMemo(() => {
    switch (props.deploymentKind) {
      case "canonical":
        return registerCanonicalTokensAsync;
      case "interchain":
        return registerInterchainTokensAsync;
    }
  }, [
    props.deploymentKind,
    registerCanonicalTokensAsync,
    registerInterchainTokensAsync,
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
          chainId: props.originChainId ?? -1,
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
  }, [registerTokensAsync, setTxState, props.originChainId]);

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
      default:
        return txState.status;
    }
  }, [props.chainIds.length, txState.status]);

  return (
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
