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

  const { mutateAsync: recordRemoteTokenDeployment } =
    trpc.interchainToken.recordRemoteTokensDeployment.useMutation();

  const { computed } = useEVMChainConfigsQuery();

  const baseRemoteTokens = props.chainIds.map((chainId) => ({
    chainId,
    address: props.tokenAddress,
    tokenAddress: props.tokenAddress,
    deploymentStatus: "pending",
    deploymentTxHash: "0x",
    axelarChainId: computed.indexedByChainId[chainId].id,
  }));

  useWaitForTransaction({
    hash: txState.status === "submitted" ? txState.hash : undefined,
    enabled: txState.status === "submitted" && Boolean(txState.hash),
    onSuccess: async (receipt) => {
      const remoteTokens = baseRemoteTokens.map((remoteToken) => ({
        ...remoteToken,
        deploymentTxHash: receipt.transactionHash,
      }));

      await recordRemoteTokenDeployment({
        tokenAddress: props.tokenAddress,
        chainId: props.originChainId ?? -1,
        deploymentMessageId: `${receipt.transactionHash}-0`,
        remoteTokens,
      });

      setTxState({
        status: "confirmed",
        receipt,
      });
    },
  });

  const { writeAsync: registerCanonicalTokensAsync, reset: resetCanonical } =
    useRegisterRemoteCanonicalTokens({
      chainIds: props.chainIds,
      deployerAddress: deployerAddress as `0x${string}`,
      tokenAddress: props.tokenAddress,
      originChainId: props.originChainId ?? -1,
    });

  const { writeAsync: registerInterchainTokensAsync, reset: resetInterchain } =
    useRegisterRemoteInterchainTokens({
      chainIds: props.chainIds,
      tokenAddress: props.tokenAddress,
      originChainId: props.originChainId ?? -1,
    });

  useEffect(
    () => {
      props.onTxStateChange?.(txState);

      if (txState.status === "confirmed") {
        // reset muations & tx state
        resetCanonical();
        resetInterchain();
        setTxState({ status: "idle" });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txState.status]
  );

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
          txType: "INTERCHAIN_DEPLOYMENT",
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
      disabled={!registerTokensAsync || txState.status !== "idle"}
      variant="primary"
      loading={txState.status === "awaiting_approval"}
    >
      {buttonChildren}
    </Button>
  );
};
