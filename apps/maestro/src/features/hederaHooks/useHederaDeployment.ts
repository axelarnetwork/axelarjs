import { useCallback, useEffect, useRef } from "react";

import { usePublicClient } from "wagmi";

import { useReadHederaExchangeRatePrecompileTinycentsToTinybars } from "~/features/hederaHooks/HederaExchangeRatePrecompile.hooks";
import {
  useReadWhbarAllowance,
  useReadWhbarBalanceOf,
  useWriteWhbarApprove,
  useWriteWhbarDeposit,
} from "~/features/hederaHooks/WHBAR.hooks";
import {
  useReadInterchainTokenServiceTokenCreationPrice,
  useReadInterchainTokenServiceWhbarAddress,
} from "~/lib/contracts/hedera/HederaInterchainTokenService.hooks";
import {
  interchainTokenFactoryAddress,
  useWriteInterchainTokenFactoryMulticall,
} from "~/lib/contracts/InterchainTokenFactory.hooks";
import { HEDERA_CHAIN_ID, useAccount, useChainId } from "~/lib/hooks";
import { DeployAndRegisterTransactionState } from "../InterchainTokenDeployment";

type Multicall = ReturnType<typeof useWriteInterchainTokenFactoryMulticall>;
type PrepareMulticallRequest = Parameters<Multicall["writeContractAsync"]>[0];

interface UseHederaParams {
  prepareMulticallRequest: PrepareMulticallRequest | undefined;
  multicall: Multicall;
  setIsTokenReadyForMulticall: (isTokenReadyForMulticall: boolean) => void;
  onStatusUpdate: (status: DeployAndRegisterTransactionState) => void;
}

// use a constant value as the estimation is not accurate
const DEPLOYMENT_GAS_COST = 5000000n;

const useStatusUpdate = (
  onStatusUpdate: (status: DeployAndRegisterTransactionState) => void
) => {
  const currentStepRef = useRef(1);
  const totalStepsRef = useRef(3);

  const onInitStatus = useCallback(() => {
    currentStepRef.current = 1;
    totalStepsRef.current = 3;
    onStatusUpdate?.({
      type: "pending_approval",
      step: currentStepRef.current,
      totalSteps: totalStepsRef.current,
    });
  }, [onStatusUpdate]);

  const onSignatureCompleted = useCallback(() => {
    currentStepRef.current = Math.min(
      currentStepRef.current + 1,
      totalStepsRef.current
    );
    onStatusUpdate?.({
      type: "pending_approval",
      step: currentStepRef.current,
      totalSteps: totalStepsRef.current,
    });
  }, [onStatusUpdate]);

  const onSignatureNotNeeded = useCallback(() => {
    totalStepsRef.current = Math.max(
      totalStepsRef.current - 1,
      currentStepRef.current
    );
    onStatusUpdate?.({
      type: "pending_approval",
      step: currentStepRef.current,
      totalSteps: totalStepsRef.current,
    });
  }, [onStatusUpdate]);

  return {
    onInitStatus,
    onSignatureCompleted,
    onSignatureNotNeeded,
  };
};

/*
 * Hedera deployment flow:
 * 1. First we need to deposit and approve WHBAR (via deployHedera)
 * 2. Then we set isTokenReadyForMulticall(true) to signal readiness
 * 3. When ready, the useEffect runs the actual token deployment multicall
 */
export const useHederaDeployment = ({
  prepareMulticallRequest,
  multicall,
  setIsTokenReadyForMulticall,
  onStatusUpdate,
}: UseHederaParams) => {
  const chainId = useChainId();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const { onInitStatus, onSignatureCompleted, onSignatureNotNeeded } =
    useStatusUpdate(onStatusUpdate);

  // Get token creation price
  const { data: tokenCreationPriceTinycents } =
    useReadInterchainTokenServiceTokenCreationPrice({
      query: {
        enabled: chainId === HEDERA_CHAIN_ID,
      },
    });

  // Convert token creation price from tinycents to tinybars
  const { data: tokenCreationPriceTinybars } =
    useReadHederaExchangeRatePrecompileTinycentsToTinybars({
      chainId: HEDERA_CHAIN_ID,
      args: tokenCreationPriceTinycents
        ? [tokenCreationPriceTinycents]
        : undefined,
      query: {
        enabled: !!tokenCreationPriceTinycents && chainId === HEDERA_CHAIN_ID,
      },
    });

  // Get WHBAR address
  const { data: whbarAddress } = useReadInterchainTokenServiceWhbarAddress({
    chainId: HEDERA_CHAIN_ID,
    query: {
      enabled: chainId === HEDERA_CHAIN_ID,
    },
  });

  // Get WHBAR balance
  const { data: whbarBalance, refetch: refetchWhbarBalance } =
    useReadWhbarBalanceOf({
      address: whbarAddress,
      chainId: HEDERA_CHAIN_ID,
      args: address ? [address] : undefined,
      query: {
        enabled: chainId === HEDERA_CHAIN_ID && !!address && !!whbarAddress,
      },
    });

  // Get WHBAR allowance
  const { data: whbarAllowance, refetch: refetchWhbarAllowance } =
    useReadWhbarAllowance({
      address: whbarAddress,
      chainId: HEDERA_CHAIN_ID,
      args: address ? [address, interchainTokenFactoryAddress] : undefined,
      query: {
        enabled: chainId === HEDERA_CHAIN_ID && !!address && !!whbarAddress,
      },
    });

  // WHBAR hooks
  const whbarDeposit = useWriteWhbarDeposit();
  const { writeContractAsync: approveAsync } = useWriteWhbarApprove();

  // WHBAR deposit function - deposits HBAR to get WHBAR
  const depositWhbarHedera = useCallback(async () => {
    if (
      chainId !== HEDERA_CHAIN_ID ||
      !publicClient ||
      !whbarAddress ||
      !tokenCreationPriceTinybars
    ) {
      return;
    }

    // add some margin to the target WHBAR balance
    const targetTinybarsMargin = 2000000n;

    const currentWhbarTinybars = whbarBalance || 0n;

    const targetWhbarTinybars =
      tokenCreationPriceTinybars + targetTinybarsMargin;

    const depositWhbarTinybars = targetWhbarTinybars - currentWhbarTinybars;

    if (depositWhbarTinybars <= 0n) {
      onSignatureNotNeeded();
      return;
    }

    // scale up the deposit amount by 10^10
    // https://docs.hedera.com/hedera/core-concepts/smart-contracts/wrapped-hbar-whbar
    const depositValue = depositWhbarTinybars * 10n ** 10n;

    const txHash = await whbarDeposit.writeContractAsync({
      address: whbarAddress,
      value: depositValue,
    });

    onSignatureCompleted();

    await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return txHash;
  }, [
    chainId,
    whbarAddress,
    whbarDeposit,
    whbarBalance,
    tokenCreationPriceTinybars,
    publicClient,
    onSignatureCompleted,
    onSignatureNotNeeded,
  ]);

  // WHBAR approval function - approves WHBAR for token creation
  const approveWhbarHedera = useCallback(async () => {
    if (
      !publicClient ||
      chainId !== HEDERA_CHAIN_ID ||
      !whbarAddress ||
      !tokenCreationPriceTinybars
    )
      return;

    // add some margin to the target WHBAR approval amount
    const targetTinybarsMargin = 2000000n;

    const currentWhbarAllowance = whbarAllowance || 0n;

    const approvalAmount = tokenCreationPriceTinybars + targetTinybarsMargin;

    // Check if approval is needed
    const needsWhbarApproval =
      approvalAmount && currentWhbarAllowance < approvalAmount;

    if (needsWhbarApproval) {
      const txHash = await approveAsync({
        address: whbarAddress,
        args: [interchainTokenFactoryAddress, approvalAmount],
      });

      onSignatureCompleted();

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
    } else {
      onSignatureNotNeeded();
    }
  }, [
    chainId,
    whbarAddress,
    tokenCreationPriceTinybars,
    whbarAllowance,
    publicClient,
    approveAsync,
    onSignatureCompleted,
    onSignatureNotNeeded,
  ]);

  /** Keep a ref to prevent the multicall from running multiple times */
  const isProcessingMulticall = useRef(false);
  /**
   * Promise resolvers for deployHedera, since deployment will start on deployHedera but finish on the effect.
   * This ref is also used to store if the user has initiated the deployment,
   * as on unmounting, the useEffect will run automatically (since multicall will have data).
   */
  const deployPromiseResolvers = useRef<{
    resolve: (value: `0x${string}`) => void;
    reject: (reason?: Error) => void;
  } | null>(null);

  const deployHedera = useCallback(async () => {
    if (chainId !== HEDERA_CHAIN_ID) return;

    onInitStatus();

    return new Promise((resolve, reject) => {
      // Store the promise resolvers
      deployPromiseResolvers.current = { resolve, reject };

      isProcessingMulticall.current = false;

      // deposit and approve WHBAR in parallel
      Promise.all([depositWhbarHedera(), approveWhbarHedera()])
        .then(() => {
          // Set the token as ready for multicall, so the effect will run
          setIsTokenReadyForMulticall(true);
        })
        .catch((error) => {
          deployPromiseResolvers.current = null;

          // refetch WHBAR allowance and balance, since one of those promises could have succeeded
          refetchWhbarAllowance().catch((error) => {
            console.error("useHederaDeployment: deployHedera", error);
          });

          refetchWhbarBalance().catch((error) => {
            console.error("useHederaDeployment: deployHedera", error);
          });

          reject(error);
        });
    });
  }, [
    chainId,
    depositWhbarHedera,
    approveWhbarHedera,
    onInitStatus,
    setIsTokenReadyForMulticall,
    refetchWhbarAllowance,
    refetchWhbarBalance,
  ]);

  useEffect(() => {
    if (
      chainId !== HEDERA_CHAIN_ID ||
      !prepareMulticallRequest ||
      isProcessingMulticall.current ||
      !deployPromiseResolvers.current
    ) {
      return;
    }

    isProcessingMulticall.current = true;

    setIsTokenReadyForMulticall(false);

    const multicallRequest: PrepareMulticallRequest = {
      ...prepareMulticallRequest,
      gas: DEPLOYMENT_GAS_COST,
    };

    multicall
      .writeContractAsync(multicallRequest)
      .then((result) => {
        deployPromiseResolvers.current?.resolve(result);
        deployPromiseResolvers.current = null;
      })
      .catch((error) => {
        deployPromiseResolvers.current?.reject(error);
        deployPromiseResolvers.current = null;
      });
  }, [
    multicall,
    prepareMulticallRequest,
    chainId,
    setIsTokenReadyForMulticall,
  ]);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (chainId !== HEDERA_CHAIN_ID) {
        return;
      }

      setIsTokenReadyForMulticall(false);

      deployPromiseResolvers.current?.reject(new Error("Component unmounted"));
      deployPromiseResolvers.current = null;
    };
  }, [setIsTokenReadyForMulticall, chainId]);

  return {
    deployHedera,
  };
};
