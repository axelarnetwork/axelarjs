import { inferAsyncReturnType } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";

import axelarscanClient from "~/lib/api/axelarscan";
import gmpClient from "~/lib/api/gmp";

type ContextConfig = {
  req: NextApiRequest;
  res: NextApiResponse<unknown>;
};

const createContextInner = async ({ req, res }: ContextConfig) => {
  return {
    req,
    res,
    clients: {
      gmp: gmpClient,
      axelarscan: axelarscanClient,
    },
  };
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = createContextInner;

export type Context = inferAsyncReturnType<typeof createContextInner>;
