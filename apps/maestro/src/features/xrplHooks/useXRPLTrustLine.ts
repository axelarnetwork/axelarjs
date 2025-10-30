import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";
import {
  useSignAndSubmitTransaction,
  useWallet,
} from "@xrpl-wallet-standard/react";
import * as xrpl from "xrpl";

import { XRPL_CHAIN_ID } from "~/config/chains";
import { useAccount, useChainId } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { XRPL_NETWORK_IDENTIFIER, withXRPLClient } from "~/lib/utils/xrpl";
import { isValidXRPLWalletAddress } from "~/lib/utils/xrpl";

export type UseXRPLTrustLineOptions = {
  accountAddress?: string;
  enabled?: boolean;
};

export function useXRPLTrustLine(
  tokenAddress?: string,
  options?: UseXRPLTrustLineOptions
) {
  const { address } = useAccount();
  const chainId = useChainId();
  const trpcUtils = trpc.useUtils();

  const isXRPLChain = chainId === XRPL_CHAIN_ID;
  const accountAddressToCheck = options?.accountAddress ?? address;

  const {
    data: trustLineData,
    isFetching: isCheckingXRPLTrustLine,
    isError: hasTrustLineError,
  } = trpc.xrpl.checkTrustLine.useQuery(
    {
      tokenAddress: tokenAddress ?? "",
      account: accountAddressToCheck ?? "",
    },
    {
      enabled:
        (options?.enabled ?? true) &&
        Boolean(tokenAddress) &&
        (Boolean(accountAddressToCheck) && isValidXRPLWalletAddress(accountAddressToCheck)) &&
        (options?.accountAddress ? true : Boolean(isXRPLChain)),
      retry: false,
    }
  );

  const invalidateTrustLine = async () => {
    if (!tokenAddress || !accountAddressToCheck) return;
    await trpcUtils.xrpl.checkTrustLine.invalidate({
      tokenAddress,
      account: accountAddressToCheck,
    });
  };

  const { wallet } = useWallet();
  const signAndSubmit = useSignAndSubmitTransaction();
  const buildTx = trpc.xrpl.getTrustSetTxBytes.useMutation();

  const createXRPLTrustLine = useMutation<
    string,
    Error,
    { tokenAddress: string }
  >({
    mutationFn: async ({ tokenAddress }) => {
      if (!wallet || !accountAddressToCheck)
        throw new Error("XRPL wallet not connected");
      const { txBase64 } = await buildTx.mutateAsync({
        account: accountAddressToCheck,
        tokenAddress,
        limit: "999999999999",
      });
      const decoded = xrpl.decode(txBase64) as xrpl.SubmittableTransaction;

      const prepared = await withXRPLClient(async (client) => {
        return await client.autofill(decoded);
      });

      const result = await signAndSubmit(
        prepared,
        XRPL_NETWORK_IDENTIFIER
      );
      return result.tx_hash;
    },
  });

  const removeXRPLTrustLine = useMutation<
    string,
    Error,
    { tokenAddress: string }
  >({
    mutationFn: async ({ tokenAddress }) => {
      if (!wallet || !accountAddressToCheck)
        throw new Error("XRPL wallet not connected");
      const { txBase64 } = await buildTx.mutateAsync({
        account: accountAddressToCheck,
        tokenAddress,
        limit: "0",
      });
      const decoded = xrpl.decode(txBase64);

      const prepared = await withXRPLClient(async (client) => {
        return await client.autofill(decoded as any);
      });

      const result = await signAndSubmit(
        prepared,
        XRPL_NETWORK_IDENTIFIER
      );
      return result.tx_hash;
    },
  });

  const hasXRPLTrustLine = useMemo(
    () => trustLineData?.hasTrustLine ?? null,
    [trustLineData]
  );

  return {
    hasXRPLTrustLine,
    isCheckingXRPLTrustLine,
    hasTrustLineError,
    createXRPLTrustLine,
    removeXRPLTrustLine,
    invalidateTrustLine,
  } as const;
}
