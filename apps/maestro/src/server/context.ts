import {
  ERC20Client,
  InterchainTokenClient,
  InterchainTokenServiceClient,
  TokenManagerClient,
} from "@axelarjs/evm";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, type AuthOptions } from "next-auth";

import type { inferAsyncReturnType } from "@trpc/server";
import { kv } from "@vercel/kv";
import type { Chain } from "wagmi";

import { NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS } from "~/config/env";
import { nextAuthOptions, type Session } from "~/config/next-auth";
import axelarjsSDKClient from "~/services/axelarjsSDK";
import axelarscanClient from "~/services/axelarscan";
import gmpClient from "~/services/gmp";
import MaestroKVClient from "~/services/kv";

type ContextConfig = {
  req: NextApiRequest;
  res: NextApiResponse<unknown>;
};

const createContextInner = async ({ req, res }: ContextConfig) => {
  const session = await getServerSession<AuthOptions, Session>(
    req,
    res,
    nextAuthOptions
  );

  return {
    req,
    res,
    session,
    services: {
      gmp: gmpClient,
      axelarscan: axelarscanClient,
      axelarjsSDK: axelarjsSDKClient,
    },
    storage: {
      kv: new MaestroKVClient(kv),
    },
    contracts: {
      createERC20Client(chain: Chain, address: `0x${string}`) {
        return new ERC20Client({ chain, address });
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
    },
  };
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = createContextInner;

export type Context = inferAsyncReturnType<typeof createContextInner>;
