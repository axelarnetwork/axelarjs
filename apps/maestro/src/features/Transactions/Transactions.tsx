import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Button, HourglassIcon, Tooltip, XIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect, useRef, type FC } from "react";
import Link from "next/link";

import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
  useGetTransactionType,
} from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
import {
  CollapsedChainStatusItems,
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
  const { data: txType } = useGetTransactionType({
    txHash,
  });

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

  const txTypeMap = {
    INTERCHAIN_DEPLOYMENT: "Interchain Deployment",
    INTERCHAIN_TRANSFER: "Interchain Transfer",
  };
  const txTypeText = txType ? txTypeMap[txType] : "Loading...";

  const initializedStatus: GMPTxStatus[] = ["called", "confirming"];
  const executedStatus: GMPTxStatus[] = ["executed"];
  const failedStatus: GMPTxStatus[] = ["error", "insufficient_fee"];
  const confirmedStatus: GMPTxStatus[] = [
    "confirmed",
    "approving",
    "approved",
    "executing",
  ];
  const onlyStatuses = (statuses: GMPTxStatus[]) => (entries: any) =>
    statuses.includes(entries[1].status);

  const statusEntriesGroup = {
    initialized: statusEntries.filter(onlyStatuses(initializedStatus)),
    executed: statusEntries.filter(onlyStatuses(executedStatus)),
    confirmed: statusEntries.filter(onlyStatuses(confirmedStatus)),
    failed: statusEntries.filter(onlyStatuses(failedStatus)),
  };

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
      {hasStatus ? (
        <ul className="rounded-box mt-1 grid gap-2 pb-2 pl-3">
          {statusEntriesGroup.initialized.length > 0 ? (
            <CollapsedChainStatusItems
              compact
              key={`initialized`}
              chains={statusEntriesGroup.initialized.map(
                ([, entry]) => entry.chain
              )}
              status={"called"}
              txHash={txHash}
              logIndexes={statusEntriesGroup.initialized.map(
                ([, entry]) => entry.logIndex
              )}
              className="gap-3 text-sm"
            />
          ) : (
            <div>
              {statusEntriesGroup.confirmed.length > 0 && (
                <CollapsedChainStatusItems
                  compact
                  key={`confirmed`}
                  chains={statusEntriesGroup.confirmed.map(
                    ([, entry]) => entry.chain
                  )}
                  txHash={txHash}
                  status={"confirmed"}
                  logIndexes={statusEntriesGroup.confirmed.map(
                    ([, entry]) => entry.logIndex
                  )}
                  className="gap-3 text-sm"
                />
              )}

              {statusEntriesGroup.executed.length > 0 && (
                <CollapsedChainStatusItems
                  compact
                  key={`executed`}
                  chains={statusEntriesGroup.executed.map(
                    ([, entry]) => entry.chain
                  )}
                  status={"executed"}
                  txHash={txHash}
                  logIndexes={statusEntriesGroup.executed.map(
                    ([, entry]) => entry.logIndex
                  )}
                  className="gap-3 text-sm"
                />
              )}
            </div>
          )}
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
