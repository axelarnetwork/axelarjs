import type { EVMChainConfig } from "@axelarjs/api";
import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Badge, cn, Tooltip, type BadgeProps } from "@axelarjs/ui";
import { useEffect, useMemo, type FC } from "react";
import Link from "next/link";

import { useBlockNumber, useChainId, useTransaction } from "wagmi";

import { useChainInfoQuery } from "~/services/axelarjsSDK/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";

type ExtendedGMPTxStatus = GMPTxStatus | "pending";

const STATUS_LABELS: Partial<Record<ExtendedGMPTxStatus, string>> = {
  called: "Called",
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
  called: "accent",
  confirmed: "info",
  executing: "warning",
  pending: "neutral",
};

type Props = {
  txHash: `0x${string}`;
  onAllChainsExecuted?: () => void;
};

const TxFinalityProgress: FC<{ txHash: `0x${string}` }> = ({ txHash }) => {
  const chainId = useChainId();

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
        ? currentBlockNumber - txInfo.blockNumber
        : 0n,
    [currentBlockNumber, txInfo?.blockNumber]
  );

  const expectedConfirmations = BigInt(chainInfo?.blockConfirmations ?? 1);

  const progress = useMemo(
    () =>
      (elapsedBlocks / expectedConfirmations).toLocaleString(undefined, {
        style: "percent",
      }),
    [elapsedBlocks, expectedConfirmations]
  );

  if (
    !chainInfo?.blockConfirmations ||
    !txInfo?.blockNumber ||
    elapsedBlocks >= expectedConfirmations
  ) {
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
        value={elapsedBlocks.toString()}
        max={expectedConfirmations.toString()}
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
            <>
              Executed in {executed} of {total} chains
            </>
          </span>
        )}
      </div>
      <TxFinalityProgress txHash={txHash} />
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
};

export const ChainStatusItem: FC<ChainStatusItemProps> = ({
  chain,
  logIndex,
  status,
  txHash,
}) => {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <ChainIcon src={chain.image} size="md" alt={chain.name} /> {chain.name}
      </span>
      <GMPStatusIndicator txHash={`${txHash}:${logIndex}`} status={status} />
    </li>
  );
};

export type StatusIndicatorProps = {
  txHash: `0x${string}` | `0x${string}:${number}`;
  status: ExtendedGMPTxStatus;
};

export const GMPStatusIndicator: FC<StatusIndicatorProps> = ({
  txHash,
  status,
}) => {
  return (
    <Tooltip tip="View on Axelarscan" position="left">
      <Link
        href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Badge className="flex items-center">
          <Badge
            className={cn("-translate-x-1.5 text-xs", {
              "animate-pulse": !["error", "executed"].includes(status),
            })}
            variant={STATUS_COLORS[status]}
            size="xs"
            aria-label={`status: ${STATUS_LABELS[status]}`}
          />

          {STATUS_LABELS[status]}
        </Badge>
      </Link>
    </Tooltip>
  );
};
