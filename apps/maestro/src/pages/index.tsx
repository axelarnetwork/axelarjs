import { Button, TextInput } from "@axelarjs/ui";
import Head from "next/head";
import { useAccount } from "wagmi";

import { AddErc20 } from "~/compounds";

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

      {account.address ? (
        <div className="grid flex-1 place-items-center">
          <div>
            <div>
              <TextInput placeholder="Search for and existing ERC-20 token address on Etherscan" />
            </div>
          </div>
          <AddErc20 />
        </div>
      ) : (
        <div className="grid flex-1 place-items-center">
          <Button>Connect Wallet</Button>
        </div>
      )}
    </>
  );
}
