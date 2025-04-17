import { Button, cn, Loading, Tooltip } from "@axelarjs/ui";
import { useCallback, type FC } from "react";

import type { ITSEvmChainConfig, ITSVmChainConfig } from "~/server/chainConfig";
import { ChainIcon } from "~/ui/components/ChainsDropdown";

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type ChainConfig = ITSEvmChainConfig | ITSVmChainConfig;

export type ChainPickerProps = {
  eligibleChains: ChainConfig[];
  selectedChains: string[];
  erroredChains?: string[];
  onChainClick: (chainId: string) => void;
  disabled?: boolean;
  loading?: boolean;
};

const ChainPicker: FC<ChainPickerProps> = ({
  eligibleChains,
  selectedChains,
  erroredChains,
  onChainClick,
  disabled,
  loading,
}) => {
  const handleToggleAll = useCallback(() => {
    const hasPartialSelection =
      selectedChains.length > 0 &&
      selectedChains.length < eligibleChains.length;

    const unselectedChains = eligibleChains.filter(
      (chain) => !selectedChains.includes(chain.id)
    );

    if (hasPartialSelection) {
      // select the remaining chains
      unselectedChains?.forEach((chain, i) => {
        setTimeout(onChainClick.bind(null, chain.id), 16.6 * i);
      });
      return;
    }

    // toggle all tokens
    eligibleChains.forEach((chain, i) =>
      setTimeout(onChainClick.bind(null, chain.id), 16.6 * i)
    );
  }, [eligibleChains, onChainClick, selectedChains]);

  const getChainName = (chain: ChainConfig) => {
    return chain.name;
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 justify-start gap-1.5 rounded-3xl bg-base-300 p-2.5 sm:grid-cols-3 sm:gap-2">
        {eligibleChains?.map((chain) => {
          const isSelected = selectedChains.includes(chain.id);
          const chainName = getChainName(chain);

          const buttonVariant = isSelected
            ? erroredChains?.includes(chain.id)
              ? "error"
              : "success"
            : undefined;

          return (
            <Tooltip
              key={chain.chain_name}
              tip={
                buttonVariant !== "error"
                  ? `Deploy on ${chainName}`
                  : "Failed to estimate gas fees"
              }
              $variant={buttonVariant === "error" ? "warning" : undefined}
              $position="top"
            >
              <Button
                disabled={disabled || (chain.chain_type === "vm" && !chain.id)} // Add additional VM-specific conditions if needed
                className={cn(
                  "flex w-full items-center rounded-2xl hover:ring",
                  {
                    "opacity-50": chain.chain_type === "vm" && !chain.id, // Visual indicator for unsupported VM chains
                  }
                )}
                $size="sm"
                role="button"
                $variant={buttonVariant}
                onClick={onChainClick.bind(null, chain.id)}
              >
                <ChainIcon
                  src={chain.image}
                  alt={`${chainName} logo`}
                  size="md"
                  className={cn("absolute left-3 -translate-x-2", {
                    hidden: isSelected && loading,
                  })}
                />
                <Loading
                  className={cn("absolute left-3 -translate-x-2 rounded-full", {
                    hidden: !isSelected || !loading,
                  })}
                  $size="sm"
                />
                <span className="ml-4">{chainName}</span>
              </Button>
            </Tooltip>
          );
        })}
      </div>
      <div className="grid place-content-center">
        <Button
          $size="sm"
          $variant="ghost"
          onClick={handleToggleAll}
          disabled={disabled || eligibleChains.length === 0}
        >
          Toggle All
        </Button>
      </div>
    </section>
  );
};

export default ChainPicker;
