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
  isTokenPendingOnwer: boolean;
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
      icon: <CoinsIcon className="h-7 w-7 md:h-8 md:w-8" />,
      criteria: (props) => props.isTokenOwner,
    },
    {
      label: "Interchain Transfer",
      value: "interchainTransfer",
      icon: <SendIcon className="h-7 w-7 md:h-8 md:w-8" />,
      criteria: (props) => props.balance > BigInt(0),
    },
    {
      label: "Transfer Ownership",
      value: "transferOwnership",
      icon: <GiftIcon className="h-7 w-7 md:h-8 md:w-8" />,
      criteria: (props) => props.isTokenOwner && !props.hasPendingOwner,
    },
    {
      label: "Accept Ownership",
      value: "acceptOwnership",
      icon: <PackageCheckIcon className="h-7 w-7 md:h-8 md:w-8" />,
      criteria: (props) => props.isTokenPendingOnwer,
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
      <Modal.Body className="flex flex-col gap-4">
        <Modal.Title className="flex">
          <span>Manage Interchain Token</span>
        </Modal.Title>
        <ul className="grid grid-cols-2 gap-2">
          {options
            .filter((option) => option.criteria(props))
            .map((option) => (
              <li key={option.value}>
                <Button className="grid h-24 w-full place-items-center gap-2.5 p-3 md:h-32">
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
