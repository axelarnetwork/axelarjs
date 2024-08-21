import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import feesAndPrices from "configs/feesAndPrices";
import getEnvironmentFromUrl from "utils";

import { Chain } from "../types";

export class ChainList extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Chains"],
    summary:
      "All supported Amplifier chains with approval cost and gas price constants",
    parameters: {
      page: Query(Number, {
        description: "Page number",
        default: 0,
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of chains and their gas prices",
        schema: {
          success: Boolean,
          result: {
            chains: [Chain],
          },
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
    const environment = getEnvironmentFromUrl(request.url) as string;
    const chains = feesAndPrices[environment] as (typeof Chain)[];
    return {
      success: true,
      chains: chains,
    };
  }
}
