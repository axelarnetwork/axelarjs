import {
  Alert,
  Card,
  cn,
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
import type { GetTopTransactionsOutput } from "~/server/routers/gmp/getTopTransactions";
import { InterchainBanner } from "~/ui/components/InterchainBanner";
import Page from "~/ui/layouts/Page";

const PRIZES = [
  { place: "1st", amount: 10101 },
  { place: "2nd", amount: 6900 },
  { place: "3rd", amount: 4200 },
];

const TROPHY_EMOJIS = ["🏆", "🥈", "🥉"];

const COMPETITION_START_TS = Date.parse(
  NEXT_PUBLIC_COMPETITION_START_TIMESTAMP
);
const COMPETITION_END_TS = Date.parse(NEXT_PUBLIC_COMPETITION_END_TIMESTAMP);

const TOP_TOKEN_COUNT = 10;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const NUMBERS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const getShortTime = (date: Date) => {
  const h = date.getUTCHours();
  return h > 12 ? `${h - 12}pm` : `${h}am`;
};

const getDateMeta = (imestamp: number) => {
  const date = new Date(imestamp);
  const month = MONTHS[date.getUTCMonth()];

  return {
    month,
    day: `${month} ${date.getUTCDate()}`,
    time: getShortTime(date),
  };
};

const CompetitionPage = () => {
  const [now, setNow] = useState(Date.now());

  const { data, isLoading } = trpc.gmp.getTopTransactions.useQuery(
    {
      minTxCount: 1,
      top: TOP_TOKEN_COUNT,
      fromTime: COMPETITION_START_TS / 1000,
      toTime: COMPETITION_END_TS / 1000,
    },
    {
      enabled: true,
    }
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const endDateDistance = intlFormatDistance(COMPETITION_END_TS, now);
  const startDateDistance = intlFormatDistance(COMPETITION_START_TS, now);

  const content = useMemo(() => {
    const totalTime = COMPETITION_END_TS - COMPETITION_START_TS;
    const timeElapsed = now - COMPETITION_START_TS;
    const progress = timeElapsed / totalTime;
    const progressPercent = progress.toLocaleString(undefined, {
      style: "percent",
    });

    return (
      <Card className="bg-base-200/95 no-scrollbar max-w-[95vw] overflow-scroll rounded-lg">
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
                <RowItem key={item.tokenId} {...{ item, index }} />
              ))}
            </Table.Body>
          </Table>
          <span className="text-xs italic">Source: Axelarscan</span>
        </Card.Body>
      </Card>
    );
  }, [data, endDateDistance, now, startDateDistance]);

  const compStart = getDateMeta(COMPETITION_END_TS);
  const compEnd = getDateMeta(COMPETITION_START_TS);

  const durationInWeeks = Math.floor(
    (COMPETITION_END_TS - COMPETITION_START_TS) / (1000 * 60 * 60 * 24 * 7)
  );

  return (
    <Page
      title="Competition"
      contentClassName="flex flex-col space-y-4"
      isLoading={isLoading}
      loadingMessage="Loading transactions..."
      className="bg-cover bg-fixed bg-center bg-no-repeat pb-16"
    >
      <Page.Title>Interchain Leaderboard</Page.Title>
      <Card className="bg-base-200/95">
        <Card.Body className="spcae-y-4 xl:space-y-8">
          <InterchainBanner />
          <Card.Title>
            Welcome to the ITS Legend Interchain Competition!
          </Card.Title>
          <div className="prose">
            <p>
              To celebrate the mainnet launch of Interchain Token Service,
              Axelar Foundation is launching the ITS Legend of Interchain
              Competition!
            </p>
            <ul className="list-inside list-none">
              <li>
                <strong className="text-primary">Objective:</strong> Mint new
                Interchain Tokens and attain as many transactions as possible
                with them.
              </li>
              <li>
                <strong className="text-primary">Duration:</strong> The
                competition starts {compEnd.time} UTC on {compEnd.day} and has
                been extended to conclude at {compStart.time} UTC on{" "}
                {compStart.day}, spanning a thrilling{" "}
                {NUMBERS[durationInWeeks - 1]} week
                {durationInWeeks > 1 && "s"}.
              </li>
              <li>
                <strong className="text-primary">Prizes:</strong> The top three
                projects with the highest transaction counts attained before{" "}
                {compStart.time} UTC on {compStart.day} will be awarded with AXL
                tokens:
                <ul className="max-w-56">
                  {PRIZES.map(({ place, amount }, i) => (
                    <li
                      key={place}
                      className={cn("pl-4", {
                        "list-['🏆']": i === 0,
                        "list-['🥈']": i === 1,
                        "list-['🥉']": i === 2,
                      })}
                    >
                      <div className="flex items-center justify-between">
                        <strong>{place} Place</strong>
                        <div>{amount.toLocaleString()} AXL</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <strong className="text-primary">Eligibility:</strong> Only
                tokens minted after the competition starts are eligible.
              </li>
            </ul>
            <Alert className="prose-sm bg-base-100">
              By participating in this competition, you understand that you may
              spend tokens of value for fees (e.g. gas fees) for which you will
              not be reimbursed. All winners acknowledge and agree that: (i) the
              award of each prize is subject to the satisfaction of Axelar
              Foundation’s KYC process, (ii) each winner may be required to
              enter into further terms and conditions with the Axelar
              Foundation, and (iii) to comply with regulations, each prize of
              AXL may be substituted with another token or fiat of equivalent
              value.
            </Alert>
          </div>
        </Card.Body>
      </Card>
      {content}
    </Page>
  );
};

const RowItem = (props: {
  item: GetTopTransactionsOutput[number];
  index: number;
}) => (
  <Table.Row key={props.item.tokenId}>
    <Table.Cell className="text-right">{props.index + 1}</Table.Cell>
    <Table.Cell>
      <Link href={`/interchain-tokens/${props.item.tokenId}`}>
        {maskAddress(props.item.tokenId)}
      </Link>
    </Table.Cell>
    <Table.Cell>{props.item.name}</Table.Cell>
    <Table.Cell>{props.item.symbol}</Table.Cell>
    <Table.Cell className="text-right">
      {props.item.count}
      {props.index < TROPHY_EMOJIS.length && (
        <span className="absolute translate-x-2">
          {TROPHY_EMOJIS[props.index]}
        </span>
      )}
    </Table.Cell>
  </Table.Row>
);

export default CompetitionPage;
