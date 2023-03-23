import { useEffect, useState } from "react";

import { Button, TextInput } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { isAddress } from "ethers/lib/utils.js";
import Head from "next/head";
import { useRouter } from "next/router";
import { prop, uniq } from "rambda";
import { useAccount, useNetwork } from "wagmi";

import { AddErc20 } from "~/compounds";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

function useInterchainTokensQuery(input: {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  chainIds?: number[];
}) {
  const { data: evmChains, computed } = useEVMChainConfigsQuery();

  const uniqueChainsIDs = uniq(evmChains?.map?.((x) => x.chain_id) ?? []);

  const { data, ...queryResult } = trpc.gmp.searchInterchainToken.useQuery(
    {
      chainId: Number(input.chainId),
      tokenAddress: String(input.tokenAddress),
      chainIds: input.chainIds ?? uniqueChainsIDs,
    },
    {
      enabled:
        Boolean(input.chainId) &&
        isAddress(input.tokenAddress ?? "") &&
        Boolean(input.chainIds?.length || uniqueChainsIDs.length),
    }
  );

  return {
    ...queryResult,
    data: {
      ...data,
      matchingTokens: data?.matchingTokens.map((token) => ({
        ...token,
        chain: computed.indexedByChainId[token.chainId],
      })),
    },
  };
}

type SearchInterchainTokens = {
  onTokenFound: (tookenId: string) => void;
};

const SearchInterchainTokens = (props: SearchInterchainTokens) => {
  const [search, setSearch] = useState<string>("");

  const { chain } = useNetwork();

  const { data } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: search as `0x${string}`,
  });

  useEffect(() => {
    console.log({
      data,
    });
    if (data?.matchingTokens?.length) {
      props.onTokenFound(data.matchingTokens[0].tokenId);
    }
  }, [data.matchingTokens, data.matchingTokens?.length, props]);

  return (
    <TextInput
      bordered
      className="bprder-red block w-full max-w-sm"
      placeholder={`Search for ERC-20 token address on ${chain?.name}`}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const account = useAccount();
  const { chain } = useNetwork();
  const [tokenId, setTokenId] = useState("");

  useEffect(() => {
    if (tokenId) {
      router.push(`/${chain?.id}/${tokenId}`);
    }
  }, [tokenId, router, chain?.id]);

  return (
    <>
      <Head>
        <title>Axelar Maestro</title>
        <meta name="description" content="Axelarjs interchain orchestration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid flex-1 place-items-center">
        {account.address ? (
          <>
            <div className="flex w-full max-w-md flex-col items-center justify-center">
              <SearchInterchainTokens
                onTokenFound={(tokenId) => {
                  setTokenId(tokenId);
                }}
              />
              <div className="divider">OR</div>
              <AddErc20
                trigger={
                  <Button size="md" className="w-full max-w-sm" color="primary">
                    Deploy a new ERC-20 token
                  </Button>
                }
              />
            </div>
          </>
        ) : (
          <ConnectWalletButton size="md" className="w-full max-w-sm" />
        )}
      </div>
    </>
  );
}
