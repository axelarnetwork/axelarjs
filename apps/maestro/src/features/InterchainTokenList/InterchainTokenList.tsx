import { Button, cn } from "@axelarjs/ui";
import { useMemo, type FC, type ReactNode } from "react";

import RegisteredInterchainTokenCard from "./RegisteredInterchainTokenCard";
import type { TokenInfo } from "./types";
import UnregisteredInterchainTokenCard from "./UnregisteredInterchainTokenCard";

export type InterchainTokenListProps = {
  title: ReactNode;
  tokens: TokenInfo[];
  onToggleSelection?: (chainId: number) => void;
  footer?: ReactNode;
  listClassName?: string;
  itemClassName?: string;
};

export const InterchainTokenList: FC<InterchainTokenListProps> = (props) => {
  const tokens = useMemo(
    () =>
      props.tokens
        .filter((x) => x.chain)
        .sort((a, b) =>
          // sort by origin token ascending
          a?.isOriginToken ? -1 : b?.isOriginToken ? 1 : 0
        ),
    [props.tokens]
  );

  if (!tokens.length) {
    return null;
  }

  const selectedTokens = tokens.filter((x) => x.isSelected);

  const originToken = tokens.find((x) => x.isOriginToken);

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between gap-2 text-2xl">
        <div className="flex items-center gap-2">
          <span className="font-bold">{props.title}</span>
          <span className="font-mono text-xl opacity-50">
            ({tokens.length})
          </span>
        </div>
        {tokens.length > 0 && Boolean(props.onToggleSelection) && (
          <Button
            size="sm"
            variant="primary"
            disabled={Boolean(
              // disable if all tokens are selected or none are selected
              selectedTokens.length && selectedTokens.length !== tokens.length
            )}
            onClick={() => {
              tokens?.forEach((token, i) => {
                setTimeout(() => {
                  props.onToggleSelection?.(token.chainId);
                }, i * 25);
              });
            }}
          >
            Toggle All
          </Button>
        )}
      </header>
      <main>
        <ul
          className={cn(
            "grid w-full gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5",
            props.listClassName
          )}
        >
          {tokens.map((token) =>
            token.isRegistered ? (
              <RegisteredInterchainTokenCard
                key={token.chainId}
                {...token}
                hasRemoteTokens={tokens.length > 1}
                originTokenAddress={originToken?.tokenAddress}
                originTokenChainId={originToken?.chainId}
              />
            ) : (
              <UnregisteredInterchainTokenCard
                key={token.chainId}
                onToggleSelection={props.onToggleSelection?.bind(
                  null,
                  token.chainId
                )}
                {...token}
              />
            )
          )}
        </ul>
      </main>
      {props.footer && <footer>{props.footer}</footer>}
    </section>
  );
};
