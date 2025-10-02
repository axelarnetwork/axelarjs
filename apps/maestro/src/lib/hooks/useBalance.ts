import { useEffect, useMemo, useState } from "react";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  useConnect as useXRPLConnect,
  useWallet as useXRPLWallet,
} from "@xrpl-wallet-standard/react";
import * as xrpl from "xrpl";
import { Horizon } from "stellar-sdk";
import { formatUnits } from "viem";
import {
  useAccount as useWagmiAccount,
  useBalance as useWagmiBalance,
} from "wagmi";

import { 
  stellarChainConfig, 
  suiChainConfig,
  xrplChainConfig,
} from "~/config/chains/vm-chains";
import { STELLAR_HORIZON_URL } from "~/server/routers/stellar/utils/config";
import { useAccount } from "./useAccount";

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
  const { address, chainName } = useAccount();
  const [stellarBalance, setStellarBalance] = useState<string | null>(null);
  const { wallet: xrplWallet } = useXRPLWallet();
  const [XRPLDrops, setXRPLDrops] = useState<number | null>(null);

  // Wagmi balance hook
  const { data: wagmiBalance } = useWagmiBalance({
    address: wagmiAccount.address,
  });

  // Sui balance query
  const { data: suiBalance } = useSuiClientQuery(
    "getBalance",
    {
      owner: suiAccount?.address ?? "",
    },
    {
      enabled: !!suiAccount,
    }
  );

  useEffect(() => {
    if (chainName === stellarChainConfig.name && address) {
      const fetchBalance = async () => {
        const server = new Horizon.Server(STELLAR_HORIZON_URL);
        const account = await server.loadAccount(address);
        const xlmBalance = account.balances.find(
          (b) => b.asset_type === "native"
        )?.balance;
        setStellarBalance(xlmBalance || "0");
      };
      void fetchBalance();
    }
  }, [chainName, address]);

  useEffect(() => {
    console.log("Running XRPL get balance effect:", chainName, xrplChainConfig.name, address, xrplWallet);

    if (chainName === xrplChainConfig.name && address && xrplWallet?.accounts.length) { // TODO: fix XRPL connection check
      const fetchXRPLBalance = async () => {
        const client = new xrpl.Client(xrplChainConfig.rpcUrls.default.http[0]);
        await client.connect();

        try {
          const accountInfo = await client.request({
            command: "account_info",
            account: address,
          });
          // Balance is returned in drops (1 XRP = 1,000,000 drops)
          const drops = parseInt(accountInfo.result.account_data.Balance);
          setXRPLDrops(drops);
          console.log("Fetched XRPL balance in drops:", drops);
        } finally {
          client.disconnect();
        }
      }
      fetchXRPLBalance();
    }
  }, [chainName, address])

  const balance = useMemo(() => {
    if (wagmiBalance) {
      return wagmiBalance;
    }
    if (suiBalance) {
      const value = BigInt(suiBalance.totalBalance);
      const { decimals, symbol } = suiChainConfig.nativeCurrency;
      return {
        value,
        formatted: formatUnits(value, decimals),
        symbol,
        decimals,
      };
    }
    if (stellarBalance) {
      const { decimals, symbol } = stellarChainConfig.nativeCurrency;
      const value = BigInt(Math.floor(Number(stellarBalance) * 10 ** decimals));
      return {
        value,
        formatted: formatUnits(value, decimals),
        symbol,
        decimals,
      };
    }
    if (XRPLDrops) {
      const value = BigInt(XRPLDrops);
      const { decimals, symbol } = (
        xrplChainConfig ?? {
          nativeCurrency: { decimals: 6, symbol: "XRP" },
        }
      ).nativeCurrency as { decimals: number; symbol: string };
      return {
        value,
        formatted: formatUnits(value, decimals),
        symbol,
        decimals,
      };
    }
    return undefined;
  }, [wagmiBalance, suiBalance, stellarBalance, XRPLDrops]);

  return balance;
}
