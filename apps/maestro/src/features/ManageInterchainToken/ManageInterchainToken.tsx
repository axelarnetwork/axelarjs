import { Modal } from "@axelarjs/ui";
import { type FC } from "react";

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
};

export const ManageInterchainToken: FC<Props> = (props) => {
  const [state, actions] = useManageInterchainTokenContainer();

  const options: Option[] = [
    {
      label: "Mint",
      value: "mint",
    },
    {
      label: "Interchain Transfer",
      value: "interchainTransfer",
    },
    {
      label: "Transfer Ownership",
      value: "transferOwnership",
    },
    {
      label: "Accept Ownership",
      value: "acceptOwnership",
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
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default withManageInterchainTokenProvider(ManageInterchainToken);
