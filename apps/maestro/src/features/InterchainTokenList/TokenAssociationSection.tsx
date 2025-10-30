import { Button, Card, InfoIcon, SpinnerIcon, Tooltip } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";

import { HEDERA_CHAIN_ID, XRPL_CHAIN_ID } from "~/config/chains";
import { useHederaTokenAssociation } from "~/features/hederaHooks";
import { useXRPLTrustLine } from "~/features/xrplHooks";

type ActiveState = {
  isAssociated: boolean | null;
  isChecking: boolean;
  hasError: boolean;
  isSubmitting: boolean;
  onAssociate: () => Promise<void> | void;
  onDissociate: () => Promise<void> | void;
};

type CopyState = {
  title: string;
  switchToManageLabel: string;
  addedLabel: string;
  missingLabel: string;
  errorCheckLabel: string;
  addButtonLabel: string;
  removeButtonLabel: string;
  cannotRemoveTooltip?: string;
};

type Ctx = {
  hedera: ReturnType<typeof useHederaTokenAssociation>;
  xrpl: ReturnType<typeof useXRPLTrustLine>;
  props: TokenAssociationSectionProps;
};

const configs: Record<
  number,
  {
    getActive: (ctx: Ctx) => ActiveState;
    getCopy: (props: TokenAssociationSectionProps) => CopyState;
  }
> = {
  [HEDERA_CHAIN_ID]: {
    getActive: ({ hedera, props }) => ({
      isAssociated: hedera.isAssociated ?? null,
      isChecking: Boolean(hedera.isCheckingAssociation),
      hasError: Boolean(hedera.hasAssociationError),
      isSubmitting: false,
      onAssociate: async () => {
        await hedera.associateHederaToken(props.tokenAddress as `0x${string}`);
        await hedera.invalidateAssociation();
      },
      onDissociate: async () => {
        await hedera.dissociateHederaToken(props.tokenAddress as `0x${string}`);
        await hedera.invalidateAssociation();
      },
    }),
    getCopy: (props) => ({
      title: "Association Status",
      switchToManageLabel: `Switch to ${props.chainName ?? "Hedera"} to manage association`,
      addedLabel: "✓ Associated",
      missingLabel: "✗ Not associated",
      errorCheckLabel: "Error checking association.",
      addButtonLabel: "Associate",
      removeButtonLabel: "Dissociate",
      cannotRemoveTooltip: "Cannot dissociate while holding a balance",
    }),
  },
  [XRPL_CHAIN_ID]: {
    getActive: ({ xrpl, props }) => ({
      isAssociated: xrpl.hasXRPLTrustLine ?? null,
      isChecking: Boolean(xrpl.isCheckingXRPLTrustLine),
      hasError: Boolean(xrpl.hasTrustLineError),
      isSubmitting:
        xrpl.createXRPLTrustLine.isPending ||
        xrpl.removeXRPLTrustLine.isPending,
      onAssociate: async () => {
        await xrpl.createXRPLTrustLine.mutateAsync({
          tokenAddress: props.tokenAddress,
        });
        await xrpl.invalidateTrustLine();
      },
      onDissociate: async () => {
        await xrpl.removeXRPLTrustLine.mutateAsync({
          tokenAddress: props.tokenAddress,
        });
        await xrpl.invalidateTrustLine();
      },
    }),
    getCopy: (props) => ({
      title: "Trust Line Status",
      switchToManageLabel: `Switch to ${props.chainName ?? "XRPL"} to manage trust line`,
      addedLabel: "✓ Trust line added",
      missingLabel: "✗ Trust line missing",
      errorCheckLabel: "Error checking trust line.",
      addButtonLabel: "Add trust line",
      removeButtonLabel: "Remove",
      cannotRemoveTooltip: "Cannot remove while holding a balance",
    }),
  },
};

type TokenAssociationSectionProps = {
  chainId: number;
  chainName?: string;
  isSourceChain: boolean;
  switchChainButton: ReactNode;
  tokenBalance?: string;
  isBalanceAvailable: boolean;
  address: string;
  tokenAddress: string;
};

export const TokenAssociationSection: FC<TokenAssociationSectionProps> = (
  props
) => {
  const hedera = useHederaTokenAssociation(
    props.tokenAddress as `0x${string}`,
    {
      enabled: props.chainId === HEDERA_CHAIN_ID && Boolean(props.address),
    }
  );
  const xrpl = useXRPLTrustLine(props.tokenAddress, {
    enabled: props.chainId === XRPL_CHAIN_ID && Boolean(props.address),
  });

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [lastKnownAssociation, setLastKnownAssociation] = useState<
    boolean | null
  >(null);

  const config = configs[props.chainId];
  const activeMaybe = config ? config.getActive({ hedera, xrpl, props }) : null;
  const copyMaybe = config ? config.getCopy(props) : null;

  useEffect(() => {
    if (!props.isBalanceAvailable) return;
    if (!config || !activeMaybe) return;
    if (activeMaybe.isAssociated !== null) {
      setHasLoadedOnce(true);
      setLastKnownAssociation(activeMaybe.isAssociated);
    }
  }, [
    config,
    activeMaybe,
    activeMaybe?.isAssociated,
    props.isBalanceAvailable,
  ]);

  const displayAssociation: boolean = useMemo(() => {
    if (activeMaybe && activeMaybe.isAssociated !== null)
      return activeMaybe.isAssociated;
    return lastKnownAssociation ?? false;
  }, [lastKnownAssociation, activeMaybe]);

  if (!config) return null;
  const active = activeMaybe!;
  const copy = copyMaybe!;

  const isBlockedByBalance =
    Boolean(active.isAssociated) &&
    props.tokenBalance !== undefined &&
    BigInt(props.tokenBalance) > 0n;

  const isBlockedByUnknownBalance =
    Boolean(active.isAssociated) && props.tokenBalance === undefined;

  let fieldContent: ReactNode;

  if (!props.isSourceChain) {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <div className="flex w-full items-center justify-between">
          <span>{copy.switchToManageLabel}</span>
          {props.switchChainButton}
        </div>
      </div>
    );
  } else if (active.hasError && !active.isChecking) {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <span className="text-warning">{copy.errorCheckLabel}</span>
      </div>
    );
  } else if (!hasLoadedOnce) {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <span className="mx-auto">Checking status...</span>
      </div>
    );
  } else {
    fieldContent = (
      <div className="flex items-center justify-between rounded-xl bg-base-300 p-2 pl-4 dark:bg-base-100">
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2">
            {displayAssociation ? (
              <span className="text-success">{copy.addedLabel}</span>
            ) : (
              <span className="text-error">{copy.missingLabel}</span>
            )}
            {active.isChecking && (
              <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-info" />
            )}
          </span>
          <Button
            $size="xs"
            $variant="primary"
            className="min-w-24"
            $loading={active.isSubmitting}
            aria-disabled={active.isSubmitting}
            disabled={
              active.isSubmitting ||
              isBlockedByBalance ||
              isBlockedByUnknownBalance ||
              props.tokenAddress === "XRP" // cannot disassociate from XRP
            }
            tabIndex={active.isSubmitting ? -1 : 0}
            onClick={async (e) => {
              e.preventDefault();
              if (active.isSubmitting) return;
              if (displayAssociation) {
                if (props.tokenBalance === undefined) {
                  toast.error("Token balance is not available");
                  return;
                }
                await active.onDissociate();
              } else await active.onAssociate();
            }}
          >
            {displayAssociation ? copy.removeButtonLabel : copy.addButtonLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card.Actions className="justify-between">
        <div className="flex items-center space-x-2">
          <span>{copy.title}</span>
          {isBlockedByBalance && copy.cannotRemoveTooltip && (
            <Tooltip
              tip={copy.cannotRemoveTooltip}
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
