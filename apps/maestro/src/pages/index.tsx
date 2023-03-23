import { useEffect, useState } from "react";

import { Button } from "@axelarjs/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAccount, useNetwork } from "wagmi";

import { AddErc20 } from "~/compounds";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import { SearchInterchainTokens } from "~/compounds/SearchInterchainTokens";

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
