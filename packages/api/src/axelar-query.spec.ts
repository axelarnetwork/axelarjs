import { ENVIRONMENTS } from "@axelarjs/core";

import { formatEther } from "viem";

import {
  AxelarQueryAPIClient,
  EstimateGasFeeParams,
  EstimateGasFeeResponse,
} from "./axelar-query";
import { createAxelarQueryNodeClient } from "./axelar-query/node";

describe("axelar-query", () => {
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
      api = createAxelarQueryNodeClient(ENVIRONMENTS.testnet, {});
    });

    test("It should return estimated gas amount in terms of native tokens", async () => {
      const fees = await api.estimateGasFee({
        ...requestParam,
        showDetailedFees: false,
      });
      expect(fees).toBeTruthy();
      expect(
        Number(formatEther(BigInt(fees as string))) - Number("0.0000001") > 0
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
