/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable @typescript-eslint/no-unsafe-assignment

import {
  createAxelarConfigClient,
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
  createGMPClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";
import { createAxelarRPCQueryClient } from "@axelarjs/cosmos";

import { hashMessage } from "viem";

import { sendAxelarConfirmTx } from ".";
import { ConfirmGatewayTxError } from "./error";
import * as Qualifier from "./qualifier";

describe("AxelarConfirmTx", () => {
  const environment = "testnet";
  const txHash = hashMessage("random tx hash");

  const deps = {
    axelarscanClient: createAxelarscanClient(environment),
    axelarRecoveryApiClient: createAxelarRecoveryApiClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
  };
  const mockConfig = {
    chain_type: "evm" as const,
    id: "test",
    name: "Test",
    rpcUrl: "http://localhost:26657",
  };

  test.only("should returns error if not reach finalized block", async () => {
    const axelarQueryRpcClient = await createAxelarRPCQueryClient({
      environment,
    });

    const searchGMPData = {
      call: {
        transactionHash: txHash,
        blockNumber: 1,
      },
    };

    vitest.spyOn(Qualifier, "isBlockFinalized").mockResolvedValueOnce(false);

    const response = await sendAxelarConfirmTx(
      {
        searchGMPData: searchGMPData as SearchGMPResponseData,
        srcChainConfig: mockConfig,
      },
      {
        ...deps,
        axelarQueryRpcClient,
      }
    );

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.NOT_FINALIZED(txHash).message,
    });
  });
});
