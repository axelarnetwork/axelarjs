import { FC, useState } from "react";

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
import { useChainFromRoute } from "~/lib/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

import { useAddErc20StateContainer } from "../../AddErc20.state";

const Review: FC = () => {
  const router = useRouter();
  const { state } = useAddErc20StateContainer();
  const { chain } = useNetwork();
  const routeChain = useChainFromRoute();

  const [shouldFetch, setShouldFetch] = useState(false);

  useInterchainTokensQuery(
    shouldFetch && routeChain?.id && state.txState.type === "deployed"
      ? {
          chainId: routeChain.id,
          tokenAddress: state.txState.tokenAddress,
        }
      : {}
  );

  return (
    <>
      <div className="grid gap-4">
        {state.txState.type === "deployed" && (
          <Alert status="success">
            <div>Token deployed and registered successfully!</div>
            <div className="flex items-center">
              Address:
              <CopyToClipboardButton
                copyText={state.txState.tokenAddress}
                size="sm"
                ghost
              >
                {maskAddress(state.txState.tokenAddress)}
              </CopyToClipboardButton>
            </div>
          </Alert>
        )}
        {(state.txState.type === "deployed" ||
          state.txState.type === "deploying") && (
          <>
            <LinkButton
              size="sm"
              href={`${chain?.blockExplorers?.default.url}/tx/${state.txState.txHash}`}
              className="flex items-center gap-2"
              target="_blank"
            >
              View transaction {maskAddress(state.txState.txHash ?? "")} on{" "}
              {chain?.blockExplorers?.default.name}{" "}
              <ExternalLink className="h-4 w-4" />
            </LinkButton>
            <GMPTxStatusMonitor txHash={state.txState.txHash} />
          </>
        )}
      </div>
      <Modal.Actions>
        {routeChain ? (
          // if the chain is not the same as the route, we need to refresh the page
          <Modal.CloseAction
            length="block"
            color="primary"
            onClick={() => {
              setShouldFetch(true);
              // refresh the page to show the new token
              router.replace(router.asPath);
            }}
          >
            View token page!
          </Modal.CloseAction>
        ) : (
          <Button
            length="block"
            color="primary"
            disabled={!chain?.name || state.txState.type !== "deployed"}
            onClick={() => {
              if (chain?.name && state.txState.type === "deployed") {
                router.push(
                  `/${sluggify(chain?.name)}/${state.txState.tokenAddress}`
                );
              }
            }}
          >
            Go to token page!
          </Button>
        )}
      </Modal.Actions>
    </>
  );
};

export default Review;
