import { FC } from "react";

import {
  Alert,
  Button,
  CopyToClipboardButton,
  LinkButton,
  Modal,
} from "@axelarjs/ui";
import { maskAddress, sluggify } from "@axelarjs/utils";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import GMPTxStatusMonitor from "~/compounds/GMPTxStatusMonitor/GMPTxStatusMonitor";

import { useAddErc20StateContainer } from "../../AddErc20.state";

export const Step4: FC = () => {
  const router = useRouter();
  const { state } = useAddErc20StateContainer();
  const { chain } = useNetwork();

  return (
    <>
      <div className="grid gap-4">
        <Alert status="success">
          Token deployed and registered successfully!
        </Alert>
        <LinkButton
          color="accent"
          size="sm"
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
        <Button
          length="block"
          color="primary"
          disabled={!chain?.name || !state.deployedTokenAddress}
          onClick={() => {
            if (chain?.name) {
              router.push(
                `/${sluggify(chain?.name)}/${state.deployedTokenAddress}`
              );
            }
          }}
        >
          Go to token page!
        </Button>
      </Modal.Actions>
    </>
  );
};

export default Step4;
