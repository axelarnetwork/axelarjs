import { FC } from "react";

import { CopyToClipboardButton, LinkButton, Modal } from "@axelarjs/ui";
import { maskAddress, sluggify } from "@axelarjs/utils";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import GMPTxStatusMonitor from "~/compounds/GMPTxStatusMonitor/GMPTxStatusMonitor";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";

import { useAddErc20StateContainer } from "../AddErc20.state";
import { NextButton, PrevButton } from "./core";

export const Step4: FC = () => {
  const router = useRouter();
  const { state, actions } = useAddErc20StateContainer();
  const { chain } = useNetwork();

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
          View on axelarscan {maskAddress(state.txHash ?? "")}{" "}
          <ExternalLink className="h-4 w-4" />
        </LinkButton>
        <CopyToClipboardButton copyText={state.deployedTokenAddress} />

        <GMPTxStatusMonitor txHash={state.txHash} />
      </div>
      <Modal.Actions>
        <PrevButton onClick={actions.decrementStep}>Select Flow</PrevButton>
        <NextButton
          disabled={!chain?.name || !state.deployedTokenAddress}
          onClick={() => {
            if (chain?.name) {
              router.push(
                `/${sluggify(chain?.name)}/${state.deployedTokenAddress}`
              );
            }
          }}
        >
          Go to Token Page
        </NextButton>
      </Modal.Actions>
    </>
  );
};

export default Step4;
