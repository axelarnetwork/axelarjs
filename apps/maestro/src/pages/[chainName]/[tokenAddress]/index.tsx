import { FC, useState } from "react";

import { Button, Card, CopyToClipboardButton, Tooltip } from "@axelarjs/ui";
import { maskAddress, Maybe, unSluggify } from "@axelarjs/utils";
import { isAddress } from "ethers/lib/utils.js";
import { useRouter } from "next/router";
import { partition, sortBy, without } from "rambda";

import { AddErc20 } from "~/compounds";
import { InterchainTokenList } from "~/compounds/InterchainTokenList";
import { SendInterchainToken } from "~/compounds/SendInterchainToken";
import Page from "~/layouts/Page";
import { useChainFromRoute } from "~/lib/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

const InterchainTokensPage = () => {
  const { chainName, tokenAddress } = useRouter().query as {
    chainName: string;
    tokenAddress: string;
  };

  const routeChain = useChainFromRoute();

  const { data: interchainToken } = useInterchainTokensQuery({
    chainId: routeChain?.id,
    tokenAddress: tokenAddress as `0x${string}`,
  });

  if (!isAddress(tokenAddress)) {
    return <div>Invalid token address</div>;
  }

  return (
    <Page
      pageTitle={`Interchain Tokens - ${unSluggify(chainName)}`}
      mustBeConnected
      className="!flex flex-col gap-12"
    >
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Interchain Token</h2>
          <div className="flex items-center">
            {interchainToken?.tokenAddress && (
              <CopyToClipboardButton
                copyText={tokenAddress}
                size="sm"
                ghost={true}
              >
                Token Address: {maskAddress(tokenAddress)}
              </CopyToClipboardButton>
            )}
            {interchainToken.tokenId && (
              <Tooltip
                tip={
                  "Token ID is an internal identifier used to correlate all instances of an ERC-20 token across all supported chains"
                }
                position="bottom"
              >
                <CopyToClipboardButton
                  copyText={interchainToken.tokenId}
                  size="sm"
                  ghost={true}
                >
                  Token ID: {maskAddress(interchainToken.tokenId)}
                </CopyToClipboardButton>{" "}
              </Tooltip>
            )}
          </div>
        </div>
      </section>
      <ConnectedInterchainTokensPage
        chainId={routeChain?.id}
        tokenAddress={tokenAddress}
      />
    </Page>
  );
};

export default InterchainTokensPage;

type ConnectedInterchainTokensPageProps = {
  chainId?: number;
  tokenAddress: `0x${string}`;
};

const ConnectedInterchainTokensPage: FC<ConnectedInterchainTokensPageProps> = (
  props
) => {
  const { data: interchainToken } = useInterchainTokensQuery({
    chainId: props.chainId,
    tokenAddress: props.tokenAddress as `0x${string}`,
  });

  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([]);

  const [registered, unregistered] = Maybe.of(
    interchainToken?.matchingTokens
  ).mapOr(
    [[], []],
    partition((x) => x.isRegistered)
  );

  return (
    <div className="flex flex-col gap-8 md:relative">
      <InterchainTokenList
        title="Registered interchain tokens"
        tokens={registered}
      />
      <InterchainTokenList
        title="Unregistered interchain tokens"
        tokens={unregistered.map((x) => ({
          ...x,
          isSelected: selectedChainIds.includes(x.chainId),
        }))}
        onToggleSelection={(chainId) => {
          setSelectedChainIds((selected) =>
            selected.includes(chainId)
              ? without([chainId], selected)
              : selected.concat(chainId)
          );
        }}
        footer={
          <div className="flex h-4 w-full justify-end p-4">
            {selectedChainIds.length > 0 ? (
              <Button color="accent">
                Deploy token on {selectedChainIds.length} additional chain
                {selectedChainIds.length > 1 ? "s" : ""}
              </Button>
            ) : undefined}
          </div>
        }
      />
    </div>
  );
};
