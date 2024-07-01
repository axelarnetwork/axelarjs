import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import feesAndPrices from "configs/feesAndPrices";

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

  async handle(
    request: Request,
    env: any,
    context: any,
    data: Record<string, any>
  ) {
    return {
      success: true,
      chains: feesAndPrices,
    };
  }
}
