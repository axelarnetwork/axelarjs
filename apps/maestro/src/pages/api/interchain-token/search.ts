import { Maybe } from "@axelarjs/utils";
import type { NextApiHandler } from "next";

import { TRPCError } from "@trpc/server";

import { createCaller } from "~/server/routers/_app";
import { inputSchema } from "~/server/routers/interchainToken/searchInterchainToken";

const handler: NextApiHandler = async (req, res) => {
  const trpc = await createCaller({ req, res });

  const { chainId, tokenAddress } = req.query;

  const parsedInput = inputSchema.safeParse({
    chainId: Maybe.of(chainId).mapOrUndefined(Number),
    tokenAddress,
  });

  if (parsedInput.success === false) {
    res
      .status(400)
      .json({ error: "Invalid input", details: parsedInput.error });
    return;
  }

  try {
    const result = await trpc.interchainToken.searchInterchainToken(
      parsedInput.data
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof TRPCError) {
      res.status(500).json({ error: error.message, cause: error.cause });
    }
  }
};

export default handler;
