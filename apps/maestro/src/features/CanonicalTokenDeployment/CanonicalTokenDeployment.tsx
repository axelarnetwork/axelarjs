import { Alert, Button, InfoIcon } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useMemo, type FC } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { TransactionExecutionError } from "viem";

import {
  useAccount,
  useChainFromRoute,
  useSwitchChain,
} from "~/lib/hooks";
import { useGetChainsConfig } from "~/services/axelarConfigs/hooks";
import { ChainIcon } from "~/ui/components/ChainsDropdown";
import { MultiStepDialog, StepLoading } from "~/ui/compounds/MultiStepForm";
import {
  CanonicalTokenDeploymentStateProvider,
  useCanonicalTokenDeploymentStateContainer,
  type TokenDetails,
} from "./CanonicalTokenDeployment.state";

const Step1 = dynamic(() => import("./steps/token-details"), {
  loading: StepLoading,
});

const Step2 = dynamic(() => import("./steps/deploy-and-register"), {
  loading: StepLoading,
});

const Step3 = dynamic(() => import("./steps/review"), {
  loading: StepLoading,
});

const STEPS = [Step1, Step2, Step3];

const CanonicalTokenDeployment: FC = () => {
  const { state, actions } = useCanonicalTokenDeploymentStateContainer();
  const routeChain = useChainFromRoute();
  const { chain: currentConnectedChain } = useAccount();
  const { data: chainInfo } = useGetChainsConfig({
    axelarChainId: routeChain?.axelarChainId,
  });
  const { switchChain } = useSwitchChain();
  // Agora suportamos registro de tokens canônicos em Stellar

  const handleSwitchChain = useCallback(() => {
    try {
      switchChain?.({ chainId: routeChain?.id as number });
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Failed to switch chain: ${error.cause.shortMessage}`);
      }
    }
  }, [routeChain?.id, switchChain]);

  const isGatewayToken = useMemo(() => {
    if (!chainInfo?.assets || !state.tokenDetails?.tokenAddress) return false;
    const tokenAddressLowerCase = state.tokenDetails.tokenAddress.toLowerCase();

    return Object.entries(chainInfo.assets).some(
      ([symbol, tokenAddress]) =>
        !symbol.startsWith("0x") &&
        typeof tokenAddress === "string" &&
        tokenAddress.toLowerCase() === tokenAddressLowerCase
    );
  }, [chainInfo, state.tokenDetails]);

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const showBackButton = useMemo(
    () => state.step !== 0 && state.step !== 2,
    [state.step]
  );

  const isOnTokenNativeChain = useMemo(() => {
    return routeChain?.id === currentConnectedChain?.id;
  }, [routeChain?.id, currentConnectedChain?.id]);

  if (isGatewayToken)
    return (
      <Alert $status="warning" icon={<InfoIcon className="h-6 w-6" />}>
        This token is registered natively on Axelar and will be supported by ITS
        in the near future. You can use{" "}
        {
          <Link
            className="font-semibold hover:underline"
            href={"https://app.squidrouter.com/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Squid
          </Link>
        }{" "}
        to transfer this token.
      </Alert>
    );

  if (!isOnTokenNativeChain) {
    const imageSrc = chainInfo?.iconUrl?.replace("images/", "logos/");

    return (
      <Button
        $variant="primary"
        className="my-1 flex w-full"
        onClick={handleSwitchChain}
      >
        Connect to {routeChain?.name ?? "chain"} to register token{" "}
        <ChainIcon
          size="sm"
          src={imageSrc ?? ""}
          alt={routeChain?.name ?? ""}
        />
      </Button>
    );
  }

  return (
    <MultiStepDialog
      triggerLabel="Register interchain token"
      steps={["Token details", "Register & Deploy", "Review"]}
      step={state.step}
      showBackButton={showBackButton}
      onBackClick={actions.prevStep}
      onClose={actions.reset}
      disableChainsDropdown
      disableClose={
        state.txState.type !== "idle" && state.txState.type !== "deployed"
      }
    >
      <CurrentStep />
    </MultiStepDialog>
  );
};

type CanonicalTokenDeploymentProps = {
  tokenDetails?: TokenDetails;
};

const CanonicalTokenDeploymentWithProvider: FC<
  CanonicalTokenDeploymentProps
> = (props) => {
  return (
    <CanonicalTokenDeploymentStateProvider
      initialState={
        props.tokenDetails
          ? {
              tokenDetails: props.tokenDetails,
              step: 1,
            }
          : undefined
      }
    >
      <CanonicalTokenDeployment />
    </CanonicalTokenDeploymentStateProvider>
  );
};

export default CanonicalTokenDeploymentWithProvider;
