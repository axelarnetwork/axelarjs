import { useEffect, useMemo, useState } from "react";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
import { Horizon } from "stellar-sdk";
import { formatUnits } from "viem";
import {
  useAccount as useWagmiAccount,
  useBalance as useWagmiBalance,
} from "wagmi";

import {
  solanaChainConfig,
  stellarChainConfig,
  suiChainConfig,
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
  const { connection: solanaConnection } = useConnection();
  const { publicKey: solanaPublicKey } = useSolanaWallet();
  const [solanaLamports, setSolanaLamports] = useState<number | null>(null);

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
    if (
      chainName === solanaChainConfig.name &&
      address &&
      solanaConnection &&
      solanaPublicKey
    ) {
      const fetchSolBalance = async () => {
        try {
          const lamports = await solanaConnection.getBalance(solanaPublicKey);
          setSolanaLamports(lamports);
        } catch (error) {
          setSolanaLamports(null);
        }
      };
      void fetchSolBalance();
    }
  }, [chainName, address, solanaConnection, solanaPublicKey]);

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
    if (solanaLamports) {
      const value = BigInt(solanaLamports);
      const { decimals, symbol } = (
        solanaChainConfig ?? {
          nativeCurrency: { decimals: 9, symbol: "SOL" },
        }
      ).nativeCurrency as { decimals: number; symbol: string };
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
    return undefined;
  }, [wagmiBalance, suiBalance, solanaLamports, stellarBalance]);

  return balance;
}
