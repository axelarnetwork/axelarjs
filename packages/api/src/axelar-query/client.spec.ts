import { ENVIRONMENTS } from "@axelarjs/core";

import { formatEther, pad } from "viem";

import type {
  AxelarQueryAPIClient,
  EstimateGasFeeParams,
  EstimateGasFeeResponse,
} from "../axelar-query";
import { createAxelarQueryClient } from "./client";

describe("axelar-query (node client)", () => {
  describe("estimateGasFee", () => {
    const requestParam: EstimateGasFeeParams = {
      sourceChain: "ethereum-2",
      destinationChain: "avalanche",
      gasLimit: 700_000n,
      gasMultiplier: 1.1,
      sourceContractAddress: undefined,
      destinationContractAddress: undefined,
      amount: 1,
      amountInUnits: "1000000",
    };

    let api: AxelarQueryAPIClient;

    beforeEach(() => {
      api = createAxelarQueryClient(ENVIRONMENTS.testnet, {});
    });

    test("It should return estimated gas amount in terms of native tokens", async () => {
      const fees = await api.estimateGasFee({
        ...requestParam,
        showDetailedFees: false,
      });

      expect(fees).toBeTruthy();
      expect(
        Number(formatEther(BigInt(fees as string))) - Number("0.0000001") > 0,
      );
    });

    test.skip("It should include the L1 gas fee", async () => {
      const l2RequestParams: EstimateGasFeeParams = {
        sourceChain: "avalanche",
        destinationChain: "optimism",
        gasLimit: 700_000n,
        gasMultiplier: 1.1,
        executeData: pad("0x1234", { size: 5000 }),
        amount: 1,
        amountInUnits: "1000000",
      };

      const fees = (await api.estimateGasFee({
        ...l2RequestParams,
        showDetailedFees: true,
      })) as EstimateGasFeeResponse;

      const l1ExecutionFeeWithMultiplier = parseInt(
        fees.l1ExecutionFeeWithMultiplier,
      );
      const executionFeeWithMultiplier = parseInt(
        fees.executionFeeWithMultiplier,
      );

      expect(fees).toBeTruthy();
      expect(l1ExecutionFeeWithMultiplier).toBeGreaterThan(
        executionFeeWithMultiplier,
      );
    });

    test("it should throw an error if the destination chain is L2 but not specified the executeData", async () => {
      const l2RequestParams: EstimateGasFeeParams = {
        sourceChain: "ethereum-2",
        destinationChain: "optimism",
        gasLimit: 700_000n,
        gasMultiplier: 1.1,
        amount: 1,
        amountInUnits: "1000000",
      };

      await expect(
        api.estimateGasFee({
          ...l2RequestParams,
          showDetailedFees: true,
        }),
      ).rejects.toThrowError(
        "executeData is required to calculate the L1 execution fee for optimism",
      );
    });

    test("It should return a detailed object response with the components of the fee", async () => {
      const res: EstimateGasFeeResponse = (await api.estimateGasFee({
        ...requestParam,
        showDetailedFees: true,
      })) as EstimateGasFeeResponse;
      expect(res).toBeTruthy();
      expect(res.baseFee).toBeTruthy();
    });
  });
});
