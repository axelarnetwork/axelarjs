import { Button, HourglassIcon, Tooltip, XIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect, useMemo, useRef, type FC } from "react";
import Link from "next/link";

import { groupBy } from "rambda";

import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
  useGetTransactionType,
} from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
import {
  CollapsedChainStatusItems,
  ExtendedGMPTxStatus,
  useGMPTxProgress,
} from "~/ui/compounds/GMPTxStatusMonitor";
import { useTransactionsContainer } from "./Transactions.state";

const TX_LABEL_MAP = {
  INTERCHAIN_DEPLOYMENT: "Interchain Deployment",
  INTERCHAIN_TRANSFER: "Interchain Transfer",
} as const;

function useGroupedStatuses(txHash: `0x${string}`) {
  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash,
  });

  const { computed } = useEVMChainConfigsQuery();

  const statuesValues = useMemo(
    () =>
      Object.entries(statuses ?? {}).map(([axelarChainId, entry]) => ({
        ...entry,
        chain: computed.indexedById[axelarChainId],
      })),
    [computed.indexedById, statuses]
  );

  const groupedStatusesProps = useMemo(
    () =>
      Object.entries(groupBy((x) => x.status, statuesValues)).map(
        ([status, entries]) => ({
          status: status as ExtendedGMPTxStatus,
          chains: entries.map((entry) => entry.chain),
          logIndexes: entries.map((entry) => entry.logIndex),
          txHash,
        })
      ),
    [statuesValues, txHash]
  );

  return { groupedStatusesProps, hasStatus: statuesValues.length > 0 };
}

const ToastElement: FC<{
  txHash: `0x${string}`;
  chainId: number;
}> = ({ txHash, chainId }) => {
  const { elapsedBlocks, expectedConfirmations, progress } = useGMPTxProgress(
    txHash,
    chainId
  );

  const { computed } = useEVMChainConfigsQuery();
  const { data: txType } = useGetTransactionType({
    txHash,
  });

  const isLoading = !expectedConfirmations || expectedConfirmations <= 1;

  const txTypeText = txType ? TX_LABEL_MAP[txType] : "Loading...";

  const { groupedStatusesProps, hasStatus } = useGroupedStatuses(txHash);

  const content = (
    <>
      <div className="flex items-center">
        <Tooltip tip="View on Axelarscan" position="left">
          <Link
            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ChainIcon
              src={computed.indexedByChainId[chainId]?.image}
              size={"md"}
              alt={"Arbitrum"}
            />
          </Link>
        </Tooltip>
        <div className="mx-2 flex flex-col items-start">
          <span className="text-sm">{txTypeText}</span>
          {elapsedBlocks < expectedConfirmations ? (
            <Tooltip
              tip={`Waiting for finality on ${computed.indexedByChainId[chainId]?.name}`}
              position="top"
            >
              <div className="text-xs">
                {elapsedBlocks} / {expectedConfirmations} blocks{" "}
                <span className="opacity-75">({progress})</span>
              </div>
            </Tooltip>
          ) : (
            <Tooltip tip={`Waiting for approval on Axelar`} position="top">
              <div className="text-xs">Finality Blocks Reached</div>
            </Tooltip>
          )}
        </div>
      </div>{" "}
      {!hasStatus ? (
        <div className="p-4 text-sm">Loading tx status...</div>
      ) : (
        <ul className="rounded-box mt-1 grid gap-2 pb-2 pl-3">
          {groupedStatusesProps.map((props) => (
            <CollapsedChainStatusItems key={props.status} {...props} />
          ))}
        </ul>
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
      {state.pendingTransactions.map((tx) => {
        if (!tx.hash || !tx.chainId) {
          return null;
        }
        return (
          <GMPTransaction key={tx.hash} txHash={tx.hash} chainId={tx.chainId} />
        );
      })}
    </>
  );
};

export default Transactions;