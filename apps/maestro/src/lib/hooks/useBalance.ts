import { useMemo } from "react";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SUI_TYPE_ARG } from "@mysten/sui.js/utils";
import { formatUnits } from "viem";
import {
  useAccount as useWagmiAccount,
  useBalance as useWagmiBalance,
} from "wagmi";

// Define a type for the balance result
interface BalanceResult {
  value: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
}

export function useBalance(): BalanceResult | undefined {
  const wagmiAccount = useWagmiAccount();
  const suiAccount = useCurrentAccount();

  // Wagmi balance hook
  const { data: wagmiBalance } = useWagmiBalance({
    address: wagmiAccount.address,
  });

  // Sui balance query
  const { data: suiBalance } = useSuiClientQuery(
    "getBalance",
    {
      owner: suiAccount?.address ?? "",
      coinType: SUI_TYPE_ARG,
    },
    {
      enabled: !!suiAccount,
    }
  );

  const balance = useMemo(() => {
    console.log("suiBalance", suiBalance);
    console.log("wagmiBalance", wagmiBalance);
    if (wagmiBalance) {
      return wagmiBalance;
    }
    if (suiBalance) {
      const value = BigInt(suiBalance.totalBalance);
      return {
        value,
        formatted: formatUnits(value, 9), // SUI has 9 decimals
        symbol: "SUI",
        decimals: 9,
      };
    }
    return undefined;
  }, [wagmiBalance, suiBalance]);

  return balance;
}