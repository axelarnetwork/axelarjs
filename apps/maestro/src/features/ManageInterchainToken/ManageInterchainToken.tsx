import { Button, Modal } from "@axelarjs/ui";
import { type FC } from "react";

import { CoinsIcon, GiftIcon, PackageCheckIcon, SendIcon } from "lucide-react";

import {
  useManageInterchainTokenContainer,
  withManageInterchainTokenProvider,
  type InterchainTokenAction,
} from "./ManageInterchaintoken.state";

type Props = {
  trigger?: JSX.Element;
  balance: bigint;
  tokenAddress: `0x${string}`;
  isTokenOwner: boolean;
  isPendingOnwer: boolean;
  hasPendingOwner: boolean;
  onClose?: () => void;
};

type Option = {
  label: string;
  value: InterchainTokenAction;
  icon: JSX.Element;
  criteria: (props: Props) => boolean;
};

export const ManageInterchainToken: FC<Props> = (props) => {
  const [state, actions] = useManageInterchainTokenContainer();

  const options: Option[] = [
    {
      label: "Mint",
      value: "mint",
      icon: <CoinsIcon />,
      criteria: (props) => props.isTokenOwner,
    },
    {
      label: "Interchain Transfer",
      value: "interchainTransfer",
      icon: <SendIcon />,
      criteria: (props) => props.balance > BigInt(0),
    },
    {
      label: "Transfer Ownership",
      value: "transferOwnership",
      icon: <GiftIcon />,
      criteria: (props) => props.isTokenOwner && !props.hasPendingOwner,
    },
    {
      label: "Accept Ownership",
      value: "acceptOwnership",
      icon: <PackageCheckIcon />,
      criteria: (props) => props.isPendingOnwer,
    },
  ];

  return (
    <Modal
      trigger={props.trigger}
      open={state.isModalOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          actions.openModal();
        } else {
          actions.closeModal();
          props.onClose?.();
        }
      }}
    >
      <Modal.Body className="flex h-96 flex-col">
        <Modal.Title className="flex">
          <span>Manage Interchain Token</span>
        </Modal.Title>
        <ul className="grid">
          {options.map((option) => (
            <li key={option.value}>
              <Button>
                {option.icon}
                <span>{option.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default withManageInterchainTokenProvider(ManageInterchainToken);
