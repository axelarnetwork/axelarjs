import { Button, TextInput } from "@axelarjs/ui";
import Head from "next/head";
import { useAccount } from "wagmi";

import { AddErc20 } from "~/compounds";
import ConnectWalletButton from "~/compounds/ConnectWalletButton/ConnectWalletButton";

export default function Home() {
  const account = useAccount();

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
              <TextInput
                bordered
                className="bprder-red block w-full max-w-sm"
                placeholder="Search for and existing ERC-20 token address on Etherscan"
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
