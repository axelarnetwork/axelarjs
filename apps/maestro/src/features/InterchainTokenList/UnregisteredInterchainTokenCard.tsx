import { type FC } from "react";

import { Badge, Card, SpinnerIcon, Tooltip } from "@axelarjs/ui";
import clsx from "clsx";
import Link from "next/link";

import { ChainIcon } from "~/components/EVMChainsDropdown";

import type { TokenInfo } from "./types";

export type Props = TokenInfo & {
  onToggleSelection?: () => void;
};

export const UnregisteredInterchainTokenCard: FC<Props> = (props) => {
  return (
    <>
      <Card
        compact
        bordered
        onClick={!props.deploymentStatus ? props.onToggleSelection : undefined}
        className={clsx(
          "bg-base-200 dark:bg-base-300 relative overflow-hidden transition-all ease-in",
          "hover:opacity-75 hover:shadow-xl",
          {
            "cursor-pointer": props.onToggleSelection,
            "ring-primary/50 !bg-primary/25 dark:!bg-primary/10 -translate-y-1.5 ring-4":
              props.isSelected,
          }
        )}
        aria-label={
          props.onToggleSelection
            ? "click to toggle token selection"
            : undefined
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
            className={clsx(
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
          <Card.Title className="justify-between">
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
            {props.deploymentStatus && (
              <Tooltip tip="View on Axelarscan" position="left">
                <Link
                  href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${props.deploymentTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    outline
                    color="warning"
                    className="flex items-center gap-0.5"
                  >
                    <span className="-translate-x-1">
                      <SpinnerIcon className="text-info h-2.5 w-2.5 animate-spin" />
                    </span>
                    <span className="-translate-y-px">
                      {props.deploymentStatus}
                    </span>
                  </Badge>
                </Link>
              </Tooltip>
            )}
          </Card.Title>
          <div className="mx-auto">Remote token not registered</div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UnregisteredInterchainTokenCard;
