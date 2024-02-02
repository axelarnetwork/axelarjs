import {
  Button,
  Card,
  CheckIcon,
  CopyToClipboardButton,
  DropdownMenu,
  EditIcon,
  FormControl,
  Label,
  MinusIcon,
  PlusIcon,
  Table,
  TextInput,
  Tooltip,
  XIcon,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { capitalize } from "@axelarjs/utils";
import { ChangeEvent, FC, useState } from "react";

import { isAddress } from "viem";

import { trpc } from "~/lib/trpc";
import { AccountStatus } from "~/services/db/kv";

type AccountStatusesViewState =
  | {
      status: "adding";
    }
  | {
      status: "viewing";
    }
  | {
      status: "editing";
      accountAddress: `0x${string}`;
    };

export const AccountStatusesManager = () => {
  const [viewState, setViewState] = useState<AccountStatusesViewState>({
    status: "viewing",
  });

  const { data: accountStatuses, refetch } =
    trpc.accounts.getAccountStatuses.useQuery(undefined, {
      suspense: true,
    });

  const { mutateAsync: setAccountStatus, isLoading: isSettingAccountStatus } =
    trpc.accounts.setAccountStatus.useMutation({
      onSuccess() {
        toast.success("Account status saved");
      },
      onError(err) {
        toast.error(err.message);
      },
    });

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
              setViewState((prev) => ({
                ...prev,
                status: prev.status === "adding" ? "viewing" : "adding",
              }))
            }
          >
            {viewState.status === "adding" ? (
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
              <Table.Column>Actions</Table.Column>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {accountStatuses?.map((entry) => {
              const isEditting =
                viewState.status === "editing" &&
                entry.accountAddress === viewState.accountAddress;
              const isMutating = isEditting && isSettingAccountStatus;

              return (
                <AccountStatusRow
                  key={entry.accountAddress}
                  status={entry.status}
                  accountAddress={entry.accountAddress}
                  disabled={entry.status === "privileged"}
                  isEditting={isEditting}
                  isMutating={isMutating}
                  onSave={async (accountAddress, status) => {
                    await setAccountStatus({ accountAddress, status });
                    await refetch();
                    setViewState({ status: "viewing" });
                  }}
                  onSelect={(accountAddress) => {
                    setViewState({
                      status: "editing",
                      accountAddress,
                    });
                  }}
                />
              );
            })}
          </Table.Body>
        </Table>

        {viewState.status === "adding" && (
          <AddAccountStatus
            onClose={setViewState.bind(null, { status: "viewing" })}
            onAdd={async (accountAddress, status) => {
              await setAccountStatus({ accountAddress, status });
              await refetch();
              setViewState({ status: "viewing" });
            }}
          />
        )}
      </Card.Body>
    </Card>
  );
};

const AccountStatusDropdown: FC<{
  selectedStatus: AccountStatus;
  onChange: (status: AccountStatus) => void;
}> = ({ selectedStatus, onChange }) => {
  const unselectedStatuses = STATUS_OPTIONS.filter(
    (x) => x !== selectedStatus
  ) as AccountStatus[];

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger variant="primary" size="sm">
        {capitalize(selectedStatus)}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-base-300 rounded-xl">
        {unselectedStatuses.map((status) => (
          <DropdownMenu.Item key={status}>
            <a onClick={onChange.bind(null, status)}>{capitalize(status)}</a>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

type AccountStatusRowProps = {
  accountAddress: `0x${string}`;
  status: AccountStatus;
  isEditting?: boolean;
  isMutating?: boolean;
  disabled: boolean;
  onSave: (accountAddress: `0x${string}`, status: AccountStatus) => void;
  onSelect: (accountAddress: `0x${string}`) => void;
};

const AccountStatusRow: FC<AccountStatusRowProps> = (props) => {
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(
    props.status
  );

  return (
    <Table.Row key={props.accountAddress}>
      <Table.Cell>
        <CopyToClipboardButton>{props.accountAddress}</CopyToClipboardButton>
      </Table.Cell>
      <Table.Cell>
        {props.isEditting ? (
          <AccountStatusDropdown
            selectedStatus={accountStatus}
            onChange={setAccountStatus}
          />
        ) : (
          capitalize(props.status)
        )}
      </Table.Cell>
      <Table.Cell>
        <Tooltip tip={`${props.isEditting ? "Save" : "Edit"} account status`}>
          <Button
            variant="primary"
            size="sm"
            shape="square"
            ariala-label="Edit account status"
            disabled={props.disabled}
            onClick={
              props.isEditting
                ? props.onSave.bind(null, props.accountAddress, accountStatus)
                : props.onSelect.bind(null, props.accountAddress)
            }
          >
            {props.isEditting ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <EditIcon className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
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

  const isDisabled =
    !accountAddress || !selectedStatus || !isAddress(accountAddress);

  return (
    <Card $as="form" className="bg-base-300 relative">
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
            <AccountStatusDropdown
              selectedStatus={selectedStatus}
              onChange={setSelectedStatus}
            />
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
