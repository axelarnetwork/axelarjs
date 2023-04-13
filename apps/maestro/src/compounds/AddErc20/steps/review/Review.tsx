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
    shouldFetch && routeChain?.id && state.deployedTokenAddress
      ? {
          chainId: routeChain.id,
          tokenAddress: state.deployedTokenAddress as `0x${string}`,
        }
      : {}
  );

  return (
    <>
      <div className="grid gap-4">
        <Alert status="success">
          <div>Token deployed and registered successfully!</div>
          <div className="flex items-center">
            Address:
            <CopyToClipboardButton
              copyText={state.deployedTokenAddress}
              size="sm"
              ghost
            >
              {maskAddress(state.deployedTokenAddress as `0x${string}`)}
            </CopyToClipboardButton>
          </div>
        </Alert>
        <LinkButton
          size="sm"
          href={`${chain?.blockExplorers?.default.url}/tx/${state.txHash}`}
          className="flex items-center gap-2"
          target="_blank"
        >
          View transaction {maskAddress(state.txHash ?? "")} on{" "}
          {chain?.blockExplorers?.default.name}{" "}
          <ExternalLink className="h-4 w-4" />
        </LinkButton>

        <GMPTxStatusMonitor txHash={state.txHash} />
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
        )}
      </Modal.Actions>
    </>
  );
};

export default Review;
