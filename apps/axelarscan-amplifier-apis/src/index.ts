import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";

import { ChainList } from "./endpoints/gasPricesAllChains";
import { ChainFetch } from "./endpoints/getPricesForChain";

export const router = OpenAPIRouter({
  docs_url: "/",
});

router.get("/api/mainnet/gasPrices/", ChainList);
router.get("/api/testnet/gasPrices/", ChainList);
router.get("/api/devnet-verifiers/gasPrices/", ChainList);
router.get("/api/devnet-amplifier/gasPrices/", ChainList);
router.get("/api/stagenet/gasPrices/", ChainList);

router.get("/api/mainnet/gasPrices/:amplifierChainId/", ChainFetch);
router.get("/api/testnet/gasPrices/:amplifierChainId/", ChainFetch);
router.get("/api/devnet-verifiers/gasPrices/:amplifierChainId/", ChainFetch);
router.get("/api/devnet-amplifier/gasPrices/:amplifierChainId/", ChainFetch);
router.get("/api/stagenet/gasPrices/:amplifierChainId/", ChainFetch);

// 404 for everything else
router.all("*", () =>
  Response.json(
    {
      success: false,
      error: "Route not found",
    },
    { status: 404 }
  )
);

// @ts-ignore
export default {
  fetch: router.handle,
};
