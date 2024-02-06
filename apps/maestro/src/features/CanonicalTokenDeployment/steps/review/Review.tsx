import {
  Alert,
  Button,
  CopyToClipboardButton,
  Dialog,
  ExternalLinkIcon,
  LinkButton,
} from "@axelarjs/ui";
import { maskAddress, Maybe } from "@axelarjs/utils";
import { useCallback, useEffect, useState, type FC } from "react";
import { useRouter } from "next/router";

import { useNetwork } from "wagmi";

import { useChainFromRoute } from "~/lib/hooks";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import GMPTxStatusMonitor from "~/ui/compounds/GMPTxStatusMonitor";
import { ShareHaikuButton } from "~/ui/compounds/MultiStepForm";
import { persistTokenDeploymentTxHash } from "~/ui/pages/InterchainTokenDetailsPage/ConnectedInterchainTokensPage";
import { useCanonicalTokenDeploymentStateContainer } from "../../CanonicalTokenDeployment.state";

const Review: FC = () => {
  const router = useRouter();
  const { state, actions } = useCanonicalTokenDeploymentStateContainer();
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

  // persist token deployment tx hash
  useEffect(() => {
    if (chain && state.txState.type === "deployed") {
      persistTokenDeploymentTxHash(
        state.txState.tokenAddress,
        chain.id,
        state.txState.txHash,
        state.selectedChains.map(
          (axelarChainId) => computed.indexedById[axelarChainId].chain_id
        )
      );
    }
  }, [chain, computed.indexedById, state.selectedChains, state.txState]);

  const chainConfig = Maybe.of(chain).mapOrUndefined(
    (chain) => computed.indexedByChainId[chain.id]
  );

  const handleGoToTokenPage = useCallback(async () => {
    if (chainConfig && state.txState.type === "deployed") {
      actions.reset();

      await router.push(
        `/${chainConfig.chain_name.toLowerCase()}/${state.txState.tokenAddress}`
      );
    }
  }, [actions, chainConfig, router, state.txState]);

  return (
    <>
      <div className="grid gap-4">
        {state.txState.type === "deployed" && (
          <>
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
              {chainConfig && (
                <ShareHaikuButton
                  additionalChainNames={state.selectedChains}
                  originChainName={chainConfig.name}
                  tokenName={state.tokenDetails.tokenName}
                  originAxelarChainId={chainConfig.id}
                  tokenAddress={state.txState.tokenAddress}
                  haikuType="deployment"
                />
              )}
            </Alert>
          </>
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
            onClick={handleGoToTokenPage}
          >
            Go to token page!
          </Button>
        )}
      </Dialog.Actions>
    </>
  );
};

export default Review;
