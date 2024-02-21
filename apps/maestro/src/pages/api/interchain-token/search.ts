import type { NextApiHandler } from "next";

import { hex40Literal } from "~/lib/utils/validation";
import { createCaller } from "~/server/routers/_app";

const handler: NextApiHandler = async (req, res) => {
  const trpc = await createCaller({ req, res });

  const { chainId, tokenAddress } = req.query;

  const parsedTokenAddress = hex40Literal().safeParse(tokenAddress);

  if (isNaN(Number(chainId)) || parsedTokenAddress.success === false) {
    res.status(400).json({ error: "Invalid chainId or tokenAddress" });
    return;
  }

  return await trpc.interchainToken.searchInterchainToken({
    chainId: Number(chainId),
    tokenAddress: parsedTokenAddress.data,
  });
};

export default handler;
