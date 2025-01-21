import { EVMChainConfig, VMChainConfig } from "@axelarjs/api";
import { Alert, Button } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect, useMemo, type FC } from "react";

import type { TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { GetBalanceReturnType } from "wagmi/actions";

import { useAccount } from "~/lib/hooks";
import {
  useTransactionState,
  type TransactionState,
} from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { handleTransactionResult } from "~/lib/transactions/handlers";
import { trpc } from "~/lib/trpc";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import useRegisterRemoteCanonicalTokens from "./hooks/useRegisterRemoteCanonicalTokens";
import useRegisterRemoteInterchainTokens from "./hooks/useRegisterRemoteInterchainTokens";

export type RegisterRemoteTokensProps = {
  tokenAddress: string;
  chainIds: number[];
  originChainId?: number;
  originChain?: EVMChainConfig | VMChainConfig;
  userGasBalance: GetBalanceReturnType | undefined;
  gasFees: bigint[] | undefined;
  onTxStateChange?: (status: TransactionState) => void;
  deploymentKind: "canonical" | "interchain" | "custom";
};

export const RegisterRemoteTokens: FC<RegisterRemoteTokensProps> = (props) => {
  const { address: deployerAddress } = useAccount();
  const [txState, setTxState] = useTransactionState();

  const { mutateAsync: recordRemoteTokenDeployment } =
    trpc.interchainToken.recordRemoteTokensDeployment.useMutation();

  const { combinedComputed } = useAllChainConfigsQuery();

  const baseRemoteTokens = props.chainIds.map((chainId) => ({
    chainId,
    address: props.tokenAddress,
    tokenAddress: props.tokenAddress,
    deploymentStatus: "pending",
    deploymentTxHash: "0x",
    axelarChainId: combinedComputed.indexedByChainId[chainId].id,
  }));

  const onReceipt = useCallback(
    async (receipt: TransactionReceipt) => {
      const { transactionHash: txHash, transactionIndex: txIndex } = receipt;

      const remoteTokens = baseRemoteTokens.map((remoteToken) => ({
        ...remoteToken,
        deploymentTxHash: txHash,
      }));

      await recordRemoteTokenDeployment({
        tokenAddress: props.tokenAddress,
        chainId: props.originChainId ?? -1,
        deploymentMessageId: `${txHash}-${txIndex}`,
        remoteTokens,
      });

      setTxState({
        status: "confirmed",
        receipt,
      });
    },
    [
      baseRemoteTokens,
      props.originChainId,
      props.tokenAddress,
      recordRemoteTokenDeployment,
      setTxState,
    ]
  );

  const { data: receipt } = useWaitForTransactionReceipt({
    hash:
      txState.status === "submitted"
        ? (txState.hash as `0x${string}`)
        : undefined,
  });

  const onSuiTxComplete = useCallback(async () => {
    if (txState.status !== "submitted") return;
    if (!txState.suiTx) return;

    console.log("onSuiTxComplete", txState.hash);
    const { digest } = txState.suiTx;

    const remoteTokens = baseRemoteTokens.map((remoteToken) => ({
      ...remoteToken,
      deploymentTxHash: digest,
    }));
    console.log("remoteTokens", remoteTokens);
    await recordRemoteTokenDeployment({
      tokenAddress: props.tokenAddress,
      chainId: props.originChainId ?? -1,
      // TODO: find event Txindex correctly
      deploymentMessageId: `${digest}`,
      remoteTokens,
    });
    console.log("setTxState");
    setTxState({
      status: "confirmed",
      hash: digest,
      suiTx: txState.suiTx,
    });
  }, [
    baseRemoteTokens,
    props.originChainId,
    props.tokenAddress,
    recordRemoteTokenDeployment,
    setTxState,
    txState,
  ]);

  useEffect(
    () => {
      if (txState.status !== "submitted") return;

      onSuiTxComplete().catch((error) => {
        logger.error("Failed to record remote token deployment", error);
        toast.error("Failed to record remote token deployment");
      });
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [txState.status]
  );

  useEffect(
    () => {
      if (!receipt) return;
      onReceipt(receipt).catch((error) => {
        logger.error("Failed to record remote token deployment", error);
        toast.error("Failed to record remote token deployment");
      });
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt]
  );

  const {
    writeContractAsync: registerCanonicalTokensAsync,
    reset: resetCanonical,
  } = useRegisterRemoteCanonicalTokens({
    chainIds: props.chainIds,
    deployerAddress: deployerAddress,
    tokenAddress: props.tokenAddress,
    originChainId: props.originChainId ?? -1,
  });

  const {
    writeContractAsync: registerInterchainTokensAsync,
    reset: resetInterchain,
  } = useRegisterRemoteInterchainTokens({
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
      onSuccess(txHash) {
        setTxState({
          status: "submitted",
          hash: txHash,
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

  const hasEnoughGasBalance = useMemo(() => {
    const { gasFees, userGasBalance } = props;
    if (!userGasBalance || !gasFees) return false;
    return userGasBalance.value > gasFees.reduce((a, b) => a + b, 0n);
  }, [props]);

  const buttonChildren = useMemo(() => {
    if (!hasEnoughGasBalance)
      return `Insufficient ${
        props.originChain?.native_token?.symbol ?? ""
      } balance for gas fees`;
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
  }, [
    props.chainIds.length,
    txState.status,
    hasEnoughGasBalance,
    props.originChain,
  ]);

  return hasEnoughGasBalance ? (
    <Button
      $variant="primary"
      onClick={handleClick}
      disabled={!registerTokensAsync || txState.status !== "idle"}
      $loading={txState.status === "awaiting_approval"}
    >
      {buttonChildren}
    </Button>
  ) : (
    <Alert $status={"error"} className="max-w-96">
      {buttonChildren}
    </Alert>
  );
};
