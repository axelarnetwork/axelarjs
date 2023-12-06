import type { EVMChainConfig } from "@axelarjs/api";
import { Button, Tooltip } from "@axelarjs/ui";
import { useCallback, type FC } from "react";
import Image from "next/image";

export type ChainPickerProps = {
  eligibleChains: EVMChainConfig[];
  selectedChains: string[];
  onChainClick: (chainId: string) => void;
  disabled?: boolean;
};

const ChainPicker: FC<ChainPickerProps> = ({
  eligibleChains,
  selectedChains,
  onChainClick,
  disabled,
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

  return (
    <section className="space-y-4">
      <div className="bg-base-300 grid grid-cols-2 justify-start gap-1.5 rounded-3xl p-2.5 sm:grid-cols-3 sm:gap-2">
        {eligibleChains?.map((chain) => {
          const isSelected = selectedChains.includes(chain.id);

          return (
            <Tooltip
              tip={`Deploy on ${chain.name}`}
              key={chain.chain_name}
              position="top"
            >
              <Button
                disabled={disabled}
                className="w-full rounded-2xl hover:ring"
                size="sm"
                role="button"
                variant={isSelected ? "success" : undefined}
                onClick={onChainClick.bind(null, chain.id)}
              >
                <Image
                  className="pointer-events-none absolute left-3 -translate-x-2 rounded-full"
                  src={`${process.env.NEXT_PUBLIC_EXPLORER_URL}${chain.image}`}
                  width={24}
                  height={24}
                  alt={`${chain.name} logo`}
                />
                <span className="ml-4">{chain.name}</span>
              </Button>
            </Tooltip>
          );
        })}
      </div>
      <div className="grid place-content-center">
        <Button size="sm" variant="ghost" onClick={handleToggleAll}>
          toggle all
        </Button>
      </div>
    </section>
  );
};

export default ChainPicker;
