import { Button, Card, CopyToClipboardButton, Table } from "@axelarjs/ui";
import { useEffect, useState } from "react";

import { withRouteProtection } from "~/lib/auth";
import { trpc } from "~/lib/trpc";
import Page from "~/ui/layouts/Page";

const AdminIndexPage = () => {
  return (
    <Page title="Admin" className="flex flex-1 flex-col gap-4" mustBeConnected>
      <Page.Title>Admin Panel</Page.Title>
      <Page.Content className="gap-4">
        <GlobalMessageManager />
        <AccountStatuses />
      </Page.Content>
    </Page>
  );
};

export default withRouteProtection(AdminIndexPage, {
  redirectTo: "/",
  accountStatuses: ["privileged"],
});

const GlobalMessageManager = () => {
  const { data: globalMessage } = trpc.messages.getGlobalMessage.useQuery();
  const { mutateAsync: saveGlobalMessage, isLoading: isSavingGlobalMessage } =
    trpc.messages.setGlobalMessage.useMutation();

  const [newMessage, setNewMessage] = useState(globalMessage?.content || "");

  useEffect(() => {
    setNewMessage(globalMessage?.content || "");
  }, [globalMessage]);

  return (
    <Card className="bg-base-200">
      <Card.Body>
        <Card.Title>Global Message</Card.Title>
        <textarea
          className="textarea"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <Card.Actions className="justify-end">
          <Button
            loading={isSavingGlobalMessage}
            variant="primary"
            onClick={async () => {
              if (globalMessage) {
                await saveGlobalMessage({
                  ...globalMessage,
                  content: newMessage,
                });
              }
            }}
          >
            Save global message
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};

const AccountStatuses = () => {
  const { data: accountStatuses } = trpc.accounts.getAccountStatuses.useQuery();
  return (
    <Card className="bg-base-200">
      <Card.Body>
        <Card.Title>Account Statuses</Card.Title>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Column>Address</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {accountStatuses?.map((entry) => (
              <Table.Row key={entry.accountAddress}>
                <Table.Cell>
                  <CopyToClipboardButton>
                    {entry.accountAddress}
                  </CopyToClipboardButton>
                </Table.Cell>
                <Table.Cell>{entry.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Body>
    </Card>
  );
};
