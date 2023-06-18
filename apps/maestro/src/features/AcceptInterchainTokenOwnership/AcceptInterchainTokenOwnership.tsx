import type { EVMChainConfig } from "@axelarjs/api";
import { Button, toast } from "@axelarjs/ui";
import { useCallback, useMemo, type FC } from "react";

import { TransactionExecutionError, UserRejectedRequestError } from "viem";
import { useWaitForTransaction } from "wagmi";

import { useAcceptInterchainTokenOnwership } from "~/lib/contract/hooks/useInterchainToken";
import { useTransactionState } from "~/lib/hooks/useTransaction";
import { trpc } from "~/lib/trpc";

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChain: EVMChainConfig;
  isOpen?: boolean;
  accountAddress: `0x${string}`;
  onClose?: () => void;
};

export const AcceptInterchainTokenOwnership: FC<Props> = (props) => {
  const [txState, setTxState] = useTransactionState();

  const {
    writeAsync: acceptOwnershipAsync,
    isLoading: isAccepting,
    data: acceptResult,
  } = useAcceptInterchainTokenOnwership({
    address: props.tokenAddress,
  });

  const trpcContext = trpc.useContext();

  useWaitForTransaction({
    hash: acceptResult?.hash,
    confirmations: 8,
    async onSuccess(receipt) {
      if (!acceptResult) {
        return;
      }

      await Promise.all([
        trpcContext.interchainToken.searchInterchainToken.invalidate(),
        trpcContext.interchainToken.getInterchainTokenDetails.invalidate(),
        trpcContext.interchainToken.getInterchainTokenBalanceForOwner.invalidate(),
      ]);

      await Promise.all([
        trpcContext.interchainToken.searchInterchainToken.refetch(),
        trpcContext.interchainToken.getInterchainTokenDetails.refetch(),
        trpcContext.interchainToken.getInterchainTokenBalanceForOwner.refetch(),
      ]);

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Successfully accepted token ownership");
    },
  });

  const handleSubmit = useCallback(async () => {
    setTxState({
      status: "awaiting_approval",
    });

    try {
      const txResult = await acceptOwnershipAsync();

      if (txResult?.hash) {
        setTxState({
          status: "submitted",
          hash: txResult?.hash,
        });
      }
    } catch (error) {
      if (
        error instanceof TransactionExecutionError &&
        error.cause instanceof UserRejectedRequestError
      ) {
        toast.error("Transaction rejected by user");
        setTxState({
          status: "idle",
        });
        return;
      }
      setTxState({
        status: "reverted",
        error: error as Error,
      });
    }
  }, [setTxState, acceptOwnershipAsync]);

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "accept ownership";
      case "awaiting_approval":
        return "confirm";
      case "reverted":
        return "failed";
    }
  }, [txState]);

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={isAccepting}
      size="xs"
      loading={
        txState.status === "awaiting_approval" || txState.status === "submitted"
      }
      onClick={handleSubmit}
    >
      {buttonChildren}
    </Button>
  );
};

export default AcceptInterchainTokenOwnership;
