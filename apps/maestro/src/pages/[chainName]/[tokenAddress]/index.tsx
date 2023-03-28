import { FC, useState } from "react";

import { Button, Card, CopyToClipboardButton, Tooltip } from "@axelarjs/ui";
import { Maybe, unSluggify } from "@axelarjs/utils";
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
      className="flex flex-col gap-4"
    >
      <Card className="bg-base-300">
        <Card.Body>
          <Card.Title>Interchain Token</Card.Title>
          <div className="flex items-center gap-2">
            Interchain Token Home Address{" "}
            <CopyToClipboardButton
              copyText={tokenAddress}
              size="sm"
              ghost={true}
            >
              {tokenAddress}
            </CopyToClipboardButton>{" "}
          </div>
          <div className="flex items-center gap-2">
            Token ID{" "}
            <Tooltip
              className="z-20"
              tip={
                "The Token ID is an internal identifier used to correlate all instances of an ERC-20 token across all supported chains" ||
                ""
              }
            >
              <CopyToClipboardButton
                copyText={interchainToken.tokenId}
                size="sm"
                ghost={true}
              >
                {interchainToken.tokenId}
              </CopyToClipboardButton>{" "}
            </Tooltip>
          </div>
          <Card.Actions>
            <AddErc20
              trigger={
                <Button size="sm" className="max-w-sm">
                  Deploy on other chains
                </Button>
              }
              tokenAddress={tokenAddress}
            />
            <SendInterchainToken
              trigger={
                <Button size="sm" className="ml-2 max-w-sm">
                  Send token interchain [WIP]
                </Button>
              }
              tokenAddress={tokenAddress}
              tokenId={interchainToken.tokenId as `0x${string}`}
            />
          </Card.Actions>
        </Card.Body>
      </Card>
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
      />
      {selectedChainIds.length > 0 && (
        <div className="bottom-0 flex w-full justify-end p-4 md:absolute">
          <Button color="accent">
            Deploy on selected chains ({selectedChainIds.length})
          </Button>
        </div>
      )}
    </div>
  );
};
