import { Button, HourglassIcon, Tooltip, XIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { Maybe } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, useRef, type FC } from "react";
import Link from "next/link";

import { groupBy } from "rambda";

import type { TxType } from "~/lib/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
  useGetTransactionType,
} from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
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

function useGroupedStatuses(txHash: `0x${string}`) {
  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash,
  });

  const { computed } = useEVMChainConfigsQuery();

  return useMemo(() => {
    const statusValues = Object.entries(statuses ?? {}).map(
      ([axelarChainId, entry]) => ({
        ...entry,
        chain: computed.indexedById[axelarChainId],
      })
    );

    const groupedStatusesProps = Object.entries(
      groupBy((x) => x.status, statusValues)
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
  }, [computed.indexedById, statuses, txHash]);
}

type ToastElementProps = {
  txHash: `0x${string}`;
  chainId: number;
  txType?: TxType;
  onRemoveTx?: (txHash: `0x${string}`) => void;
};

const ToastElement: FC<ToastElementProps> = ({
  txHash,
  chainId,
  txType,
  onRemoveTx,
}) => {
  const { elapsedBlocks, expectedConfirmations, progress } = useGMPTxProgress(
    txHash,
    chainId
  );

  const { computed } = useEVMChainConfigsQuery();
  const { data: parsedTxType } = useGetTransactionType(
    {
      txHash,
    },
    {
      // only fetch if txType is not provided
      enabled: !txType,
    }
  );

  const isLoading = !expectedConfirmations || expectedConfirmations <= 1;

  const txTypeText = Maybe.of(parsedTxType ?? txType).mapOrNull(
    (txType) => TX_LABEL_MAP[txType]
  );

  const { groupedStatusesProps, hasStatus } = useGroupedStatuses(txHash);

  const chainConfig = Maybe.of(computed.indexedByChainId[chainId]);

  const wagmiChain = useMemo(
    () => computed.wagmiChains.find((wagmiChain) => wagmiChain.id === chainId),
    [computed.wagmiChains, chainId]
  );

  const content = (
    <>
      <div className="flex items-center">
        <Tooltip
          tip={`View on ${wagmiChain?.blockExplorers?.default.name}`}
          position="left"
        >
          <Link
            href={`${wagmiChain?.blockExplorers?.default.url}/tx/${txHash}`}
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
    toast.dismiss(txHash);

    // dismiss permanently if tx status is error or insufficient_fee
    if (
      groupedStatusesProps.some(
        (x) => x.status === "error" || x.status === "insufficient_fee"
      )
    ) {
      onRemoveTx?.(txHash);
    }
  }, [groupedStatusesProps, onRemoveTx, txHash]);

  return (
    <div className="bg-base-300 border-base-200 relative grid gap-2 rounded-md p-2 pl-4 pr-8 shadow-md shadow-black/10">
      <Button
        className="absolute right-2 top-2"
        size="xs"
        shape="circle"
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
  txHash: `0x${string}`;
  chainId: number;
  txType?: keyof typeof TX_LABEL_MAP;
};

const GMPTransaction: FC<GMPTxStatusProps> = (props) => {
  const {
    computed: { chains: total, executed },
    isLoading,
  } = useGetTransactionStatusOnDestinationChainsQuery({ txHash: props.txHash });

  const [, actions] = useTransactionsContainer();

  const intervalRef = useRef<number>();

  const watchTxToCompletion = useCallback(
    async () =>
      new Promise((resolve) => {
        intervalRef.current = window.setInterval(() => {
          if (isLoading) {
            return;
          }

          if (total > 0 && executed >= total) {
            window.clearInterval(intervalRef.current);

            resolve({
              status: "success",
              executed,
              total,
            });
          }
        }, 5000);
      }),
    [executed, isLoading, total]
  );

  useEffect(() => {
    async function task(toastId: string) {
      await watchTxToCompletion();
      toast.dismiss(toastId);
      actions.removeTransaction(props.txHash);
    }

    toast.custom(
      <ToastElement {...props} onRemoveTx={actions.removeTransaction} />,
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
  }, [actions, props, watchTxToCompletion]);

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
          <GMPTransaction
            key={tx.hash}
            txHash={tx.hash}
            chainId={tx.chainId}
            txType={tx.txType}
          />
        );
      })}
    </>
  );
};

export default Transactions;
