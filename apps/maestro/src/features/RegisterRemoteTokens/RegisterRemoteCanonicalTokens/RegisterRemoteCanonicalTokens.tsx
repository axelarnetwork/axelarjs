import { Button, toast } from "@axelarjs/ui";
import { useCallback, useEffect, useMemo, type FC } from "react";

import { TransactionExecutionError } from "viem";
import { useAccount } from "wagmi";

import {
  useTransactionState,
  type TransactionState,
} from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { useRegisterRemoteCanonicalTokens } from "./hooks";

type Props = {
  tokenAddress: `0x${string}`;
  chainIds: number[];
  originChainId?: number;
  onTxStateChange?: (status: TransactionState) => void;
};

export const RegisterRemoteCanonicalTokens: FC<Props> = ({
  tokenAddress,
  chainIds,
  originChainId,
  onTxStateChange,
}) => {
  const { address: deployerAddress } = useAccount();

  const [txState, setTxState] = useTransactionState();

  useEffect(() => {
    onTxStateChange?.(txState);
  }, [onTxStateChange, txState]);

  const { writeAsync: registerTokens } = useRegisterRemoteCanonicalTokens({
    chainIds: chainIds,
    deployerAddress: deployerAddress as `0x${string}`,
    tokenAddress,
    originChainId: originChainId ?? -1,
  });

  const handleClick = useCallback(async () => {
    if (!registerTokens) return;

    setTxState({
      status: "awaiting_approval",
    });

    try {
      const tx = await registerTokens();
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
  }, [setTxState, registerTokens]);

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

  return (
    <Button
      onClick={handleClick}
      disabled={!registerTokens}
      variant="primary"
      loading={txState.status === "awaiting_approval"}
    >
      {buttonChildren}
    </Button>
  );
};
