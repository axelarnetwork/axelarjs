import { FC } from "react";

import { Modal } from "@axelarjs/ui";

type Props = {};
export const AddErc20: FC<Props> = (props) => {
  return (
    <Modal
      triggerText="Deploy a new ERC-20 token"
      onCancelText="Back"
      onCancel={() => {}}
      onConfirmText="Next"
    />
  );
};
