import { FC } from "react";

import { Modal } from "@axelarjs/ui";

type Props = {};

export const AddErc20: FC<Props> = (props) => {
  return (
    <Modal triggerLabel="Add ERC-20">
      <Modal.Title>Deploy ERC-20</Modal.Title>
      <Modal.Description>Deploy a new ERC-20 token contract</Modal.Description>
      <Modal.Actions>
        <Modal.CloseAction size="sm" color="error">
          Back
        </Modal.CloseAction>
        <Modal.CloseAction size="sm" color="primary">
          Deploy
        </Modal.CloseAction>
      </Modal.Actions>
    </Modal>
  );
};
