import ky, { Options } from "ky";
import { beforeEach, describe, Mock, test, vi } from "vitest";

import {
  AxelarscanClient,
  GetAssetsPriceResponse,
  GetAssetsResponse,
  GetChainConfigsResponse,
} from ".";
import { CosmosChainConfig, EVMChainConfig } from "./types";

const mockOptions: Options = {
  // Add any required options here
};

const mockAxelarClient = new AxelarscanClient(mockOptions);

type Body =
  | { module: "data"; path: null; collection: string }
  | {
      module: "assets";
      path: null;
      denoms: string[];
    };

describe("AxelarscanClient", () => {
  beforeEach(() => {
    vi.mock("ky", () => {
      const postMockFn = (_path: string, body: { json: Body }) => {
        switch (body.json.module) {
          case "assets":
            // mock asset prices
            return {
              json: vi.fn().mockImplementation(() => []),
            };
          case "data":
            console.log("data", body.json.collection);
            if (body.json.collection === "chains") {
              return {
                json: vi.fn().mockImplementation(() => ({
                  evm: [
                    // Add sample EVMChainConfig data
                  ],
                  cosmos: [
                    // Add sample CosmosChainConfig data
                  ],
                })),
              };
            }
            // mock assets
            return {
              json: vi.fn().mockImplementation(() => []),
            };
          default:
            throw new Error("Invalid module");
        }
      };

      const post = vi.fn().mockImplementation(postMockFn);

      return {
        default: {
          post,
          extend: vi.fn().mockImplementation(() => ({ post })),
        },
      };
    });
  });

  test("getAssets", async ({ expect }) => {
    const denoms = ["denom1", "denom2"];
    const expectedResult: GetAssetsResponse = [];

    const result = await mockAxelarClient.getAssets({ denoms });
    expect(result).toEqual(expectedResult);
  });

  test("getAssetPrices", async ({ expect }) => {
    const denoms = ["denom1", "denom2"];
    const expectedResult: GetAssetsPriceResponse = [
      // Add sample response data
    ];

    const result = await mockAxelarClient.getAssetPrices({ denoms });
    expect(result).toEqual(expectedResult);
  });

  test("getChainConfigs", async ({ expect }) => {
    const isStaging = true;
    const disabledChains = ["chain1", "chain2"];
    const expectedResult: GetChainConfigsResponse = {
      evm: [
        // Add sample EVMChainConfig data
      ],
      cosmos: [
        // Add sample CosmosChainConfig data
      ],
    };

    const result = await mockAxelarClient.getChainConfigs({
      isStaging,
      disabledChains,
    });

    const filteredEVM = expectedResult.evm.filter(
      (chain: EVMChainConfig) =>
        (!chain?.is_staging || isStaging) && !disabledChains.includes(chain.id)
    );
    const filteredCosmos = expectedResult.cosmos.filter(
      (chain: CosmosChainConfig) =>
        (!chain?.is_staging || isStaging) && !disabledChains.includes(chain.id)
    );

    expect(result.evm).toEqual(filteredEVM);
    expect(result.cosmos).toEqual(filteredCosmos);
  });
});
