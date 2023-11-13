import {
  IERC20BurnableMintableClient,
  InterchainTokenClient,
  InterchainTokenFactoryClient,
  InterchainTokenServiceClient,
  TokenManagerClient,
} from "@axelarjs/evm";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, type AuthOptions } from "next-auth";

import type { inferAsyncReturnType } from "@trpc/server";
import { kv } from "@vercel/kv";
import OpenAI from "openai";
import type { Chain } from "wagmi";

import {
  NEXT_PUBLIC_INTERCHAIN_TOKEN_FACTORY_ADDRESS,
  NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS,
} from "~/config/env";
import { NEXT_AUTH_OPTIONS, type Web3Session } from "~/config/next-auth";
import db from "~/lib/drizzle/client";
import axelarjsSDKClient from "~/services/axelarjsSDK";
import axelarscanClient from "~/services/axelarscan";
import MaestroKVClient from "~/services/db/kv";
import MaestroPostgresClient from "~/services/db/postgres";
import gmpClient from "~/services/gmp";

type ContextConfig = {
  req: NextApiRequest;
  res: NextApiResponse<unknown>;
};

const createContextInner = async ({ req, res }: ContextConfig) => {
  const session = await getServerSession<AuthOptions, Web3Session>(
    req,
    res,
    NEXT_AUTH_OPTIONS
  );

  return {
    req,
    res,
    session,
    services: {
      gmp: gmpClient,
      axelarscan: axelarscanClient,
      axelarjsSDK: axelarjsSDKClient,
      openai: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
    },
    persistence: {
      /**
       * key-value store adapter
       */
      kv: new MaestroKVClient(kv),
      /**
       * postgres adapter
       */
      postgres: new MaestroPostgresClient(db),
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
