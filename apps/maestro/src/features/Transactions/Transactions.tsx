import { Button, HourglassIcon, Tooltip, XIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { Maybe } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useRef, type FC } from "react";
import Link from "next/link";

import { groupBy } from "rambda";

import { useChainId, type TxType } from "~/lib/hooks";
import { getNormalizedTwoHopChainConfig } from "~/lib/utils/chains";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/ChainsDropdown";
import {
  CollapsedChainStatusGroup,
  ExtendedGMPTxStatus,
  useGMPTxProgress,
} from "~/ui/compounds/GMPTxStatusMonitor";
import { useTransactionsContainer } from "./Transactions.state";

const TX_LABEL_MAP: Record<TxType, string> = {
  INTERCHAIN_DEPLOYMENT: "Interchain Deployment",
  INTERCHAIN_TRANSFER: "Interchain Transfer",
} as const;

const TX_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

function useGroupedStatuses(txHash: string) {
  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash,
  });

  const { combinedComputed } = useAllChainConfigsQuery();
  const chainId = useChainId();

  return useMemo(() => {
    const statusValues = Object.entries(statuses ?? {}).map(
      ([axelarChainId, entry]) => ({
        ...entry,
        chain: getNormalizedTwoHopChainConfig(
          axelarChainId,
          combinedComputed,
          chainId
        ),
      })
    );

    const groupedStatusesProps = Object.entries(
      groupBy((x) => x.status ?? "pending", statusValues)
    ).map(([status, entries]) => ({
      status: status as ExtendedGMPTxStatus,
      chains: entries.map((entry) => entry.chain),
      logIndexes: entries.map((entry) => entry.logIndex),
      txHash,
    }));

    return {
      groupedStatusesProps,
      hasStatus: statusValues.length > 0,
    };
  }, [combinedComputed, chainId, statuses, txHash]);
}

type ToastElementProps = {
  txHash: string;
  chainId: number;
  txType: TxType;
  onRemoveTx?: (txHash: string) => void;
  onBeforeDismiss?: () => void;
};

const ToastElement: FC<ToastElementProps> = ({
  txHash,
  chainId,
  txType,
  onRemoveTx,
  onBeforeDismiss,
}) => {
  const { elapsedBlocks, expectedConfirmations, progress } = useGMPTxProgress(
    txHash,
    chainId
  );

  const { combinedComputed } = useAllChainConfigsQuery();

  const isLoading =
    !expectedConfirmations || expectedConfirmations < elapsedBlocks;

  const txTypeText = Maybe.of(txType).mapOrNull(
    (txType) => TX_LABEL_MAP[txType]
  );

  const { groupedStatusesProps, hasStatus } = useGroupedStatuses(txHash);

  const chainConfig = Maybe.of(combinedComputed.indexedByChainId[chainId]);

  const wagmiChain = useMemo(
    () =>
      combinedComputed.wagmiChains.find(
        (wagmiChain) => wagmiChain.id === chainId
      ),
    [combinedComputed.wagmiChains, chainId]
  );

  const showFinalityProgressBar =
    groupedStatusesProps.some((group) => group.status === "called") &&
    elapsedBlocks < expectedConfirmations;

  const content = (
    <>
      <div className="flex items-center">
        {wagmiChain ? (
          <Tooltip
            tip={`View on ${wagmiChain.blockExplorers?.default.name}`}
            $position="left"
          >
            <Link
              href={`${wagmiChain.blockExplorers?.default.url}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ChainIcon
                src={chainConfig.mapOr("", (config) => config.image)}
                alt={chainConfig.mapOr("", (config) => config.name)}
                size="md"
              />
            </Link>
          </Tooltip>
        ) : (
          <ChainIcon
            src={chainConfig.mapOr("", (config) => config.image)}
            alt={chainConfig.mapOr("", (config) => config.name)}
            size="md"
          />
        )}
        <div className="mx-2 flex flex-col items-start">
          <span className="text-sm">{txTypeText}</span>
          {showFinalityProgressBar ? (
            <Tooltip
              tip={`Waiting for finality on ${combinedComputed.indexedByChainId[chainId]?.name}`}
              $position="top"
            >
              <div className="text-xs">
                {elapsedBlocks} / {expectedConfirmations} blocks{" "}
                <span className="opacity-75">({progress})</span>
              </div>
            </Tooltip>
          ) : (
            <Tooltip tip={`Waiting for approval on Axelar`} $position="top">
              <div className="flex items-center gap-1 text-xs">
                Finality blocks reached <span className="text-success">✓</span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>{" "}
      {!hasStatus ? (
        <div className="p-4 text-sm">Loading tx status...</div>
      ) : (
        <ul className="mt-1 grid gap-2 pb-2 pl-3">
          {groupedStatusesProps.map((props) => (
            <CollapsedChainStatusGroup key={props.status} {...props} />
          ))}
        </ul>
      )}
    </>
  );

  const handleDismiss = useCallback(() => {
    onBeforeDismiss?.();

    toast.dismiss(txHash);

    // dismiss permanently if tx status is error or insufficient_fee
    if (
      groupedStatusesProps.some(
        (x) => x.status === "error" || x.status === "insufficient_fee"
      )
    ) {
      onRemoveTx?.(txHash);
    }
  }, [groupedStatusesProps, onRemoveTx, txHash, onBeforeDismiss]);

  return (
    <div className="relative grid gap-2 rounded-md border-base-200 bg-base-300 p-2 pl-4 pr-8 shadow-md shadow-black/10">
      <Button
        className="absolute right-2 top-2"
        $size="xs"
        $shape="circle"
        onClick={handleDismiss}
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

type GMPTxStatusProps = {
  txHash: string;
  chainId: number;
  txType: keyof typeof TX_LABEL_MAP;
};

const GMPTransaction: FC<GMPTxStatusProps> = (props) => {
  const {
    data: statuses,
    computed: { chains: total, executed },
    isLoading,
  } = useGetTransactionStatusOnDestinationChainsQuery({ txHash: props.txHash });

  const [, actions] = useTransactionsContainer();

  const intervalRef = useRef<number>();
  const timeoutRef = useRef<number>();
  const toastIdRef = useRef<string>();

  // Keep latest values in refs to avoid re-creating the watcher on every data change
  const isLoadingRef = useRef(isLoading);
  const totalRef = useRef(total);
  const executedRef = useRef(executed);
  const statusesRef = useRef(statuses);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);
  useEffect(() => {
    executedRef.current = executed;
  }, [executed]);
  useEffect(() => {
    statusesRef.current = statuses;
  }, [statuses]);

  const watchTxToCompletion = useCallback(
    async () =>
      new Promise((resolve) => {
        // Safety timeout to avoid infinite waiting (15 minutes)
        timeoutRef.current = window.setTimeout(() => {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }
          resolve({ status: "timeout" as const });
        }, TX_TIMEOUT_MS);

        intervalRef.current = window.setInterval(() => {
          if (isLoadingRef.current) {
            return;
          }

          if (totalRef.current > 0 && executedRef.current >= totalRef.current) {
            window.clearInterval(intervalRef.current);
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            resolve({
              status: "success" as const,
              executed: executedRef.current,
              total: totalRef.current,
            });
            return;
          }

          const statusValues = Object.values(statusesRef.current ?? {});
          const hasTerminalError = statusValues.some(
            (s) => s.status === "error" || s.status === "insufficient_fee"
          );
          if (hasTerminalError) {
            window.clearInterval(intervalRef.current);
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            resolve({ status: "failed" as const });
          }
        }, 5000);
      }),
    []
  );

  useEffect(() => {
    // Create the toast *once* and store the ID.
    toastIdRef.current = props.txHash;
    const watchingPromise = watchTxToCompletion();
    toast.custom(
      <ToastElement
        {...props}
        onRemoveTx={actions.removeTransaction}
        onBeforeDismiss={() => {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
          }
        }}
      />,
      {
        id: toastIdRef.current,
        duration: Infinity,
      }
    );

    async function task() {
      await watchingPromise;
      toast.dismiss(toastIdRef.current);
      actions.removeTransaction(props.txHash);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    task();

    return () => {
      window.clearInterval(intervalRef.current);
      window.clearTimeout(timeoutRef.current);
    };
  }, [props.txHash, actions]);

  return <></>;
};

const Transactions = () => {
  const [state] = useTransactionsContainer();

  const hasPendingTransactions = state.pendingTransactions.length > 0;

  return (
    <>
      {hasPendingTransactions && (
        <button className="indicator rounded-full bg-base-300 p-2">
          <span className="badge indicator-item badge-info badge-sm">
            {state.pendingTransactions.length}
          </span>
          <HourglassIcon size={16} />
        </button>
      )}
      {state.pendingTransactions.map((tx) => {
        if (!tx.hash || !tx.chainId || !tx.txType) {
          return null;
        }

        const normalizedTxHash = tx.hash.split("-")[0];

        return (
          <GMPTransaction
            key={normalizedTxHash}
            txHash={normalizedTxHash}
            chainId={tx.chainId}
            txType={tx.txType}
          />
        );
      })}
    </>
  );
};

export default Transactions;
