import {
  Card,
  CopyToClipboardButton,
  DropdownMenu,
  FormControl,
  Label,
  Table,
  TextInput,
} from "@axelarjs/ui";
import { maskAddress, Maybe } from "@axelarjs/utils";
import { ChangeEvent, useMemo, useState } from "react";

import { trpc } from "~/lib/trpc";
import { hex64 } from "~/lib/utils/validation";

const SEARCH_BY_OPTIONS = ["token_address", "token_id"] as const;
type SearchByOption = (typeof SEARCH_BY_OPTIONS)[number];

const EXCLUDED_COLUMNS = [
  "status",
  "statusMessage",
  "name",
  "symbol",
  "decimals",
];

export const TokenRecovery = () => {
  const [searchBy, setSearchBy] = useState<SearchByOption>("token_address");
  const [searchValue, setSearchValue] = useState("");

  const isEnabled =
    searchBy === "token_id" && hex64().safeParse(searchValue).success;

  const { data, isLoading } =
    trpc.interchainToken.findInterchainTokenByTokenId.useQuery(
      {
        tokenId: searchValue,
      },
      {
        enabled: isEnabled,
      }
    );

  const columns = Maybe.of(data)
    .mapOr([], (data) => Object.keys(data[0]))
    .filter((column) => !EXCLUDED_COLUMNS.includes(column))
    .sort((a, b) => a.localeCompare(b));

  const resultSection = useMemo(() => {
    if (isLoading && isEnabled) {
      return (
        <div className="p-4 text-center">
          Scanning all chains for token {searchValue}...
        </div>
      );
    }

    if (data?.length) {
      return (
        <div className="grid">
          <Card>
            <Card.Body>
              <Card.Title>Token Info</Card.Title>
              <ul>
                {Object.entries(data[0])
                  .filter(
                    ([key, value]) =>
                      (EXCLUDED_COLUMNS.includes(key) &&
                        typeof value === "string") ||
                      typeof value === "number"
                  )
                  .map(([key, value]) => (
                    <li key={key}>
                      <span className="mr-1 font-semibold opacity-85">
                        {key}{" "}
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
              </ul>
              <div className="max-w-3xl overflow-x-scroll">
                <Table>
                  <Table.Head>
                    <Table.Row>
                      {columns.map((column) => (
                        <Table.Cell key={column}>{column}</Table.Cell>
                      ))}
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {data
                      .filter((a) => a.status === "success")
                      .map((token) => (
                        <Table.Row key={token.tokenId} className="p-2">
                          {columns
                            .map((column) => [
                              column,
                              String((token as Record<string, any>)[column]),
                            ])
                            .map(([key, value]) => (
                              <Table.Column
                                key={key}
                                className="whitespace-nowrap"
                              >
                                {typeof value === "string" &&
                                value.startsWith("0x") ? (
                                  <CopyToClipboardButton
                                    className="flex-nowrap"
                                    copyText={value}
                                  >
                                    {maskAddress(value as `0x${string}`)}
                                  </CopyToClipboardButton>
                                ) : (
                                  String(value)
                                )}
                              </Table.Column>
                            ))}
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }
  }, [columns, data, isEnabled, isLoading, searchValue]);

  return (
    <Card className="bg-base-200">
      <Card.Body>
        <Card.Title className="justify-between">
          <span>Token Recovery</span>
        </Card.Title>
        <Card $as="form" className="bg-base-300 relative">
          <Card.Body>
            <FormControl>
              <Label>
                <Label.Text>Search token by</Label.Text>
                <DropdownMenu>
                  <DropdownMenu.Trigger variant="primary" size="sm">
                    {searchBy}
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="bg-base-200 rounded-xl">
                    {SEARCH_BY_OPTIONS.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onClick={setSearchBy.bind(null, option)}
                      >
                        <a>{option}</a>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Label>
              <TextInput
                type="search"
                value={searchValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchValue(event.target.value)
                }
                placeholder={`Enter ${searchBy}`}
              />
            </FormControl>

            {resultSection}
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};
