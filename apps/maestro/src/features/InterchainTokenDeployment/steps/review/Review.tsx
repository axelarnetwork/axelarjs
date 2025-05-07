import {
  Alert,
  CopyToClipboardButton,
  Dialog,
  ExternalLinkIcon,
  LinkButton,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";

// Safe version of maskAddress that handles non-string values
const safeMaskAddress = (address: any): string => {
  if (!address || typeof address !== 'string') return '';
  try {
    return maskAddress(address);
  } catch (error) {
    // If the address can't be masked, just return a truncated version
    return address.length > 10 
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` 
      : address;
  }
};
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useRouter } from "next/router";

import { useAccount, useChainFromRoute } from "~/lib/hooks";
import { useAllChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";
import GMPTxStatusMonitor from "~/ui/compounds/GMPTxStatusMonitor";
import { ShareHaikuButton } from "~/ui/compounds/MultiStepForm";
import { persistTokenDeploymentTxHash } from "~/ui/pages/InterchainTokenDetailsPage/ConnectedInterchainTokensPage";
import { useInterchainTokenDeploymentStateContainer } from "../../InterchainTokenDeployment.state";

const Review: FC = () => {
  const router = useRouter();
  const { state, actions } = useInterchainTokenDeploymentStateContainer();
  const { chain } = useAccount();
  const routeChain = useChainFromRoute();

  const { combinedComputed } = useAllChainConfigsQuery();

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
    if (
      chain &&
      Object.keys(combinedComputed.indexedById).length > 0 &&
      state.txState.type === "deployed"
    ) {
      persistTokenDeploymentTxHash(
        state.txState.tokenAddress,
        chain.id,
        state.txState.txHash,
        state.selectedChains.map((axelarChainId) => {
          return combinedComputed.indexedById[axelarChainId].chain_id;
        })
      );
    }
  }, [
    chain,
    combinedComputed.indexedById,
    state.selectedChains,
    state.txState,
  ]);

  const chainConfig = useMemo(() => {
    if (!chain) return undefined;
    return combinedComputed.indexedByChainId[chain.id];
  }, [chain, combinedComputed.indexedByChainId]);

  const handleGoToTokenPage = useCallback(async () => {
    if (chainConfig && state.txState.type === "deployed") {
      actions.reset();

      await router.push(
        `/${chainConfig.id.toLowerCase()}/${state.txState.tokenAddress}`
      );
    }
  }, [actions, chainConfig, router, state.txState]);

  const isVMChain = chainConfig?.chain_type === "vm";

  return (
    <>
      <div className="grid gap-4">
        {state.txState.type === "deployed" && (
          <>
            <Alert $status="success">
              <div className="flex justify-center font-semibold md:justify-start">
                Token deployed successfully!
              </div>
              <div className="flex items-center justify-center md:justify-start">
                Address:
                <CopyToClipboardButton
                  copyText={state.txState.tokenAddress}
                  $size="sm"
                  $variant="ghost"
                >
                  {safeMaskAddress(state.txState.tokenAddress)}
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
              !isVMChain && (
                <LinkButton
                  $size="sm"
                  href={`${chain?.blockExplorers?.default.url}/tx/${state.txState.txHash}`}
                  className="flex items-center gap-2"
                  target="_blank"
                >
                  View transaction{" "}
                  <span className="hidden md:inline">
                    {typeof state.txState.txHash === 'string' && state.txState.txHash.includes("stellar-tx-")
                      ? "Stellar Transaction" 
                      : safeMaskAddress(state.txState.txHash)}
                  </span>{" "}
                  on {chain?.blockExplorers?.default.name}{" "}
                  <ExternalLinkIcon className="h-4 w-4" />
                </LinkButton>
              )
            )}
          </>
        )}
      </div>
      <Dialog.Actions>
        <Dialog.CloseAction
          $length="block"
          $variant="primary"
          disabled={!routeChain && (!chainConfig || state.txState.type !== "deployed")}
          onClick={async () => {
            setShouldFetch(true);
            if (routeChain) {
              await router.replace(router.asPath);
            } else {
              await handleGoToTokenPage();
            }
          }}
        >
          {routeChain ? "View token page!" : "Go to token page!"}
        </Dialog.CloseAction>
      </Dialog.Actions>
    </>
  );
};

export default Review;
