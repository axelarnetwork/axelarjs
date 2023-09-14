import { generateOpenApiDocument } from "trpc-openapi";

import { getBaseUrl } from "~/lib/trpc";
import { appRouter } from "./routers/_app";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Interchain Token Service API",
  description: "Interchain Token Service API, search interchain tokens",
  version: "1.0.0",
  baseUrl: `${getBaseUrl()}/api`,
  docsUrl: "https://github.com/axelarnetwork/axelarjs/tree/main/apps/maestro",
  tags: ["interchain-token", "abi", "gmp"],
});
