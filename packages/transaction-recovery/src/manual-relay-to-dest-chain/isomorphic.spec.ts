/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable @typescript-eslint/no-unsafe-assignment

import {
  createAxelarConfigClient,
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
  createGMPClient,
} from "@axelarjs/api";

import { manualRelayToDestChain as baseManualRelayToDestChain } from "./isomorphic";
import * as Recovery from "./lib/recovery";
import type { ManualRelayToDestChainParams } from "./types";

describe("manualRelayToDestChain", () => {
  const environment = "testnet";
  const deps = {
    axelarscanClient: createAxelarscanClient(environment),
    axelarRecoveryApiClient: createAxelarRecoveryApiClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  };

  const manualRelayToDestChain = (params: ManualRelayToDestChainParams) =>
    baseManualRelayToDestChain(params, deps);

  describe("EvmToIBC", () => {
    test("should call recoverEvmToIbc tx when source chain is EVM chain, but destination chain is cosmos chain", async () => {
      const r = vitest.spyOn(Recovery, "recoverEvmToIbc");
      r.mockResolvedValueOnce([]);

      vitest.spyOn(deps.gmpClient, "searchGMP").mockResolvedValueOnce([
        {
          call: {
            chain: "ethereum-sepolia",
            __logIndex: 0,
            returnValues: {
              destinationChain: "dymension",
            },
          },
        },
      ] as any);

      await manualRelayToDestChain({
        environment: "mainnet",
        txHash:
          "0x3f1175cee93c64b77297a4a4d929d50b7b5e7904a2e1c80d3ce7b61ab0776de2",
      });

      expect(r).toHaveBeenCalledTimes(1);
    });
  });

  describe("IBCToEvm", () => {
    test("should call recoverIbcToEvm tx when source chain is cosmos chain, but destination chain is EVM chain", async () => {
      const r = vitest.spyOn(Recovery, "recoverIbcToEvm");
      r.mockResolvedValueOnce([]);

      vitest.spyOn(deps.gmpClient, "searchGMP").mockResolvedValueOnce([
        {
          call: {
            chain: "dymension",
            __logIndex: 0,
            returnValues: {
              destinationChain: "avalanche",
            },
          },
        },
      ] as any);

      await manualRelayToDestChain({
        environment,
        txHash:
          "0x3f1175cee93c64b77297a4a4d929d50b7b5e7904a2e1c80d3ce7b61ab0776de2",
      });

      expect(r).toHaveBeenCalledTimes(1);
    });
  });

  describe("EvmToEvm", () => {
    test("should call recoverEvmToEvm tx when source chain and destination chain are EVM chains", async () => {
      const r = vitest.spyOn(Recovery, "recoverEvmToEvm");
      r.mockResolvedValueOnce([]);

      vitest.spyOn(deps.gmpClient, "searchGMP").mockResolvedValueOnce([
        {
          call: {
            chain: "ethereum-sepolia",
            __logIndex: 0,
            returnValues: {
              destinationChain: "avalanche",
            },
          },
        },
      ] as any);

      await manualRelayToDestChain({
        environment,
        txHash:
          "0x3f1175cee93c64b77297a4a4d929d50b7b5e7904a2e1c80d3ce7b61ab0776de2",
      });

      expect(r).toHaveBeenCalledTimes(1);
    });
  });

  describe("IBCToIBC", () => {
    test("should call recoverIbctoIbc tx when source chain and destination chain are cosmos chains", async () => {
      const r = vitest.spyOn(Recovery, "recoverIbcToIbc");
      r.mockResolvedValueOnce([]);

      vitest.spyOn(deps.gmpClient, "searchGMP").mockResolvedValueOnce([
        {
          call: {
            chain: "dymension",
            __logIndex: 0,
            returnValues: {
              destinationChain: "terra-2",
            },
          },
        },
      ] as any);

      await manualRelayToDestChain({
        environment,
        txHash:
          "0x3f1175cee93c64b77297a4a4d929d50b7b5e7904a2e1c80d3ce7b61ab0776de2",
      });

      expect(r).toHaveBeenCalledTimes(1);
    });
  });
});
