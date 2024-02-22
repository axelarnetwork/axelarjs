import type { NextApiHandler } from "next";

import { openApiDocument } from "~/server/openapi";

const handler: NextApiHandler = (_req, res) =>
  res.status(200).send(openApiDocument);

export default handler;
