import { FC, useState } from "react";

import { Modal } from "@axelarjs/ui";

type Props = {};
export const AddErc20: FC<Props> = (props) => {
  const [userStep, setUserStep] = useState(1);
  return (
    <Modal
      triggerText="Deploy a new ERC-20 token"
      onCancelText="Back"
      onCancel={() => {}}
      onConfirmText="Close"
      cb={() => setUserStep(userStep + 1)}
    />
  );
};
