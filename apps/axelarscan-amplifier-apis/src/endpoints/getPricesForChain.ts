import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import feesAndPrices from "configs/feesAndPrices";
import getEnvironmentFromUrl from "utils";

import { Chain } from "../types";

export class ChainFetch extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Chains"],
    summary: "Get gas configs for a single chain by Amplifier chain ID",
    parameters: {
      amplifierChainId: Path(String, {
        description: "Amplifier chain id",
      }),
    },
    responses: {
      "200": {
        description:
          "Returns a single chain entry identified by Amplifier chain ID (if found)",
        schema: {
          success: Boolean,
          result: {
            chain: Chain,
          },
        },
      },
      "404": {
        description: "Chain not found",
        schema: {
          success: Boolean,
          error: String,
        },
      },
    },
  };

  handle(
    request: Request,
    env: unknown,
    context: unknown,
    data: Record<string, any>
  ) {
    const { amplifierChainId } = data.params;
    const environment = getEnvironmentFromUrl(request.url);
    const chains = feesAndPrices[environment] as (typeof Chain)[];
    const existing = chains.find(
      (chainConfig) => chainConfig.amplifierChainId === amplifierChainId
    );

    if (!existing) {
      return Response.json(
        {
          success: false,
          error:
            "Amplifier chain not found for this network. Please add to our configs if you would like",
        },
        {
          status: 404,
        }
      );
    }

    return {
      success: true,
      chain: existing,
    };
  }
}
