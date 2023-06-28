import {
  ERC20Client,
  InterchainTokenClient,
  InterchainTokenServiceClient,
} from "@axelarjs/evm";
import type { NextApiRequest, NextApiResponse } from "next";

import type { inferAsyncReturnType } from "@trpc/server";
import type { Chain } from "wagmi";

import { NEXT_PUBLIC_TOKEN_LINKER_ADDRESS } from "~/config/env";
import axelarjsSDKClient from "~/services/axelarjsSDK";
import axelarscanClient from "~/services/axelarscan";
import gmpClient from "~/services/gmp";

type ContextConfig = {
  req: NextApiRequest;
  res: NextApiResponse<unknown>;
};

const createContextInner = async ({ req, res }: ContextConfig) => {
  return {
    req,
    res,
    services: {
      gmp: gmpClient,
      axelarscan: axelarscanClient,
      axelarjsSDK: axelarjsSDKClient,
    },
    contracts: {
      createERC20Client(chain: Chain, address: `0x${string}`) {
        return new ERC20Client({ chain, address });
      },
      createInterchainTokenClient(chain: Chain, address: `0x${string}`) {
        return new InterchainTokenClient({ chain, address });
      },
      createInterchainTokenServiceClient(
        chain: Chain,
        address?: `0x${string}`
      ) {
        return new InterchainTokenServiceClient({
          chain,
          address: address ?? NEXT_PUBLIC_TOKEN_LINKER_ADDRESS,
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
