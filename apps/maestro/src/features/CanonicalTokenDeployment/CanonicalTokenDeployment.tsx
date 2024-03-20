import { Alert, InfoIcon } from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { useChainFromRoute } from "~/lib/hooks";
import { useGetChainsConfig } from "~/services/axelarConfigs/hooks";
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
  const { data: chainInfo } = useGetChainsConfig({
    axelarChainId: routeChain?.axelarChainId,
  });

  const isGatewayToken = useMemo(
    () =>
      (
        Object.values(chainInfo?.assets ?? []).map((assetId: any) =>
          String(assetId ?? "").toLowerCase(),
        ) || []
      ).includes(state.tokenDetails.tokenAddress.toLowerCase()),
    [chainInfo, state.tokenDetails.tokenAddress],
  );

  const CurrentStep = useMemo(() => STEPS[state.step], [state.step]);

  const showBackButton = useMemo(
    () => state.step !== 0 && state.step !== 2,
    [state.step],
  );

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
