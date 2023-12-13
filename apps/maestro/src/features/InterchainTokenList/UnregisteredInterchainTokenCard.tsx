import { Card, cn, Indicator } from "@axelarjs/ui";
import { type FC } from "react";

import { ChainIcon } from "~/ui/components/EVMChainsDropdown";
import { GMPStatusIndicator } from "~/ui/compounds/GMPTxStatusMonitor";
import type { TokenInfo } from "./types";

export type Props = TokenInfo & {
  onToggleSelection?: () => void;
  className?: string;
};

export const UnregisteredInterchainTokenCard: FC<Props> = (props) => {
  return (
    <Card
      compact
      bordered
      onClick={!props.deploymentStatus ? props.onToggleSelection : undefined}
      className={cn(
        "bg-base-200 dark:bg-base-300 overflow-hidden transition-all ease-in",
        "hover:opacity-75 hover:shadow-xl",
        {
          "cursor-pointer": props.onToggleSelection,
          "ring-primary/50 !bg-primary/25 dark:!bg-primary/10 -translate-y-1.5 ring-4":
            props.isSelected,
        },
        props.className
      )}
      aria-label={
        props.onToggleSelection ? "click to toggle token selection" : undefined
      }
      aria-selected={props.isSelected}
      $as={
        props.onToggleSelection && !props.deploymentStatus
          ? "button"
          : undefined
      }
      role={props.onToggleSelection ? "switch" : undefined}
    >
      {props.onToggleSelection && (
        <div
          style={{
            backgroundImage: `url(${props.chain?.image})`,
          }}
          className={cn(
            "absolute inset-0 scale-100 bg-cover opacity-0 blur-3xl transition-all duration-300",
            "bg-center delay-150 hover:scale-150 hover:opacity-20",
            {
              "scale-125 opacity-25 hover:scale-150 hover:blur-sm":
                props.isSelected,
            }
          )}
        />
      )}
      <Card.Body className="w-full">
        <Indicator className="w-full">
          <Card.Title className="flex-wrap justify-center md:justify-between">
            {props.chain && (
              <span className="flex items-center gap-2">
                <ChainIcon
                  src={props.chain.image}
                  alt={props.chain.name}
                  size="md"
                />
                {props.chain.name}
              </span>
            )}
            {props.deploymentStatus && props.deploymentTxHash && (
              <Indicator.Item
                $as="div"
                className="-translate-y-2 translate-x-0"
              >
                <GMPStatusIndicator
                  txHash={props.deploymentTxHash}
                  status={props.deploymentStatus}
                />
              </Indicator.Item>
            )}
          </Card.Title>
        </Indicator>
        <div className="mx-auto">Remote token not registered</div>
      </Card.Body>
    </Card>
  );
};

export default UnregisteredInterchainTokenCard;
