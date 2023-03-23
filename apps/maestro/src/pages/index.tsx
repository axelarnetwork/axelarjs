import { useState } from "react";

import { Button, Card, TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils.js";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useAccount, useNetwork } from "wagmi";

// import { AddErc20 } from "~/compounds";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { trpc } from "~/lib/trpc";

const AddErc20 = dynamic(() => import("../compounds/AddErc20/AddErc20"));

export default function Home() {
  const account = useAccount();
  const network = useNetwork();

  const [search, setSearch] = useState<string>("");

  const { data: interchainTokenInfo } = trpc.gmp.searchInterchainToken.useQuery(
    {
      chainId: network?.chain?.id ?? 0,
      tokenAddress: search,
    },
    {
      enabled: !!network?.chain?.id && isAddress(search),
    }
  );

  return (
    <>
      <Head>
        <title>Axelar Maestro</title>
        <meta name="description" content="Axelarjs interchain orchestration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid flex-1 place-items-center">
        {interchainTokenInfo ? (
          <Card className="bg-base-300">
            <Card.Body>
              <Card.Title>Interchain Token</Card.Title>

              <div>ADDRESS: {interchainTokenInfo?.tokenAddress}</div>
              <div>TOKEN_ID: {interchainTokenInfo?.tokenId}</div>
              <div>
                MATCHING_TOKENS: {interchainTokenInfo?.matchingTokens.length} (
                {interchainTokenInfo?.matchingTokens
                  .map(
                    (token) => token.chainName ?? `chainId: ${token.chainId}`
                  )
                  .join(", ")}
                )
              </div>
            </Card.Body>
          </Card>
        ) : (
          <>
            {account.address ? (
              <>
                <div className="flex w-full max-w-md flex-col items-center justify-center">
                  <TextInput
                    bordered
                    className="bprder-red block w-full max-w-sm"
                    placeholder="Search for and existing ERC-20 token address on Etherscan"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="divider">OR</div>
                  <AddErc20
                    trigger={
                      <Button
                        size="md"
                        className="w-full max-w-sm"
                        color="primary"
                      >
                        Deploy a new ERC-20 token
                      </Button>
                    }
                  />
                </div>
              </>
            ) : (
              <ConnectWalletButton size="md" className="w-full max-w-sm" />
            )}
          </>
        )}
      </div>
    </>
  );
}
