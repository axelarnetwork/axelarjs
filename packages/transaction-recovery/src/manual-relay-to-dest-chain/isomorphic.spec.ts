/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable @typescript-eslint/no-unsafe-assignment

import {
  createAxelarConfigClient,
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
  createGMPClient,
} from "@axelarjs/api";

import { manualRelayToDestChain as baseManualRelayToDestChain } from "./isomorphic";
import * as Recovery from "./lib/strategies";
import type { ManualRelayToDestChainParams } from "./types";

describe("manualRelayToDestChain", () => {
  const environment = "testnet";
  const txHash =
    "0x3f1175cee93c64b77297a4a4d929d50b7b5e7904a2e1c80d3ce7b61ab0776de2";
  const deps = {
    axelarscanClient: createAxelarscanClient(environment),
    axelarRecoveryApiClient: createAxelarRecoveryApiClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  };

  const manualRelayToDestChain = (params: ManualRelayToDestChainParams) =>
    baseManualRelayToDestChain(params, deps);

  const spySearchGMP = (sourceChain: string, destChain: string) => {
    vitest.spyOn(deps.gmpClient, "searchGMP").mockResolvedValueOnce([
      {
        call: {
          chain: sourceChain,
          __logIndex: 0,
          returnValues: {
            destinationChain: destChain,
          },
        },
      },
    ] as any);
  };

  describe("EvmToIBC", () => {
    test("should call recoverEvmToIbc tx when source chain is EVM chain, but destination chain is cosmos chain", async () => {
      const recover = vitest.spyOn(Recovery, "recoverEvmToIbc");
      recover.mockResolvedValueOnce([]);

      spySearchGMP("ethereum-sepolia", "terra-2");

      await manualRelayToDestChain({
        environment,
        txHash,
      });

      expect(recover).toHaveBeenCalledTimes(1);
    });
  });

  describe("IBCToEvm", () => {
    test("should call recoverIbcToEvm tx when source chain is cosmos chain, but destination chain is EVM chain", async () => {
      const recover = vitest.spyOn(Recovery, "recoverIbcToEvm");
      recover.mockResolvedValueOnce([]);

      spySearchGMP("dymension", "avalanche");

      await manualRelayToDestChain({
        environment,
        txHash,
      });

      expect(recover).toHaveBeenCalledTimes(1);
    });
  });

  describe("EvmToEvm", () => {
    test("should call recoverEvmToEvm tx when source chain and destination chain are EVM chains", async () => {
      const recover = vitest.spyOn(Recovery, "recoverEvmToEvm");
      recover.mockResolvedValueOnce([]);

      spySearchGMP("ethereum-sepolia", "avalanche");

      await manualRelayToDestChain({
        environment,
        txHash,
      });

      expect(recover).toHaveBeenCalledTimes(1);
    });
  });

  describe("IBCToIBC", () => {
    test("should call recoverIbctoIbc tx when source chain and destination chain are cosmos chains", async () => {
      const recover = vitest.spyOn(Recovery, "recoverIbcToIbc");
      recover.mockResolvedValueOnce([]);

      spySearchGMP("dymension", "terra-2");

      await manualRelayToDestChain({
        environment,
        txHash,
      });

      expect(recover).toHaveBeenCalledTimes(1);
    });
  });
});
