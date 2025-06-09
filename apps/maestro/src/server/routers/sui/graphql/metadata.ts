import { suiGraphQLClient, suiQuery } from "~/lib/clients/suiClient";

const metadataQuery = (coinType: string) =>
  suiQuery(`
query CoinMetadata {
  coinMetadata(
    coinType: "${coinType}"
  ) {
    decimals
    name
    symbol
  },
}
`);

export type CoinMetadata = {
  decimals: number;
  name: string;
  symbol: string;
};

export async function queryCoinMetadata(
  coinType: string
): Promise<CoinMetadata> {
  const metadata = await suiGraphQLClient
    .query({
      query: metadataQuery(coinType),
    })
    .then((result) => result.data?.coinMetadata);

  if (!metadata || !metadata.decimals || !metadata.name || !metadata.symbol) {
    throw new Error(`Coin metadata not found for ${coinType}`);
  }

  return metadata as CoinMetadata;
}
