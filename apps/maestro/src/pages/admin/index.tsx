import {
  Button,
  Card,
  CopyToClipboardButton,
  DropdownMenu,
  FormControl,
  Label,
  MinusIcon,
  PlusIcon,
  Table,
  TextInput,
  XIcon,
} from "@axelarjs/ui";
import { capitalize } from "@axelarjs/utils";
import { ChangeEvent, FC, useEffect, useState } from "react";

import { isAddress } from "viem";

import { withRouteProtection } from "~/lib/auth";
import { trpc } from "~/lib/trpc";
import { AccountStatus } from "~/services/db/kv";
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
  const [viewStatus, setViewStatus] = useState<
    "adding" | "viewing" | "editing"
  >("viewing");

  const { data: accountStatuses, refetch } =
    trpc.accounts.getAccountStatuses.useQuery();
  const { mutateAsync: setAccountStatus } =
    trpc.accounts.setAccountStatus.useMutation();

  return (
    <Card className="bg-base-200">
      <Card.Body>
        <Card.Title className="justify-between">
          <span>Account Statuses</span>
          <Button
            variant="primary"
            size="sm"
            shape="square"
            ariala-label="Add account status"
            onClick={() =>
              setViewStatus((status) =>
                status === "adding" ? "viewing" : "adding"
              )
            }
          >
            {viewStatus === "adding" ? (
              <MinusIcon className="h-4 w-4" />
            ) : (
              <PlusIcon className="h-4 w-4" />
            )}
          </Button>
        </Card.Title>
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

        {viewStatus === "adding" && (
          <AddAccountStatus
            onClose={setViewStatus.bind(null, "viewing")}
            onAdd={async (accountAddress, status) => {
              await setAccountStatus({ accountAddress, status });
              await refetch();
              setViewStatus("viewing");
            }}
          />
        )}
      </Card.Body>
    </Card>
  );
};

const STATUS_OPTIONS = ["enabled", "privileged", "disabled"] as const;

type AddAccountStatusProps = {
  onClose?: () => void;
  onAdd?: (accountAddress: `0x${string}`, status: AccountStatus) => void;
};

const AddAccountStatus: FC<AddAccountStatusProps> = ({ onClose, onAdd }) => {
  const [selectedStatus, setSelectedStatus] =
    useState<AccountStatus>("enabled");
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();

  const unselectedStatuses = STATUS_OPTIONS.filter(
    (x) => x !== selectedStatus
  ) as AccountStatus[];

  const isDisabled =
    !accountAddress || !selectedStatus || !isAddress(accountAddress);

  return (
    <Card as="form" className="bg-base-300 relative">
      <Card.Body>
        <Card.Title className="justify-between">
          <span>Add Account Status</span>
          <Button
            size="sm"
            shape="circle"
            ariala-label="Add account status"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </Card.Title>
        <div className="flex items-center gap-2">
          <FormControl className="flex-1">
            <Label>Account Adrress</Label>
            <TextInput
              placeholder="0x"
              inputSize="sm"
              value={accountAddress}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAccountAddress(e.target.value as `0x${string}`)
              }
            />
          </FormControl>
          <FormControl>
            <Label>Status</Label>
            <DropdownMenu>
              <DropdownMenu.Trigger variant="primary" size="sm">
                {capitalize(selectedStatus)}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-base-300">
                {unselectedStatuses.map((status) => (
                  <DropdownMenu.Item key={status}>
                    <a onClick={() => setSelectedStatus(status)}>
                      {capitalize(status)}
                    </a>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu>
          </FormControl>
          <FormControl>
            <Label>&nbsp;</Label>
            <Button
              variant="primary"
              size="sm"
              disabled={isDisabled}
              onClick={() => {
                if (onAdd && accountAddress) {
                  onAdd(accountAddress, selectedStatus);
                }
              }}
            >
              Save
            </Button>
          </FormControl>
        </div>
      </Card.Body>
    </Card>
  );
};
