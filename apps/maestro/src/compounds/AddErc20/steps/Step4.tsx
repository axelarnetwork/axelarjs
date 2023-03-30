import { FC } from "react";

import { CopyToClipboardButton, Modal } from "@axelarjs/ui";

import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";

import { useAddErc20StateContainer } from "../AddErc20.state";
import { NextButton, PrevButton } from "./core";

export const Step4: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash: state.txHash,
  });

  return (
    <>
      <div>
        <div>Deploy Token Successful</div>
        txHash: {state.txHash}
        <CopyToClipboardButton copyText={state.deployedTokenAddress} />
        <ul>
          {[...Object.entries(statuses ?? {})].map(([chainId, status]) => (
            <li key={`chain-status-${chainId}`}>
              Chain: {chainId}, Status: {status}
            </li>
          ))}
        </ul>
      </div>
      <Modal.Actions>
        <PrevButton onClick={actions.decrementStep}>Select Flow</PrevButton>
        <NextButton onClick={() => {}}>Go to Token Page</NextButton>
      </Modal.Actions>
    </>
  );
};

export default Step4;
