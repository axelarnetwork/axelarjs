import Head from "next/head";

import {
  useAssetsQuery,
  useChainConfigsQuery,
} from "~/lib/api/axelarscan/hooks";

export default function Home() {
  const { data: assets, error } = useAssetsQuery();
  const { data: chainConfigs } = useChainConfigsQuery();

  return (
    <>
      <Head>
        <title>Axelar Maestro</title>
        <meta name="description" content="Axelarjs interchain orchestration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {assets?.map((asset) => (
        <div key={asset.id}>{asset.id}</div>
      ))}

      {chainConfigs?.evm.map((chainConfig) => (
        <div key={chainConfig.id}>{chainConfig.id}</div>
      ))}

      {error && <div>{(error as Error)?.message}</div>}
    </>
  );
}
