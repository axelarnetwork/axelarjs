import { Card, Table } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import Link from "next/link";

import { trpc } from "~/lib/trpc";
import Page from "~/ui/layouts/Page";

const daysAgo = (days: number) =>
  Math.floor((Date.now() - 1000 * 60 * 60 * 24 * days) / 1000);

const CompetitionPage = () => {
  const { data, isLoading } = trpc.gmp.getTopTransactions.useQuery({
    contractMethod: "InterchainTransfer",
    sampleSize: 220,
    minTxCount: 2,
    top: 10,
    fromTime: daysAgo(14),
  });

  return (
    <Page
      title="Competition"
      className="flex flex-col space-y-4"
      isLoading={isLoading}
      loadingMessage="Loading transactions..."
    >
      <Page.Title>Interchain Leaderboard</Page.Title>

      <Card className="bg-base-200/50 no-scrollbar max-w-[95vw] overflow-scroll rounded-lg">
        <Card.Body>
          <Table zebra>
            <Table.Head>
              <Table.Column className="text-right">Rank</Table.Column>
              <Table.Column>Token Id</Table.Column>
              <Table.Column>Token Name</Table.Column>
              <Table.Column>Token Symbol</Table.Column>
              <Table.Column className="text-right">Tx Count</Table.Column>
            </Table.Head>
            <Table.Body>
              {data?.map((item, index) => (
                <Table.Row key={item.tokenId}>
                  <Table.Cell className="text-right">{index + 1}</Table.Cell>
                  <Table.Cell>
                    <Link href={`/interchain-tokens/${item.tokenId}`}>
                      {maskAddress(item.tokenId)}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.symbol}</Table.Cell>
                  <Table.Cell className="text-right">{item.count}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </Page>
  );
};

export default CompetitionPage;
