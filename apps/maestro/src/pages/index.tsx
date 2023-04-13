import { useCallback } from "react";

import { Button } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import SearchInterchainTokens from "~/compounds/SearchInterchainTokens";
import Page from "~/layouts/Page";

const AddErc20 = dynamic(() => import("~/compounds/AddErc20/AddErc20"));

export default function Home() {
  const router = useRouter();
  const { chain } = useNetwork();

  const handleTokenFound = useCallback(
    (result: { tokenAddress: string; tokenId?: string }) => {
      if (!chain) {
        return;
      }
      router.push(`/${sluggify(chain.name)}/${result?.tokenAddress}`);
    },
    [chain, router]
  );

  return (
    <Page
      pageTitle="Axelar Maestro"
      pageDescription="Interchain orchestration powered by Axelar"
      className="place-items-center"
      mustBeConnected
    >
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
    </Page>
  );
}
