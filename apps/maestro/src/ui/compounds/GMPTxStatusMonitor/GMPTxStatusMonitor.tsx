import type { EVMChainConfig } from "@axelarjs/api";
import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Badge, cn, Tooltip, type BadgeProps } from "@axelarjs/ui";
import { useEffect, useMemo, type FC } from "react";
import Link from "next/link";

import { clamp, splitAt } from "rambda";
import { useBlockNumber, useChainId, useTransaction } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import { useChainInfoQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";

export type ExtendedGMPTxStatus = GMPTxStatus | "pending";

const STATUS_LABELS: Partial<Record<ExtendedGMPTxStatus, string>> = {
  called: "Initialized",
  approvable: "Approvable",
  approving: "Approving",
  approved: "Approved",
  executing: "Executing",
  executed: "Executed",
  confirmable: "Confirmable",
  confirmed: "Confirmed",
  confirming: "Confirming",
  error: "Error",
  insufficient_fee: "Insufficient Fee",
  pending: "Pending",
};

const STATUS_COLORS: Partial<
  Record<ExtendedGMPTxStatus, NonNullable<BadgeProps["variant"]>>
> = {
  error: "error",
  executed: "success",
  called: "warning",
  confirmed: "info",
  executing: "warning",
  pending: "neutral",
};

export function useGMPTxProgress(txHash: `0x${string}`, chainId: number) {
  const { computed } = useEVMChainConfigsQuery();
  const { data: txInfo } = useTransaction({
    hash: txHash,
    chainId,
  });

  const { data: chainInfo } = useChainInfoQuery({
    axelarChainId: computed.indexedByChainId[chainId]?.id,
  });

  const { data: currentBlockNumber } = useBlockNumber({
    chainId,
    watch: true,
    enabled: Boolean(chainInfo?.blockConfirmations && txInfo?.blockNumber),
  });

  const elapsedBlocks = useMemo(
    () =>
      currentBlockNumber && txInfo?.blockNumber
        ? Number(currentBlockNumber - txInfo.blockNumber)
        : 0,
    [currentBlockNumber, txInfo?.blockNumber]
  );

  const expectedConfirmations = Number(chainInfo?.blockConfirmations ?? 1);

  const { progress, progressRatio } = useMemo(() => {
    const ratio = elapsedBlocks / expectedConfirmations;
    const clampedRatio = clamp(0, 1, ratio);

    const progress = clampedRatio.toLocaleString(undefined, {
      style: "percent",
    });
    return {
      progress,
      progressRatio: clampedRatio * 100,
    };
  }, [elapsedBlocks, expectedConfirmations]);

  return {
    progress,
    progressRatio,
    elapsedBlocks: clamp(0, expectedConfirmations, elapsedBlocks),
    expectedConfirmations,
    isReady: Boolean(chainInfo?.blockConfirmations && txInfo?.blockNumber),
    isConfirmed: elapsedBlocks >= expectedConfirmations,
  };
}

type Props = {
  txHash: `0x${string}`;
  onAllChainsExecuted?: () => void;
};

const TxFinalityProgress: FC<{ txHash: `0x${string}`; chainId: number }> = ({
  txHash,
  chainId,
}) => {
  const { progress, elapsedBlocks, expectedConfirmations } = useGMPTxProgress(
    txHash,
    chainId
  );

  if (elapsedBlocks >= expectedConfirmations) {
    return null;
  }

  return (
    <div className="grid place-items-center gap-2 px-8">
      <span className="text-base-content-secondary text-center text-sm">
        {elapsedBlocks.toLocaleString()} of {expectedConfirmations.toString()}{" "}
        block confirmations ({progress})
      </span>
      <progress
        className="progress progress-accent w-full"
        value={elapsedBlocks}
        max={expectedConfirmations}
      />
    </div>
  );
};

const GMPTxStatusMonitor = ({ txHash, onAllChainsExecuted }: Props) => {
  const {
    data: statuses,
    computed: { chains: total, executed },
    isLoading,
  } = useGetTransactionStatusOnDestinationChainsQuery({ txHash });

  const chainId = useChainId();

  const { computed } = useEVMChainConfigsQuery();

  const statusList = Object.values(statuses ?? {});

  useEffect(() => {
    if (
      statusList.length &&
      statusList?.every((s) => s.status === "executed")
    ) {
      onAllChainsExecuted?.();
    }
  }, [statusList, onAllChainsExecuted]);

  if (!statuses || Object.keys(statuses).length === 0) {
    if (!isLoading) {
      // nothing to show
      return null;
    }
    return (
      <div className="grid place-items-center gap-4">
        <div className="flex">Loading transaction status...</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        {total > 1 && (
          <span>
            Executed in {executed} of {total} chains
          </span>
        )}
      </div>
      <TxFinalityProgress txHash={txHash} chainId={chainId} />
      <ul className="bg-base-300 rounded-box grid gap-2 p-4">
        {[...Object.entries(statuses ?? {})].map(
          ([axelarChainId, { status, logIndex }]) => {
            const chain = computed.indexedById[axelarChainId];

            return (
              <ChainStatusItem
                key={`chain-status-${axelarChainId}`}
                chain={chain}
                status={status}
                txHash={txHash}
                logIndex={logIndex}
              />
            );
          }
        )}
      </ul>
    </div>
  );
};

export default GMPTxStatusMonitor;

export type ChainStatusItemProps = {
  status: ExtendedGMPTxStatus;
  txHash: `0x${string}`;
  logIndex: number;
  chain: EVMChainConfig;
  className?: string;
  compact?: boolean;
  offset?: number;
};

export type ChainStatusItemsProps = Omit<
  ChainStatusItemProps,
  "chain" | "logIndex"
> & {
  logIndexes: number[];
  chains: EVMChainConfig[];
};

const CollapsedChains: FC<{
  chains: EVMChainConfig[];
  offset: number;
}> = ({ chains, offset }) => {
  if (chains.length > offset) {
    const collapsedChainNames = chains
      .slice(offset)
      .map((chain) => chain.name)
      .join(", ");
    return (
      <Tooltip tip={collapsedChainNames} position="left">
        <span className="bg-info text-info-content -ml-2 flex h-6 w-6 items-center justify-center rounded-full">
          +{chains.length - offset}
        </span>
      </Tooltip>
    );
  }
  return null;
};

export const CollapsedChainStatusGroup: FC<ChainStatusItemsProps> = ({
  status,
  chains,
  logIndexes,
  txHash,
  className,
  compact,
  offset = 3,
}) => {
  const [leading, trailing] = splitAt(offset, chains);

  return (
    <li className={cn("flex flex-1 items-center justify-between", className)}>
      <GMPStatusIndicator txHash={`${txHash}`} status={status} />
      <div className="flex translate-x-5 items-center">
        {leading.map((chain, i) => (
          <span key={chain.id} className="-ml-2 flex items-center">
            <Tooltip
              tip={`${chain.name} - view tx on Axelarscan`}
              position="left"
            >
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}:${logIndexes[i]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChainIcon
                  src={chain.image}
                  size={compact ? "sm" : "md"}
                  alt={chain.name}
                />
              </Link>
            </Tooltip>{" "}
          </span>
        ))}
        {trailing.length > 0 && (
          <CollapsedChains chains={chains} offset={offset} />
        )}
      </div>
    </li>
  );
};

export const ChainStatusItem: FC<ChainStatusItemProps> = ({
  chain,
  logIndex,
  status,
  txHash,
  className,
  compact,
}) => {
  return (
    <li className={cn("flex items-center justify-between", className)}>
      <span className="flex items-center gap-2">
        <Tooltip tip={chain.name}>
          <ChainIcon
            src={chain.image}
            size={compact ? "sm" : "md"}
            alt={chain.name}
          />
        </Tooltip>{" "}
        {!compact && chain.name}
      </span>
      <GMPStatusIndicator txHash={`${txHash}:${logIndex}`} status={status} />
    </li>
  );
};

export type StatusIndicatorProps = {
  txHash: `0x${string}` | `0x${string}:${number}`;
  status: ExtendedGMPTxStatus;
};

export const GMPStatusIndicator: FC<StatusIndicatorProps> = ({ status }) => {
  return (
    <div className="flex items-center text-sm">
      <Badge
        className={cn("-translate-x-1.5 text-xs", {
          "animate-pulse": !["error", "executed"].includes(status),
        })}
        variant={STATUS_COLORS[status]}
        size="xs"
        aria-label={`status: ${STATUS_LABELS[status]}`}
      />

      {STATUS_LABELS[status]}
    </div>
  );
};
