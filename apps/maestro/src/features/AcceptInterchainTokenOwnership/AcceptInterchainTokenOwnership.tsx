import type { EVMChainConfig } from "@axelarjs/api";
import { Button } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useMemo, type FC } from "react";

import { TransactionExecutionError } from "viem";
import { useWaitForTransaction } from "wagmi";

import { useInterchainTokenServiceAcceptOwnership } from "~/lib/contracts/InterchainTokenService.hooks";
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
    writeAsync: acceptOwnershipAsync,
    isLoading: isAccepting,
    data: acceptResult,
  } = useInterchainTokenServiceAcceptOwnership({
    address: props.tokenAddress,
  });

  const trpcContext = trpc.useUtils();

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
          hash: txResult.hash,
          chainId: props.sourceChain.chain_id,
        });
      }
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
