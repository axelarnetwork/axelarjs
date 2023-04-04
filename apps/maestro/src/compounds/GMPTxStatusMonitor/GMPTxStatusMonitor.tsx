import React, { useMemo } from "react";

import { Badge, BadgeProps } from "@axelarjs/ui";
import { indexBy } from "rambda";

import { ChainIcon } from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { GMPStatus } from "~/services/gmp/types";

const STATUS_LABELS: Partial<Record<GMPStatus, string>> = {
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
  not_executed: "Not Executed",
};

const STATUS_COLORS: Partial<
  Record<GMPStatus, NonNullable<BadgeProps["color"]>>
> = {
  error: "error",
  executed: "success",
};

type Props = {
  txHash: `0x${string}`;
};

const GMPTxStatusMonitor = (props: Props) => {
  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash: props.txHash,
  });

  const { data: evmChains } = useEVMChainConfigsQuery();

  const chainsByAxelarChainId = useMemo(
    () => indexBy((c) => c.id, evmChains ?? []),
    [evmChains]
  );

  if (!statuses || Object.keys(statuses).length === 0) {
    return null;
  }

  return (
    <ul className="bg-base-300 rounded-box grid gap-2 p-4">
      {[...Object.entries(statuses ?? {})].map(([axelarChainId, status]) => {
        const chain = chainsByAxelarChainId[axelarChainId];

        return (
          <li
            key={`chain-status-${axelarChainId}`}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ChainIcon src={chain.image} size="sm" alt={chain.chain_name} />{" "}
              {chain.chain_name}
            </span>
            <Badge color={STATUS_COLORS[status]}>
              {!["error", "executed"].includes(status) && (
                <span className="-translate-x-2 animate-pulse text-xs">⚪</span>
              )}

              {STATUS_LABELS[status]}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
};

export default GMPTxStatusMonitor;
