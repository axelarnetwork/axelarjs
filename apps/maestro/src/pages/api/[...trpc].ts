import type { NextApiRequest, NextApiResponse } from "next";
import cors from "nextjs-cors";

import { createOpenApiNextHandler } from "trpc-openapi";

import { createContext } from "~/server/context";
import { appRouter } from "~/server/routers/_app";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Setup CORS
  await cors(req, res);

  // Handle incoming OpenAPI requests
  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
  })(req, res);
};

export default handler;
