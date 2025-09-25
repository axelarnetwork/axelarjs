import { Button, Card, InfoIcon, SpinnerIcon, Tooltip } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";

type HederaAssociationProps = {
  chainName?: string;
  isSourceChain: boolean;
  switchChainButton: ReactNode;
  tokenBalance?: string;
  isBalanceAvailable: boolean;
  isAssociated: boolean | null;
  isCheckingAssociation: boolean;
  hasAssociationError: boolean;
  isAssocSubmitting: boolean;
  onAssociate: () => Promise<void> | void;
  onDissociate: () => Promise<void> | void;
};

export const HederaAssociation: FC<HederaAssociationProps> = (props) => {
  const {
    isAssociated,
    isCheckingAssociation,
    hasAssociationError,
    isAssocSubmitting,
    onAssociate,
    onDissociate,
  } = props;

  const isBlockedByBalance =
    Boolean(isAssociated) &&
    props.tokenBalance !== undefined &&
    BigInt(props.tokenBalance) > 0n;

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [lastKnownAssociation, setLastKnownAssociation] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (props.isBalanceAvailable && props.isAssociated !== null) {
      setHasLoadedOnce(true);
      setLastKnownAssociation(props.isAssociated);
    }
  }, [props.isAssociated, props.isBalanceAvailable]);

  const displayAssociation: boolean = useMemo(() => {
    if (props.isAssociated !== null) return props.isAssociated;
    return lastKnownAssociation ?? false;
  }, [lastKnownAssociation, props.isAssociated]);

  let fieldContent: ReactNode;

  if (!props.isSourceChain) {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <div className="flex w-full items-center justify-between">
          <span>
            Switch to {props.chainName ?? "Hedera"} to manage association
          </span>
          {props.switchChainButton}
        </div>
      </div>
    );
  } else if (hasAssociationError && !isCheckingAssociation) {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <span className="text-warning">
          Error checking association. Make sure your wallet address belongs to a
          Hedera account.
        </span>
      </div>
    );
  } else if (!hasLoadedOnce) {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <span className="mx-auto">Checking association status...</span>
      </div>
    );
  } else {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            {displayAssociation ? (
              <span className="text-success">✓ Associated</span>
            ) : (
              <span className="text-error">✗ Not associated</span>
            )}
            {isCheckingAssociation && (
              <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-info" />
            )}
          </span>
          <Button
            $size="xs"
            $variant="primary"
            className="min-w-24"
            $loading={isAssocSubmitting}
            aria-disabled={isAssocSubmitting}
            disabled={isAssocSubmitting || isBlockedByBalance}
            tabIndex={isAssocSubmitting ? -1 : 0}
            onClick={async (e) => {
              e.preventDefault();
              if (isAssocSubmitting) return;
              if (displayAssociation) {
                if (props.tokenBalance === undefined) {
                  toast.error("Balance not loaded. Please try again.");
                  return;
                }
                if (BigInt(props.tokenBalance) > 0n) {
                  toast.error(
                    "Cannot dissociate while holding a balance. Balance must be 0."
                  );
                  return;
                }
                await onDissociate();
              } else await onAssociate();
            }}
          >
            {displayAssociation ? "Dissociate" : "Associate"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card.Actions className="justify-between">
        <div className="flex items-center space-x-2">
          <span>Association Status</span>
          {isBlockedByBalance && (
            <Tooltip
              tip="Cannot dissociate while holding a balance"
              $variant="info"
              $position="top"
            >
              <InfoIcon className="h-[1em] w-[1em] text-info" />
            </Tooltip>
          )}
        </div>
      </Card.Actions>
      <div className="w-full">{fieldContent}</div>
    </>
  );
};

export type { HederaAssociationProps };
