import {
  Alert,
  Button,
  CopyToClipboardButton,
  Dialog,
  ExternalLinkIcon,
  LinkButton,
} from "@axelarjs/ui";
import { maskAddress, sluggify } from "@axelarjs/utils";
import { useState, type FC } from "react";
import { useRouter } from "next/router";

import { useNetwork } from "wagmi";

import GMPTxStatusMonitor from "~/compounds/GMPTxStatusMonitor";
import { useChainFromRoute } from "~/lib/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import { useAddErc20StateContainer } from "../../AddErc20.state";

const Review: FC = () => {
  const router = useRouter();
  const { state, actions } = useAddErc20StateContainer();
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
            <div className="flex justify-center font-semibold md:justify-start">
              Origin token deployed successfully!
            </div>
            <div className="flex items-center justify-center md:justify-start">
              Address:
              <CopyToClipboardButton
                copyText={state.txState.tokenAddress}
                size="sm"
                variant="ghost"
              >
                {maskAddress(state.txState.tokenAddress)}
              </CopyToClipboardButton>
            </div>
          </Alert>
        )}
        {(state.txState.type === "deployed" ||
          state.txState.type === "deploying") && (
          <>
            {Boolean(state.selectedChains.length) ? (
              <GMPTxStatusMonitor txHash={state.txState.txHash} />
            ) : (
              <LinkButton
                size="sm"
                href={`${chain?.blockExplorers?.default.url}/tx/${state.txState.txHash}`}
                className="flex items-center gap-2"
                target="_blank"
              >
                View transaction{" "}
                <span className="hidden md:inline">
                  {maskAddress(state.txState.txHash ?? "")}
                </span>{" "}
                on {chain?.blockExplorers?.default.name}{" "}
                <ExternalLinkIcon className="h-4 w-4" />
              </LinkButton>
            )}
          </>
        )}
      </div>
      <Dialog.Actions>
        {routeChain ? (
          // if the chain is not the same as the route, we need to refresh the page
          <Dialog.CloseAction
            length="block"
            variant="primary"
            onClick={() => {
              setShouldFetch(true);
              // refresh the page to show the new token
              router.replace(router.asPath);
            }}
          >
            View token page!
          </Dialog.CloseAction>
        ) : (
          <Button
            length="block"
            variant="primary"
            disabled={!chain?.name || state.txState.type !== "deployed"}
            onClick={() => {
              if (chain?.name && state.txState.type === "deployed") {
                router.push(
                  `/${sluggify(chain?.name)}/${state.txState.tokenAddress}`
                );

                actions.reset();
              }
            }}
          >
            Go to token page!
          </Button>
        )}
      </Dialog.Actions>
    </>
  );
};

export default Review;
