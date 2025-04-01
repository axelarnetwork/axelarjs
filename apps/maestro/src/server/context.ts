import {
  createAxelarConfigClient,
  createAxelarQueryClient,
} from "@axelarjs/api";
import {
  IERC20BurnableMintableClient,
  InterchainTokenClient,
  InterchainTokenFactoryClient,
  InterchainTokenServiceClient,
  TokenManagerClient,
} from "@axelarjs/evm";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, type AuthOptions } from "next-auth";

import { kv } from "@vercel/kv";
import OpenAI from "openai";
import type { Chain } from "viem";

import {
  NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
  NEXT_PUBLIC_NETWORK_ENV,
} from "~/config/env";
import { NEXT_AUTH_OPTIONS, type Web3Session } from "~/config/next-auth";
import { CHAIN_CONFIGS } from "~/config/chains";
import db from "~/lib/drizzle/client";
import axelarjsSDKClient from "~/services/axelarjsSDK";
import axelarscanClient from "~/services/axelarscan";
import MaestroKVClient from "~/services/db/kv";
import MaestroPostgresClient from "~/services/db/postgres";
import gmpClient from "~/services/gmp";
import { axelarConfigs, evmChains, vmChains, chains } from "./utils";

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

  const networkEnv = NEXT_PUBLIC_NETWORK_ENV

  const axelarQueryClient = createAxelarQueryClient(networkEnv);
  const axelarConfigClient = createAxelarConfigClient(networkEnv);

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
       * Cached accessor for chain configs
       */
      evmChains: evmChains.bind(
        null,
        maestroKVClient,
        axelarConfigClient,
        "chains-evm" as const
      ),
      vmChains: vmChains.bind(
        null,
        maestroKVClient,
        axelarConfigClient,
        "chains-vm" as const
      ),
      chains: chains.bind(null, maestroKVClient, axelarscanClient, "chains" as const),
      axelarConfigs: axelarConfigs.bind(
        null,
        maestroKVClient,
        axelarConfigClient,
        "axelarConfigs" as const
      ),
      // TODO: rename this to chainConfigs
      wagmiChainConfigs: CHAIN_CONFIGS,
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
      createERC20Client(chain: Chain, address: string) {
        return new IERC20BurnableMintableClient({
          chain,
          address: address as `0x${string}`,
        });
      },
      createInterchainTokenClient(chain: Chain, address: `0x${string}`) {
        return new InterchainTokenClient({ chain, address });
      },
      createTokenManagerClient(chain: Chain, address: string) {
        return new TokenManagerClient({
          chain,
          address: address as `0x${string}`,
        });
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

export type Context = Awaited<ReturnType<typeof createContextInner>>;
