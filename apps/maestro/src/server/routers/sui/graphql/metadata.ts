import { suiGraphQLClient, suiQuery } from "~/lib/clients/suiClient";

const metadataQuery = (coinType: string) => suiQuery(`
query CoinMetadata {
  coinMetadata(
    coinType: "${coinType}"
  ) {
    decimals
    name
    symbol
    description
    iconUrl
    supply
  },
}
`);

export function queryMetadata(coinType: string) {
  return suiGraphQLClient.query({
    query: metadataQuery(coinType),
  });
}
