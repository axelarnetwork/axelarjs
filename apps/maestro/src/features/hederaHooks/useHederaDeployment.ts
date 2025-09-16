import { useCallback, useEffect, useState } from "react";

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

type Multicall = ReturnType<typeof useWriteInterchainTokenFactoryMulticall>;
type PrepareMulticallRequest = Parameters<Multicall["writeContractAsync"]>[0];

interface UseHederaParams {
  chainId: number;
  prepareMulticallRequest: PrepareMulticallRequest | undefined;
  multicall: Multicall;
  setIsTokenReadyForMulticall: (isTokenReadyForMulticall: boolean) => void;
}

export const useHederaDeployment = ({
  chainId,
  prepareMulticallRequest,
  multicall,
  setIsTokenReadyForMulticall,
}: UseHederaParams) => {
  const { address } = useAccount();

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
    if (
      chainId !== HEDERA_CHAIN_ID ||
      !whbarAddress ||
      !whbarBalance ||
      !tokenCreationPriceTinybars
    ) {
      return;
    }

    // add some margin to the target WHBAR balance
    const targetTinybarsMargin = 1000000n;

    const currentWhbarTinybars = whbarBalance;

    const targetWhbarTinybars =
      tokenCreationPriceTinybars + targetTinybarsMargin;

    const depositWhbarTinybars =
      currentWhbarTinybars < targetWhbarTinybars
        ? targetWhbarTinybars - currentWhbarTinybars
        : 0n;

    if (depositWhbarTinybars <= 0n) {
      return;
    }

    // scale up the deposit amount by 10^10
    // https://docs.hedera.com/hedera/core-concepts/smart-contracts/wrapped-hbar-whbar
    const depositValue = depositWhbarTinybars * 10n ** 10n;

    await whbarDeposit.writeContractAsync({
      address: whbarAddress,
      value: depositValue,
    });
  }, [
    chainId,
    whbarAddress,
    whbarDeposit,
    whbarBalance,
    tokenCreationPriceTinybars,
  ]);

  // WHBAR approval function - approves WHBAR for token creation
  const approveWhbarHedera = useCallback(async () => {
    if (
      chainId !== HEDERA_CHAIN_ID ||
      !whbarAddress ||
      !tokenCreationPriceTinybars
    )
      return;

    const approvalAmount = tokenCreationPriceTinybars;

    // Check if approval is needed
    const needsWhbarApproval =
      whbarAllowance && approvalAmount && whbarAllowance < approvalAmount;

    console.log("🚀 Approving WHBAR for token creation:", {
      approvalAmount,
      needsWhbarApproval,
    });

    if (needsWhbarApproval && approvalAmount > 0n) {
      await approveAsync({
        address: whbarAddress,
        args: [interchainTokenFactoryAddress, approvalAmount],
      });
      console.log("✅ WHBAR approval completed");
    } else if (!needsWhbarApproval) {
      console.log("✅ WHBAR already approved, skipping approval");
    }
  }, [
    chainId,
    whbarAddress,
    tokenCreationPriceTinybars,
    whbarAllowance,
    approveAsync,
  ]);

  const [isDeploying, setIsDeploying] = useState(false);

  const deployHedera = useCallback(async () => {
    if (chainId !== HEDERA_CHAIN_ID) return;

    setIsDeploying(false);

    await depositWhbarHedera();
    await approveWhbarHedera();

    setIsTokenReadyForMulticall(true);
  }, [
    chainId,
    depositWhbarHedera,
    approveWhbarHedera,
    setIsTokenReadyForMulticall,
  ]);

  useEffect(() => {
    if (!prepareMulticallRequest || isDeploying) {
      return;
    }

    setIsDeploying(true);

    setIsTokenReadyForMulticall(false);

    // TODO: remove hardcode
    prepareMulticallRequest.gas = 900000n;

    multicall.writeContractAsync(prepareMulticallRequest).catch((error) => {
      console.error("useHedera: deployHedera error:", error);
    });
  }, [
    multicall,
    prepareMulticallRequest,
    isDeploying,
    setIsTokenReadyForMulticall,
  ]);

  return {
    deployHedera,
  };
};
