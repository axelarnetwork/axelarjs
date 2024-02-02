import {
  AxelarConfigClient,
  AxelarscanClient,
  createAxelarConfigClient,
  createAxelarQueryClient,
  EVMChainConfig,
} from "@axelarjs/api";
import {
  IERC20BurnableMintableClient,
  InterchainTokenClient,
  InterchainTokenFactoryClient,
  InterchainTokenServiceClient,
  TokenManagerClient,
} from "@axelarjs/evm";
import { invariant } from "@axelarjs/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, type AuthOptions } from "next-auth";

import type { inferAsyncReturnType } from "@trpc/server";
import { kv } from "@vercel/kv";
import OpenAI from "openai";
import type { Chain } from "wagmi";

import {
  NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NEXT_PUBLIC_NETWORK_ENV,
} from "~/config/env";
import { NEXT_AUTH_OPTIONS, type Web3Session } from "~/config/next-auth";
import { ExtendedWagmiChainConfig, WAGMI_CHAIN_CONFIGS } from "~/config/wagmi";
import db from "~/lib/drizzle/client";
import axelarjsSDKClient from "~/services/axelarjsSDK";
import axelarscanClient from "~/services/axelarscan";
import MaestroKVClient from "~/services/db/kv";
import MaestroPostgresClient from "~/services/db/postgres";
import gmpClient from "~/services/gmp";

export interface ContextConfig {
  req: NextApiRequest;
  res: NextApiResponse;
}

const createContextInner = async ({ req, res }: ContextConfig) => {
  const session = await getServerSession<AuthOptions, Web3Session>(
    req,
    res,
    NEXT_AUTH_OPTIONS
  );

  const maestroKVClient = new MaestroKVClient(kv);
  const maestroPostgresClient = new MaestroPostgresClient(db);
  const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const axelarQueryClient = createAxelarQueryClient(NEXT_PUBLIC_NETWORK_ENV);

  const axelarConfigClient = createAxelarConfigClient(NEXT_PUBLIC_NETWORK_ENV);

  return {
    req,
    res,
    session,
    services: {
      gmp: gmpClient,
      axelarscan: axelarscanClient,
      axelarjsSDK: axelarjsSDKClient,
      axelarQuery: axelarQueryClient,
      openai: openaiClient,
    },
    configs: {
      /**
       * Cached accessor for EVM chain configs
       */
      evmChains: evmChains.bind(
        null,
        maestroKVClient,
        axelarscanClient,
        "evmChains" as const
      ),
      axelarConfigs: axelarConfigs.bind(
        null,
        maestroKVClient,
        axelarConfigClient,
        "axelarConfigs" as const
      ),
      wagmiChainConfigs: WAGMI_CHAIN_CONFIGS,
    },
    persistence: {
      /**
       * key-value store adapter
       */
      kv: maestroKVClient,
      /**
       * postgres adapter
       */
      postgres: maestroPostgresClient,
    },
    contracts: {
      createERC20Client(chain: Chain, address: `0x${string}`) {
        return new IERC20BurnableMintableClient({ chain, address });
      },
      createInterchainTokenClient(chain: Chain, address: `0x${string}`) {
        return new InterchainTokenClient({ chain, address });
      },
      createTokenManagerClient(chain: Chain, address: `0x${string}`) {
        return new TokenManagerClient({ chain, address });
      },
      createInterchainTokenServiceClient(
        chain: Chain,
        address?: `0x${string}`
      ) {
        return new InterchainTokenServiceClient({
          chain,
          address: address ?? NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
        });
      },
      createInterchainTokenFactoryClient(
        chain: Chain,
        address?: `0x${string}`
      ) {
        return new InterchainTokenFactoryClient({
          chain,
          address: address ?? NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS,
        });
      },
    },
  };
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = createContextInner;

export type Context = inferAsyncReturnType<typeof createContextInner>;

type EVMChainsMap = Record<
  string | number,
  {
    info: EVMChainConfig;
    wagmi: ExtendedWagmiChainConfig;
  }
>;

async function evmChains<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarscanClient: AxelarscanClient,
  cacheKey: TCacheKey
): Promise<EVMChainsMap> {
  const chainConfigs = await axelarscanClient.getChainConfigs();

  if (process.env.DISABLE_CACHE !== "true") {
    const cached = await kvClient.getCached<EVMChainsMap>(cacheKey);

    if (cached) {
      return cached;
    }
  }

  const eligibleChains = chainConfigs.evm.filter((chain) =>
    // filter out chains that are do not have a wagmi config
    WAGMI_CHAIN_CONFIGS.some((config) => config.id === chain.chain_id)
  );

  const evmChainsMap = eligibleChains.reduce(
    (acc, chain) => {
      const wagmiConfig = WAGMI_CHAIN_CONFIGS.find(
        (config) => config.id === chain.chain_id
      );

      // for type safety
      invariant(wagmiConfig, "wagmiConfig is required");

      const entry = {
        info: chain,
        wagmi: wagmiConfig,
      };

      return {
        ...acc,
        [chain.id]: entry,
        [chain.chain_id]: entry,
      };
    },
    {} as Record<
      string | number,
      {
        info: EVMChainConfig;
        wagmi: ExtendedWagmiChainConfig;
      }
    >
  );

  // cache for 1 hour
  await kvClient.setCached<EVMChainsMap>(cacheKey, evmChainsMap, 3600);

  return evmChainsMap;
}

async function axelarConfigs<TCacheKey extends string>(
  kvClient: MaestroKVClient,
  axelarConfigClient: AxelarConfigClient,
  cacheKey: TCacheKey
): Promise<any> {
  const chainConfigs = await axelarConfigClient.getChainConfigs(
    NEXT_PUBLIC_NETWORK_ENV
  );

  const cached = await kvClient.getCached<any>(cacheKey);

  if (cached) {
    return cached;
  }

  // cache for 1 hour
  await kvClient.setCached<any>(cacheKey, chainConfigs, 3600);

  return chainConfigs;
}
