import {
  Alert,
  Button,
  CopyToClipboardButton,
  Dialog,
  ExternalLinkIcon,
  LinkButton,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useState, type FC } from "react";
import { useRouter } from "next/router";

import { useNetwork } from "wagmi";

import { useChainFromRoute } from "~/lib/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import GMPTxStatusMonitor from "~/ui/compounds/GMPTxStatusMonitor";
import { getInterchainTokenDetailsPageSessionStorageKey } from "~/ui/pages/InterchainTokenDetailsPage/ConnectedInterchainTokensPage";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";

function setRemoteTokenDeploymentTxHash(
  tokenAddress: `0x${string}`,
  chainId: number,
  deployTokensTxHash: `0x${string}`,
  selectedChainIds: number[]
) {
  sessionStorage.setItem(
    getInterchainTokenDetailsPageSessionStorageKey({ tokenAddress, chainId }),
    JSON.stringify({
      deployTokensTxHash,
      selectedChainIds,
    })
  );
}

const Review: FC = () => {
  const router = useRouter();
  const { state, actions } = useInterchainTokenDeploymentStateContainer();
  const { chain } = useNetwork();
  const routeChain = useChainFromRoute();

  const { computed } = useEVMChainConfigsQuery();

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
            {state.selectedChains.length > 0 ? (
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
            onClick={async () => {
              setShouldFetch(true);
              // refresh the page to show the new token
              await router.replace(router.asPath);
            }}
          >
            View token page!
          </Dialog.CloseAction>
        ) : (
          <Button
            length="block"
            variant="primary"
            disabled={!chain?.name || state.txState.type !== "deployed"}
            onClick={async () => {
              if (chain && state.txState.type === "deployed") {
                setRemoteTokenDeploymentTxHash(
                  state.txState.tokenAddress,
                  chain.id,
                  state.txState.txHash,
                  state.selectedChains.map(
                    (axelarChainId) =>
                      computed.indexedById[axelarChainId].chain_id
                  )
                );

                actions.reset();

                const chainConfig = computed.indexedByChainId[chain.id];

                await router.push(
                  `/${chainConfig.chain_name.toLowerCase()}/${
                    state.txState.tokenAddress
                  }`
                );
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
