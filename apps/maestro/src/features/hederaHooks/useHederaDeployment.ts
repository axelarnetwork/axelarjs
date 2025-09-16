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
import { HEDERA_CHAIN_ID, useAccount } from "~/lib/hooks";

// use a constant value as the estimation is not accurate
const DEPLOYMENT_GAS_COST = 900000n;

type Multicall = ReturnType<typeof useWriteInterchainTokenFactoryMulticall>;
type PrepareMulticallRequest = Parameters<Multicall["writeContractAsync"]>[0];

interface UseHederaParams {
  chainId: number;
  prepareMulticallRequest: PrepareMulticallRequest | undefined;
  multicall: Multicall;
  setIsTokenReadyForMulticall: (isTokenReadyForMulticall: boolean) => void;
}

/*
 * Hedera deployment flow:
 * 1. First we need to deposit and approve WHBAR (via deployHedera)
 * 2. Then we set isTokenReadyForMulticall(true) to signal readiness
 * 3. When ready, the useEffect runs the actual token deployment multicall
 */
export const useHederaDeployment = ({
  chainId,
  prepareMulticallRequest,
  multicall,
  setIsTokenReadyForMulticall,
}: UseHederaParams) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();

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
  const { data: whbarBalance } = useReadWhbarBalanceOf({
    address: whbarAddress,
    chainId: HEDERA_CHAIN_ID,
    args: address ? [address] : undefined,
    query: {
      enabled: chainId === HEDERA_CHAIN_ID && !!address && !!whbarAddress,
    },
  });

  // Get WHBAR allowance
  const { data: whbarAllowance } = useReadWhbarAllowance({
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
    if (!publicClient) {
      return;
    }

    if (
      chainId !== HEDERA_CHAIN_ID ||
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
      return;
    }

    // scale up the deposit amount by 10^10
    // https://docs.hedera.com/hedera/core-concepts/smart-contracts/wrapped-hbar-whbar
    const depositValue = depositWhbarTinybars * 10n ** 10n;

    const txHash = await whbarDeposit.writeContractAsync({
      address: whbarAddress,
      value: depositValue,
    });

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

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
    }
  }, [
    chainId,
    whbarAddress,
    tokenCreationPriceTinybars,
    whbarAllowance,
    publicClient,
    approveAsync,
  ]);

  /** Keep a ref to prevent the multicall from running multiple times. */
  const isProcessingMulticall = useRef(false);

  const deployHedera = useCallback(async () => {
    if (chainId !== HEDERA_CHAIN_ID) return;

    isProcessingMulticall.current = false;

    // deposit and approve WHBAR in parallel
    await Promise.all([depositWhbarHedera(), approveWhbarHedera()]);

    setIsTokenReadyForMulticall(true);
  }, [
    chainId,
    depositWhbarHedera,
    approveWhbarHedera,
    setIsTokenReadyForMulticall,
  ]);

  useEffect(() => {
    if (
      !prepareMulticallRequest ||
      isProcessingMulticall.current ||
      chainId !== HEDERA_CHAIN_ID
    ) {
      return;
    }

    isProcessingMulticall.current = true;

    setIsTokenReadyForMulticall(false);

    prepareMulticallRequest.gas = DEPLOYMENT_GAS_COST;

    multicall.writeContractAsync(prepareMulticallRequest).catch((error) => {
      console.error("useHedera: deployHedera error:", error);
    });
  }, [
    multicall,
    prepareMulticallRequest,
    chainId,
    setIsTokenReadyForMulticall,
  ]);

  return {
    deployHedera,
  };
};
