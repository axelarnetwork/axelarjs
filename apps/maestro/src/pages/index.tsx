import { Button } from "@axelarjs/ui";
import Head from "next/head";
import tw from "tailwind-styled-components";

const Shell = tw.div`
  h-screen grid place-items-center
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Axelar Maestro</title>
        <meta name="description" content="Axelarjs interchain orchestration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell>
        <Button color="primary">Button from @axelajs/ui</Button>
      </Shell>
    </>
  );
}
