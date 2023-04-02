import { FC } from "react";

import { CopyToClipboardButton, LinkButton, Modal } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { ExternalLink } from "lucide-react";

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
      <div className="grid gap-4">
        <div className="alert alert-success">
          Token deployed and registered successfully!
        </div>
        <LinkButton
          color="accent"
          outline
          href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${state.txHash}`}
          className="flex items-center gap-2"
          target="_blank"
        >
          View on axelarscan {maskAddress(state.txHash)}{" "}
          <ExternalLink className="h-4 w-4" />
        </LinkButton>
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
