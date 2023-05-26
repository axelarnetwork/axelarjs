import React, { useEffect, useMemo } from "react";

import type { GMPTxStatus } from "@axelarjs/api/gmp";
import { Badge, Tooltip, type BadgeProps } from "@axelarjs/ui";
import clsx from "clsx";
import Link from "next/link";
import { indexBy } from "rambda";

import AxelarscanLink from "~/components/AxelarsscanLink/AxelarscanLink";
import { ChainIcon } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";

const STATUS_LABELS: Partial<Record<GMPTxStatus, string>> = {
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
};

const STATUS_COLORS: Partial<
  Record<GMPTxStatus, NonNullable<BadgeProps["color"]>>
> = {
  error: "error",
  executed: "success",
  called: "accent",
  confirmed: "info",
  executing: "warning",
};

type Props = {
  txHash: `0x${string}`;
  onAllChainsExecuted?: () => void;
};

const GMPTxStatusMonitor = ({ txHash, onAllChainsExecuted }: Props) => {
  const {
    data: statuses,
    computed: { chains: total, executed },
    isLoading,
  } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash: txHash,
  });

  const { data: evmChains } = useEVMChainConfigsQuery();

  const chainsByAxelarChainId = useMemo(
    () => indexBy((c) => c.id, evmChains ?? []),
    [evmChains]
  );

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
    if (isLoading) {
      return (
        <div className="grid place-items-center gap-4">
          <div className="flex">Loading transaction status...</div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <span>
          {total > 1 && (
            <>
              Executed in {executed} of {total} chains
            </>
          )}
        </span>
        <AxelarscanLink txHash={txHash} />
      </div>
      <ul className="bg-base-300 rounded-box grid gap-2 p-4">
        {[...Object.entries(statuses ?? {})].map(
          ([axelarChainId, { status, logIndex }]) => {
            const chain = chainsByAxelarChainId[axelarChainId];

            return (
              <li
                key={`chain-status-${axelarChainId}`}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ChainIcon
                    src={chain.image}
                    size="md"
                    alt={chain.chain_name}
                  />{" "}
                  {chain.chain_name}
                </span>
                <Tooltip tip="View on Axelarscan" position="left">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}:${logIndex}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Badge className="flex items-center">
                      <Badge
                        className={clsx("-translate-x-1.5 text-xs", {
                          "animate-pulse": !["error", "executed"].includes(
                            status
                          ),
                        })}
                        color={STATUS_COLORS[status]}
                        size="xs"
                        aria-label={`status: ${STATUS_LABELS[status]}`}
                      />

                      {STATUS_LABELS[status]}
                    </Badge>
                  </Link>
                </Tooltip>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

export default GMPTxStatusMonitor;
