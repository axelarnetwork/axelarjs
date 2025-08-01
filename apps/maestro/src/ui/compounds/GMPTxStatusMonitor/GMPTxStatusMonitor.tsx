import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Badge, cn, Progress, Tooltip, type BadgeProps } from "@axelarjs/ui";
import { useEffect, useMemo, type FC } from "react";
import Link from "next/link";

import { clamp, splitAt } from "rambda";
import { useBlockNumber, useTransaction } from "wagmi";

import { NEXT_PUBLIC_EXPLORER_URL } from "~/config/env";
import { ITSChainConfig } from "~/server/chainConfig";
import { useChainId } from "~/lib/hooks";
import { useChainInfoQuery } from "~/services/axelarjsSDK/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarConfigs/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/ChainsDropdown";
import { getNormalizedTwoHopChainConfig } from "~/lib/utils/chains";

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
  Record<ExtendedGMPTxStatus, NonNullable<BadgeProps["$variant"]>>
> = {
  error: "error",
  executed: "success",
  called: "warning",
  confirmed: "info",
  executing: "warning",
  pending: "neutral",
};

export function useGMPTxProgress(txHash: string, chainId: number) {
  const { combinedComputed } = useAllChainConfigsQuery();

  const { data: chainInfo } = useChainInfoQuery({
    axelarChainId: combinedComputed.indexedByChainId[chainId]?.id,
  });

  const isNonEvm = chainInfo?.id.includes("sui");

  // Make sure this supports sui as well
  const { data: txInfo } = useTransaction({
    hash: txHash as `0x${string}`,
    chainId,
    query: {
      enabled: !isNonEvm,
    },
  });

  const { data: currentBlockNumber } = useBlockNumber({
    chainId,
    watch: true,
    query: {
      enabled:
        !isNonEvm &&
        Boolean(chainInfo?.blockConfirmations && txInfo?.blockNumber),
    },
  });

  const elapsedBlocks = useMemo(() => {
    return isNonEvm
      ? 1
      : currentBlockNumber && txInfo?.blockNumber
        ? Number(currentBlockNumber - txInfo.blockNumber)
        : 0;
  }, [currentBlockNumber, isNonEvm, txInfo?.blockNumber]);

  const expectedConfirmations = useMemo(() => {
    return isNonEvm ? 1 : Number(chainInfo?.blockConfirmations ?? 1);
  }, [isNonEvm, chainInfo?.blockConfirmations]);

  const { progress, progressRatio } = useMemo(() => {
    if (isNonEvm) {
      return {
        progress: "100%",
        progressRatio: 100,
      };
    }

    const ratio = elapsedBlocks / expectedConfirmations;
    const clampedRatio = clamp(0, 1, ratio);

    const progress = clampedRatio.toLocaleString(undefined, {
      style: "percent",
    });
    return {
      progress,
      progressRatio: clampedRatio * 100,
    };
  }, [elapsedBlocks, isNonEvm, expectedConfirmations]);

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
  txHash: string;
  onAllChainsExecuted?: () => void;
};

const TxFinalityProgress: FC<{ txHash: string; chainId: number }> = ({
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
      <Progress
        $variant="accent"
        className="w-full"
        value={elapsedBlocks}
        max={expectedConfirmations}
      />
    </div>
  );
};

const GMPTxStatusMonitor = ({ txHash, onAllChainsExecuted }: Props) => {
  const chainId = useChainId();
  const { combinedComputed } = useAllChainConfigsQuery();
  const {
    data: statuses,
    computed: { chains: total, executed },
    isLoading,
  } = useGetTransactionStatusOnDestinationChainsQuery({ txHash });

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

  const showFinalityProgressBar = statusList.some(
    (chain) => chain.status === "called"
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        {total > 1 && (
          <span>
            Executed in {executed} of {total} chains
          </span>
        )}
      </div>
      {showFinalityProgressBar && (
        <TxFinalityProgress txHash={txHash} chainId={chainId} />
      )}
      <ul className="grid gap-2 rounded-box bg-base-300 p-4">
        {[...Object.entries(statuses ?? {})].map(
          ([axelarChainId, { status, logIndex }]) => {

            const chain = getNormalizedTwoHopChainConfig(
              axelarChainId,
              combinedComputed,
              chainId
            );
             
            if (!chain) {
              console.log("chain not found", axelarChainId);
              return undefined;
            }

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
  txHash: string;
  logIndex: number;
  chain: ITSChainConfig;
  className?: string;
  compact?: boolean;
  offset?: number;
};

export type ChainStatusItemsProps = Omit<
  ChainStatusItemProps,
  "chain" | "logIndex"
> & {
  logIndexes: number[];
  chains: ITSChainConfig[];
};

const CollapsedChains: FC<{
  chains: ITSChainConfig[];
  offset: number;
}> = ({ chains, offset }) => {
  if (chains.length > offset) {
    const collapsedChainNames = chains
      .slice(offset)
      .map((chain) => chain.name)
      .join(", ");
    return (
      <Tooltip tip={collapsedChainNames} $position="left">
        <span className="-ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-info text-info-content">
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
  // visibleChains are the chains that are displayed directly because they fit within the UI's visible area
  // hiddenChains are the chains that are hidden (collapsed) due to space constraints
  const [visibleChains, hiddenChains] = splitAt(offset, chains);

  return (
    <li className={cn("flex flex-1 items-center justify-between", className)}>
      <GMPStatusIndicator txHash={`${txHash}`} status={status} />
      <div className="flex translate-x-5 items-center">
        {visibleChains.map((chain, i) => (
          <span key={chain?.id || i} className="-ml-2 flex items-center">
            <Tooltip
              tip={
                chain
                  ? `${chain?.name} - view tx on Axelarscan`
                  : "View tx on Axelarscan"
              }
              $position="left"
            >
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}-${logIndexes[i]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {chain && (
                  <ChainIcon
                    src={chain.image}
                    size={compact ? "sm" : "md"}
                    alt={chain?.name || "chain"}
                  />
                )}
              </Link>
            </Tooltip>{" "}
          </span>
        ))}
        {hiddenChains.length > 0 && (
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
  const chainName = chain?.name || "chain";
  return (
    <li className={cn("flex items-center justify-between", className)}>
      <span className="flex items-center gap-2">
        <Tooltip tip={chainName}>
          <ChainIcon
            src={chain.image}
            size={compact ? "sm" : "md"}
            alt={chainName}
          />
        </Tooltip>{" "}
        {!compact && chainName}
      </span>
      <GMPStatusIndicator txHash={`${txHash}-${logIndex}`} status={status} />
    </li>
  );
};

export type StatusIndicatorProps = {
  txHash: string;
  status: ExtendedGMPTxStatus;
};

export const GMPStatusIndicator: FC<StatusIndicatorProps> = ({
  status,
  txHash,
}) => {
  return (
    <Tooltip tip="View on Axelarscan" $position="left">
      <Link
        href={`${NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center text-sm">
          <Badge
            $variant={STATUS_COLORS[status]}
            $size="xs"
            className={cn("-translate-x-1.5 text-xs", {
              "animate-pulse": !["error", "executed"].includes(status),
            })}
            aria-label={`status: ${STATUS_LABELS[status]}`}
          />

          {STATUS_LABELS[status]}
        </div>
      </Link>
    </Tooltip>
  );
};
