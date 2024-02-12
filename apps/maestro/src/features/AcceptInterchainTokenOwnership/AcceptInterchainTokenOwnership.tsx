import type { EVMChainConfig } from "@axelarjs/api";
import { Button } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect, useMemo, type FC } from "react";

import { TransactionExecutionError } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import { useWriteInterchainTokenServiceAcceptOwnership } from "~/lib/contracts/InterchainTokenService.hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
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
    writeContractAsync: acceptOwnershipAsync,
    isPending: isAccepting,
    data: acceptTxHash,
  } = useWriteInterchainTokenServiceAcceptOwnership();

  const trpcContext = trpc.useUtils();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: acceptTxHash,
  });

  const onReceipt = useCallback(async () => {
    if (!acceptTxHash || !receipt) {
      return;
    }

    await Promise.all([
      trpcContext.interchainToken.searchInterchainToken.invalidate(),
      trpcContext.interchainToken.getInterchainTokenDetails.invalidate(),
      trpcContext.erc20.getERC20TokenBalanceForOwner.invalidate(),
    ]);

    await Promise.all([
      trpcContext.interchainToken.searchInterchainToken.refetch(),
      trpcContext.interchainToken.getInterchainTokenDetails.refetch(),
      trpcContext.erc20.getERC20TokenBalanceForOwner.refetch(),
    ]);

    setTxState({
      status: "confirmed",
      receipt,
    });

    toast.success("Successfully accepted token ownership");
  }, [
    acceptTxHash,
    receipt,
    setTxState,
    trpcContext.erc20.getERC20TokenBalanceForOwner,
    trpcContext.interchainToken.getInterchainTokenDetails,
    trpcContext.interchainToken.searchInterchainToken,
  ]);

  useEffect(
    () => {
      if (!receipt) return;
      onReceipt().catch((error) => {
        console.error("Error while updating token ownership", error);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt]
  );

  const handleSubmit = useCallback(async () => {
    setTxState({
      status: "awaiting_approval",
    });

    try {
      const txHash = await acceptOwnershipAsync({});

      setTxState({
        status: "submitted",
        hash: txHash,
        chainId: props.sourceChain.chain_id,
      });
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Transaction failed: ${error.cause.shortMessage}`);

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
  }, [setTxState, acceptOwnershipAsync, props.sourceChain.chain_id]);

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
      size="xs"
      loading={
        txState.status === "awaiting_approval" ||
        txState.status === "submitted" ||
        isAccepting
      }
      onClick={handleSubmit}
    >
      {buttonChildren}
    </Button>
  );
};

export default AcceptInterchainTokenOwnership;
