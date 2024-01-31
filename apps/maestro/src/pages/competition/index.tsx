import {
  Alert,
  Card,
  FormControl,
  Label,
  Progress,
  Table,
  Tooltip,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { intlFormatDistance } from "date-fns";

import {
  NEXT_PUBLIC_COMPETITION_END_TIMESTAMP,
  NEXT_PUBLIC_COMPETITION_START_TIMESTAMP,
} from "~/config/env";
import { trpc } from "~/lib/trpc";
import Page from "~/ui/layouts/Page";

const TROPHY_EMOJIS = ["🏆", "🥈", "🥉"];

const COMPETITION_START_TS = Date.parse(
  NEXT_PUBLIC_COMPETITION_START_TIMESTAMP
);
const COMPETITION_END_TS = Date.parse(NEXT_PUBLIC_COMPETITION_END_TIMESTAMP);

const TOP_TOKEN_COUNT = 10;

const CompetitionPage = () => {
  const [now, setNow] = useState(Date.now());
  const isEnabled = now > COMPETITION_START_TS && now < COMPETITION_END_TS;

  const { data, isLoading } = trpc.gmp.getTopTransactions.useQuery(
    {
      contractMethod: "InterchainTransfer",
      sampleSize: 220,
      minTxCount: 2,
      top: TOP_TOKEN_COUNT,
      fromTime: COMPETITION_START_TS / 1000,
      toTime: COMPETITION_END_TS / 1000,
    },
    {
      enabled: isEnabled,
    }
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const endDateDistance = intlFormatDistance(COMPETITION_END_TS, now);
  const startDateDistance = intlFormatDistance(COMPETITION_START_TS, now);

  const content = useMemo(() => {
    const hasEnded = now > COMPETITION_END_TS;
    const hasStarted = now > COMPETITION_START_TS && !hasEnded;

    if (hasEnded) {
      return (
        <Card className="grid flex-1 place-items-center">
          <Card.Body>
            <Alert status="warning" className="text-center">
              The competition has ended {endDateDistance}
            </Alert>
          </Card.Body>
        </Card>
      );
    }

    if (!hasStarted) {
      return (
        <Card className="grid flex-1 place-items-center">
          <Card.Body>
            <Alert status="info" className="text-center">
              <p className="text-lg">
                The competition starts {startDateDistance}
              </p>
            </Alert>
          </Card.Body>
        </Card>
      );
    }

    const totalTime = COMPETITION_END_TS - COMPETITION_START_TS;
    const timeElapsed = now - COMPETITION_START_TS;
    const progress = timeElapsed / totalTime;
    const progressPercent = progress.toLocaleString(undefined, {
      style: "percent",
    });

    return (
      <Card className="bg-base-200/50 no-scrollbar max-w-[95vw] overflow-scroll rounded-lg">
        <Card.Body>
          <Card.Title>
            <div className="flex-1">
              {TOP_TOKEN_COUNT} most transfered tokens
            </div>
            <Tooltip
              tip={`The competition started ${startDateDistance}. It ends ${endDateDistance}.`}
              position="left"
            >
              <FormControl>
                <Label className="w-full">
                  <span className="text-sm">({progressPercent})</span>
                </Label>
                <Progress
                  variant="accent"
                  value={timeElapsed}
                  max={totalTime}
                />
              </FormControl>
            </Tooltip>
          </Card.Title>
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
                  <Table.Cell className="text-right">
                    {item.count}
                    {index < TROPHY_EMOJIS.length && (
                      <span className="absolute translate-x-2">
                        {TROPHY_EMOJIS[index]}
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    );
  }, [data, endDateDistance, now, startDateDistance]);

  return (
    <Page
      title="Competition"
      className="flex flex-col space-y-4"
      isLoading={isLoading && isEnabled}
      loadingMessage="Loading transactions..."
    >
      <Page.Title>Interchain Leaderboard</Page.Title>
      {content}
    </Page>
  );
};

export default CompetitionPage;
