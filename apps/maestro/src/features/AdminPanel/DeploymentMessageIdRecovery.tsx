import {
  Alert,
  Button,
  Card,
  CopyToClipboardButton,
  Table,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { maskAddress } from "@axelarjs/utils";
import { useState } from "react";
import Link from "next/link";

import { trpc } from "~/lib/trpc";

export const DeploymentMessageIdRecovery = () => {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const {
    data: missingInfoTokens,
    refetch,
    isFetching,
  } = trpc.interchainToken.getInterchainTokensMissingDeploymentMessageId.useQuery();

  const { mutateAsync, isPending } =
    trpc.interchainToken.recoverDeploymentMessageIdByTokenId.useMutation();

  const handleRecover = async (tokenId: string, row: number) => {
    setActiveRow(row);
    const actionTaken = await mutateAsync({ tokenId });

    switch (actionTaken) {
      case "updated":
        toast.success("Deployment message ID recovered");
        break;
      case "deleted":
        toast.error("Token deleted");
        break;
    }

    setActiveRow(null);
    await refetch();
  };

  return (
    <Card className="bg-base-200">
      <Card.Body>
        <Card.Title>Deployment Message ID Recovery</Card.Title>
        {!isFetching && missingInfoTokens?.length === 0 && (
          <Alert status="info">
            No tokens are missing deployment message IDs
          </Alert>
        )}
        {missingInfoTokens && missingInfoTokens.length > 0 && (
          <Table>
            <Table.Head>
              <Table.Cell>Token ID</Table.Cell>
              <Table.Cell>Token Manager Type</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Head>
            <Table.Body>
              {missingInfoTokens.map((token, i) => (
                <Table.Row key={token.tokenId}>
                  <Table.Cell className="flex items-center gap-2">
                    <CopyToClipboardButton content={token.tokenId}>
                      {maskAddress(token.tokenId as `0x${string}`, {
                        segmentA: 12,
                        segmentB: 52,
                      })}
                    </CopyToClipboardButton>
                    <Link
                      href={`/interchain-tokens/${token.tokenId}`}
                      className="link"
                      target="_blank"
                    >
                      view
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{token.tokenManagerType}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isPending && activeRow === i}
                      loading={isPending && activeRow === i}
                      onClick={handleRecover.bind(null, token.tokenId, i)}
                    >
                      Recover
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};
