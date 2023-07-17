import { Button, Card } from "@axelarjs/ui";
import { sluggify } from "@axelarjs/utils";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useNetwork } from "wagmi";

import SearchInterchainToken from "~/features/SearchInterchainToken";
import Page from "~/layouts/Page";

const AddErc20 = dynamic(() => import("~/features/AddErc20/AddErc20"));

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
        <Card compact className="absolute top-20 w-1/2 bg-slate-200 p-5">
          <Button shape="square" size="sm">
            x
          </Button>
          <Card.Body>
            You are using Maestro Beta in testnet. Further improvements to come.
          </Card.Body>
        </Card>
        <SearchInterchainToken onTokenFound={handleTokenFound} />
        <div className="divider">OR</div>
        <AddErc20 />
      </div>
    </Page>
  );
}
