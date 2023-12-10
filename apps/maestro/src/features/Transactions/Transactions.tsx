import { Button, HourglassIcon, XIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect, useRef, type FC } from "react";

import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import {
  ChainStatusItem,
  useGMPTxProgress,
} from "~/ui/compounds/GMPTxStatusMonitor";
import { useTransactionsContainer } from "./Transactions.state";

const ToastElement: FC<{
  txHash: `0x${string}`;
  chainId: number;
}> = ({ txHash, chainId }) => {
  const { elapsedBlocks, expectedConfirmations, progress } = useGMPTxProgress(
    txHash,
    chainId
  );

  const { computed } = useEVMChainConfigsQuery();

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash,
  });

  const isLoading = !expectedConfirmations || expectedConfirmations <= 1;

  const statusEntries = Object.entries(statuses ?? {})
    .map(
      ([axelarChainId, entry]) =>
        [
          axelarChainId,
          {
            ...entry,
            chain: computed.indexedById[axelarChainId],
          },
        ] as const
    )
    .filter(([, entry]) => entry.chain);

  const hasStatus = statusEntries.length > 0;

  const content = (
    <>
      {elapsedBlocks < expectedConfirmations && (
        <div className="mx-auto">
          <div className="text-sm">
            {elapsedBlocks} / {expectedConfirmations} blocks{" "}
            <span className="text-sm opacity-75">({progress})</span>
          </div>
        </div>
      )}{" "}
      {hasStatus ? (
        <ul className="rounded-box grid gap-2 p-4">
          {statusEntries.map(([axelarChainId, { status, logIndex, chain }]) => (
            <ChainStatusItem
              compact
              key={`chain-status-${axelarChainId}`}
              chain={chain}
              status={status}
              txHash={txHash}
              logIndex={logIndex}
              className="gap-3 text-sm"
            />
          ))}
        </ul>
      ) : (
        <div className="p-4 text-sm">Loading tx status...</div>
      )}
    </>
  );

  return (
    <div className="bg-base-300 border-base-200 relative grid gap-2 rounded-md p-2 pl-4 pr-8 shadow-md shadow-black/10">
      <Button
        className="absolute right-2 top-2"
        size="xs"
        shape="circle"
        onClick={toast.dismiss.bind(null, txHash)}
      >
        <XIcon size={12} />
      </Button>
      {isLoading ? (
        <div className="p-4 py-8">Loading tx status...</div>
      ) : (
        content
      )}
    </div>
  );
};

const GMPTransaction: FC<{
  txHash: `0x${string}`;
  chainId: number;
}> = (props) => {
  const {
    computed: { chains: total, executed },
    isLoading,
  } = useGetTransactionStatusOnDestinationChainsQuery({ txHash: props.txHash });

  const [, actions] = useTransactionsContainer();

  const intervalRef = useRef<number>();

  const watchTxToCompletion = useCallback(async () => {
    return new Promise((resolve) => {
      intervalRef.current = window.setInterval(() => {
        if (isLoading) {
          return;
        }

        if (executed >= total) {
          window.clearInterval(intervalRef.current);

          resolve({
            status: "success",
            executed,
            total,
          });
        }
      }, 1000);
    });
  }, [executed, isLoading, total]);

  useEffect(() => {
    async function task(toastId: string) {
      await watchTxToCompletion();
      toast.dismiss(toastId);
      actions.removeTransaction(props.txHash);
    }

    toast.custom(
      <ToastElement txHash={props.txHash} chainId={props.chainId} />,
      {
        id: props.txHash,
        duration: Infinity,
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    task(props.txHash);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [actions, props.chainId, props.txHash, watchTxToCompletion]);

  return <></>;
};

const Transactions = () => {
  const [state] = useTransactionsContainer();

  const hasPendingTransactions = state.pendingTransactions.length > 0;

  return (
    <>
      {hasPendingTransactions && (
        <div className="indicator bg-base-300 rounded-full p-2">
          <span className="indicator-item badge badge-info badge-sm">
            {state.pendingTransactions.length}
          </span>
          <HourglassIcon size={16} />
        </div>
      )}
      {state.pendingTransactions.map((tx) => (
        <GMPTransaction key={tx.hash} txHash={tx.hash} chainId={tx.chainId} />
      ))}
    </>
  );
};

export default Transactions;
