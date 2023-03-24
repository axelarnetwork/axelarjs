import { useCallback } from "react";

import { Button } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAccount, useNetwork } from "wagmi";

import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";
import SearchInterchainTokens from "~/compounds/SearchInterchainTokens";

const AddErc20 = dynamic(() => import("~/compounds/AddErc20/AddErc20"));

export default function Home() {
  const router = useRouter();
  const account = useAccount();
  const { chain } = useNetwork();

  const handleTokenFound = useCallback(
    (result: { tokenAddress: string; tokenId: string }) => {
      if (!chain) {
        return;
      }
      router.push(`/${sluggify(chain.name)}/${result?.tokenAddress}`);
    },
    [chain, router]
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
        {account.address ? (
          <>
            <div className="flex w-full max-w-lg flex-col items-center justify-center">
              <SearchInterchainTokens onTokenFound={handleTokenFound} />
              <div className="divider">OR</div>
              <AddErc20
                trigger={
                  <Button size="md" className="w-full max-w-md" color="primary">
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
