import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "./routers/_app";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Intercahin Maestro API",
  description: "Interchain Maestro API, search interchain tokens",
  version: "1.0.0",
  baseUrl: `${
    process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"
  }/api`,
  docsUrl: "https://github.com/axelarnetwork/axelarjs/tree/main/apps/maestro",
  tags: ["interchain-token"],
});
