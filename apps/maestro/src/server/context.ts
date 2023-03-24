import { inferAsyncReturnType } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";

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
  };
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = createContextInner;

export type Context = inferAsyncReturnType<typeof createContextInner>;
