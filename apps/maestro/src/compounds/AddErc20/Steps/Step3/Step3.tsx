import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useCallback,
  useMemo,
} from "react";

import { Button, FormControl, Label, Tooltip } from "@axelarjs/ui";
import Image from "next/image";
import { useNetwork } from "wagmi";

import { logger } from "~/lib/logger";
import { getNativeToken } from "~/lib/utils/getNativeToken";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

import { StepProps } from "..";
import { useDeployAndRegisterInterchainTokenMutation } from "../../hooks/useDeployAndRegisterInterchainTokenMutation";
import { useDeployRemoteTokensMutation } from "../../hooks/useDeployRemoteTokensMutation";
import { useRegisterOriginTokenAndDeployRemoteTokensMutation } from "../../hooks/useRegisterOriginTokenAndDeployRemoteTokensMutation";
import { useRegisterOriginTokenMutation } from "../../hooks/useRegisterOriginTokenMutation";
import { useStep3ChainSelectionState } from "./Step3.state";

export const Step3: FC<StepProps> = (props: StepProps) => {
  const { state, actions } = useStep3ChainSelectionState({
    selectedChains: props.selectedChains,
  });

  const { mutateAsync: deployAndRegisterToken } =
    useDeployAndRegisterInterchainTokenMutation();
  const { mutateAsync: registerOriginTokenAndDeployRemoteTokens } =
    useRegisterOriginTokenAndDeployRemoteTokensMutation();
  const { mutateAsync: registerOriginToken } = useRegisterOriginTokenMutation();
  const { mutateAsync: deployRemoteTokens } = useDeployRemoteTokensMutation();

  const { chain } = useNetwork();
  const { data: tokenData } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: props.deployedTokenAddress as `0x${string}`,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ==> dimension 1: isPreexisting (0 = no, 1 - yes)
    // ==> dimension 2: isTokenAlreadyRegistered (0 = no, 1 - yes)
    // ==> dimension 3: deployOnOtherChains (0 = no, 1 - yes)
    const decisionMatrix = [
      [
        [handleDeployAndRegisterToken, handleDeployAndRegisterToken],
        [null, null],
      ],
      [
        [handleRegisterOriginToken, handleRegisterAndDeployRemoteTokens],
        [null, handleDeployRemoteTokens],
      ],
    ];
    const pe = +Boolean(props.isPreexistingToken); //preexisting
    const ar = +Boolean(props.tokenAlreadyRegistered); //already-registered
    const oc = +Boolean(props.selectedChains.size > 0); //other-chains
    const decision = decisionMatrix[pe][ar][oc];

    if (decision) {
      decision(e);
    } else {
      console.warn("no op");
    }
  };

  const handleDeployRemoteTokens = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();
      console.log("handleDeployRemoteTokens");
      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      if (!tokenData?.tokenId) {
        console.log("no token ID for ", props.deployedTokenAddress);
      }

      actions.setIsDeploying(true);
      await deployRemoteTokens({
        tokenId: tokenData.tokenId as `0x${string}`,
        tokenAddress: props.deployedTokenAddress as `0x${string}`,
        destinationChainIds: Array.from(props.selectedChains),
        gasFees: state.gasFees,
        onStatusUpdate: (data) => {
          if (data.type === "deployed") {
            props.setDeployedTokenAddress(data.tokenAddress as string);

            data.txHash && props.setTxhash(data.txHash);
          }
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      tokenData.tokenId,
      actions,
      deployRemoteTokens,
      props,
    ]
  );

  const handleRegisterOriginToken = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();
      console.log("handleRegisterOriginToken");

      actions.setIsDeploying(true);
      await registerOriginToken({
        tokenAddress: props.deployedTokenAddress as `0x${string}`,
        onStatusUpdate: (data) => {
          if (data.type === "deployed") {
            props.setDeployedTokenAddress(data.tokenAddress as string);
            data.txHash && props.setTxhash(data.txHash);
          }
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [actions, registerOriginToken, props]
  );

  const handleRegisterAndDeployRemoteTokens = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();

      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees
      ) {
        logger.warn(
          "[handleRegisterAndDeployRemoteTokens]: ",
          "gas prices not loaded"
        );
        return;
      }
      actions.setIsDeploying(true);
      await registerOriginTokenAndDeployRemoteTokens({
        tokenAddress: props.deployedTokenAddress as `0x${string}`,
        destinationChainIds: Array.from(props.selectedChains),
        gasFees: state.gasFees,
        onStatusUpdate: (data) => {
          if (data.type === "deployed") {
            props.setDeployedTokenAddress(data.tokenAddress as string);
            data.txHash && props.setTxhash(data.txHash);
          }
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      actions,
      registerOriginTokenAndDeployRemoteTokens,
      props,
    ]
  );

  const handleDeployAndRegisterToken = useCallback<
    FormEventHandler<HTMLFormElement>
  >(
    async (e) => {
      e.preventDefault();
      console.log("handleDeployAndRegisterToken");

      if (
        state.isGasPriceQueryLoading ||
        state.isGasPriceQueryError ||
        !state.gasFees
      ) {
        console.warn("gas prices not loaded");
        return;
      }
      actions.setIsDeploying(true);
      await deployAndRegisterToken({
        tokenName: props.tokenName,
        tokenSymbol: props.tokenSymbol,
        decimals: props.decimals,
        destinationChainIds: Array.from(props.selectedChains),
        gasFees: state.gasFees,
        sourceChainId: state.evmChains?.find(
          (evmChain) => evmChain.chain_id === state.network.chain?.id
        )?.chain_name as string,
        onStatusUpdate: (data) => {
          if (data.type === "deployed") {
            props.setDeployedTokenAddress(data.tokenAddress as string);
            data.txHash && props.setTxhash(data.txHash);
          }
        },
      });
      actions.setIsDeploying(false);
      props.incrementStep();
    },
    [
      state.isGasPriceQueryLoading,
      state.isGasPriceQueryError,
      state.gasFees,
      state.evmChains,
      state.network.chain?.id,
      actions,
      deployAndRegisterToken,
      props,
    ]
  );

  const tooltipPositionOverrides = useMemo(() => {
    return {
      // position the first tooltip to the right
      0: "right" as const,
      // position the last tooltip to the left
      [Number(state.evmChains?.length) - 1]: "left" as const,
    };
  }, [state.evmChains?.length]);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <FormControl>
        <Label>
          <Label.Text>Chains to deploy remote tokens</Label.Text>
        </Label>
        <div className="bg-base-300 flex flex-wrap justify-evenly gap-2.5 rounded-lg p-2">
          {state.evmChains?.map((chain, i) => {
            const isSelected = props.selectedChains.has(chain.chain_name);
            return (
              <Tooltip
                tip={`Deploy on ${chain.name}`}
                key={chain.chain_name}
                position={tooltipPositionOverrides[i] ?? "top"}
              >
                <Button
                  ghost={true}
                  shape="circle"
                  className="h-[40] w-[40] rounded-full"
                  size="sm"
                  color="primary"
                  outline={isSelected}
                  onClick={() => {
                    const action = isSelected
                      ? props.removeSelectedChain
                      : props.addSelectedChain;

                    action(chain.chain_name);
                  }}
                >
                  <Image
                    className="pointer-events-none rounded-full"
                    src={`${process.env.NEXT_PUBLIC_EXPLORER_URL}${chain.image}`}
                    width={24}
                    height={24}
                    alt="chain logo"
                  />
                </Button>
              </Tooltip>
            );
          })}
        </div>
      </FormControl>
      <Button
        loading={state.isDeploying}
        type="submit"
        disabled={
          state.isGasPriceQueryLoading ||
          state.isGasPriceQueryError ||
          !state.gasFees?.length
        }
      >
        Deploy{" "}
        {Boolean(state.gasFees?.length) &&
          `and register on ${state.gasFees?.length} chain${
            Number(state.gasFees?.length) > 1 ? "s" : ""
          }`}
        <Tooltip tip="Approximate gas cost">
          <span className="ml-2 text-xs">
            (≈ {state.totalGasFee}{" "}
            {state?.sourceChainId && getNativeToken(state.sourceChainId)} in
            fees)
          </span>
        </Tooltip>
      </Button>
    </form>
  );
};

export default Step3;
