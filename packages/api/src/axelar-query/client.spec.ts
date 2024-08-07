import { ENVIRONMENTS } from "@axelarjs/core";

import { formatEther } from "viem";

import type {
  AxelarQueryAPIClient,
  EstimateGasFeeParams,
  EstimateGasFeeResponse,
  EvmChain,
} from "../axelar-query";
import { CHAINS } from "./chains";
import { createAxelarQueryClient } from "./client";
import { activeChainsStub } from "./stubs";

describe("axelar-query (node client)", () => {
  const testnetApi: AxelarQueryAPIClient = createAxelarQueryClient(
    ENVIRONMENTS.testnet,
    {}
  );

  describe("estimateGasFee", () => {
    const requestParam: EstimateGasFeeParams = {
      sourceChain: "ethereum",
      destinationChain: "avalanche",
      gasLimit: 700_000n,
      gasMultiplier: 1.1,
      sourceContractAddress: undefined,
      destinationContractAddress: undefined,
      amount: 1,
      amountInUnits: "1000000",
    };

    let mainnetApi: AxelarQueryAPIClient;

    beforeEach(() => {
      mainnetApi = createAxelarQueryClient(ENVIRONMENTS.mainnet, {});
    });

    test("It should return estimated gas amount in terms of native tokens", async () => {
      const fees = await mainnetApi.estimateGasFee({
        ...requestParam,
        showDetailedFees: false,
      });

      expect(fees).toBeTruthy();
      expect(
        Number(formatEther(BigInt(fees as string))) - Number("0.0000001") > 0
      );
    });

    test("It should include the L1 gas fee", async () => {
      const l2RequestParams: EstimateGasFeeParams = {
        sourceChain: "ethereum",
        destinationChain: "optimism",
        gasLimit: 700_000n,
        gasMultiplier: 1.1,
        amount: 1,
        amountInUnits: "1000000",
      };

      const fees = (await mainnetApi.estimateGasFee({
        ...l2RequestParams,
        showDetailedFees: true,
      })) as EstimateGasFeeResponse;

      const l1ExecutionFeeWithMultiplier = BigInt(
        fees.l1ExecutionFeeWithMultiplier
      );
      const l1ExecutionFee = BigInt(fees.l1ExecutionFee);
      const executionFee = BigInt(fees.executionFee);
      const executionFeeWithMultiplier = BigInt(
        fees.executionFeeWithMultiplier
      );

      expect(fees).toBeTruthy();
      expect(l1ExecutionFeeWithMultiplier).toBeGreaterThan(l1ExecutionFee);
      expect(executionFeeWithMultiplier).toBeGreaterThan(executionFee);
    });

    test("It should return a detailed object response with the components of the fee", async () => {
      const res: EstimateGasFeeResponse = (await mainnetApi.estimateGasFee({
        ...requestParam,
        showDetailedFees: true,
      })) as EstimateGasFeeResponse;
      expect(res).toBeTruthy();
      expect(res.baseFee).toBeTruthy();
    });
  });

  describe("getNativeGasBaseFee", () => {
    test("It should return base fee for a certain source chain / destination chain combination", async () => {
      vitest
        .spyOn(testnetApi, "getActiveChains")
        .mockResolvedValueOnce(activeChainsStub());
      const gasResult = await testnetApi.getNativeGasBaseFee(
        CHAINS.TESTNET.AVALANCHE as EvmChain,
        CHAINS.TESTNET.SEPOLIA as EvmChain
      );
      expect(gasResult.success).toBeTruthy();
      expect(gasResult.baseFee).toBeDefined();
      expect(gasResult.error).toBeUndefined();
    });
  });

  describe("getDenomFromSymbol", () => {
    test("should return the correct denom for a given symbol", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);
      const denom = await api.getDenomFromSymbol("USDC", "ethereum");
      expect(denom).toBe("uusdc");
    });

    test("cache should work properly", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);
      await api.getDenomFromSymbol("USDC", "ethereum");
      expect(api["cachedChainConfig"]).toBeDefined();
    });

    test("should throw error if symbol is not found", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);

      await expect(async () => {
        await api.getDenomFromSymbol("!@#$", "avalanche");
      }).rejects.toThrow();
    });

    test("should throw error if chain is not found", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);
      await expect(async () => {
        await api.getDenomFromSymbol("USDC", "!@#$");
      }).rejects.toThrow();
    });
  });

  describe("getSymbolFromDenom", () => {
    test("should return the correct denom for a given symbol", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);
      const denom = await api.getSymbolFromDenom("uusdc", "ethereum");
      expect(denom).toBe("USDC");
    });

    test("cache should work properly", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);
      await api.getSymbolFromDenom("uusdc", "ethereum");
      expect(api["cachedChainConfig"]).toBeDefined();
    });

    test("should throw error if symbol is not found", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);

      await expect(async () => {
        await api.getSymbolFromDenom("!@#$", "avalanche");
      }).rejects.toThrow();
    });

    test("should throw error if chain is not found", async () => {
      const api = createAxelarQueryClient(ENVIRONMENTS.mainnet);
      await expect(async () => {
        await api.getSymbolFromDenom("uusdc", "!@#$");
      }).rejects.toThrow();
    });
  });
});
