/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createAxelarConfigClient,
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
  createGMPClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";
import { createAxelarRPCQueryClient } from "@axelarjs/cosmos";

import { hashMessage, zeroAddress } from "viem";

import {
  sendEvmGatewayApproveTx,
  type SendEvmGatewayApproveTxDependencies,
} from ".";
import { GatewayApproveError } from "./error";

describe("EvmGatewayTx", () => {
  const environment = "testnet";
  const txHash = hashMessage("random tx hash");
  const destGatewayAddress = zeroAddress;
  const searchGMPData = {
    call: {
      transactionHash: txHash,
      blockNumber: 1,
      returnValues: {
        destinationChain: "test2",
      },
    },
  };

  const deps = {
    axelarscanClient: createAxelarscanClient(environment),
    axelarRecoveryApiClient: createAxelarRecoveryApiClient(environment),
    configClient: createAxelarConfigClient(environment),
    gmpClient: createGMPClient(environment),
    axelarQueryRpcClient: undefined,
  };

  const mockConfig = {
    chain_type: "evm" as const,
    id: "test",
    name: "Test",
    rpcUrl: "http://localhost:26657",
  };

  const params = {
    destChainConfig: mockConfig,
    searchGMPData: searchGMPData as SearchGMPResponseData,
  };
  let approveGatewayDeps: SendEvmGatewayApproveTxDependencies;

  beforeEach(async () => {
    const axelarQueryRpcClient = await createAxelarRPCQueryClient({
      environment,
    });
    approveGatewayDeps = {
      ...deps,
      axelarQueryRpcClient,
    };
  });

  test("should returns error if given rpc url not found", async () => {
    vitest
      .spyOn(approveGatewayDeps.axelarQueryRpcClient.evm, "GatewayAddress")
      .mockResolvedValueOnce({ address: destGatewayAddress });
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockRejectedValueOnce(new Error("search batched commands failed"));

    const response = await sendEvmGatewayApproveTx(
      {
        ...params,
        destChainConfig: {
          ...mockConfig,
          rpcUrl: undefined,
        },
      },
      approveGatewayDeps
    );

    expect(response).toMatchObject({
      skip: true,
      type: "evm.gateway_approve",
      error: GatewayApproveError.RPC_NOT_FOUND("test2").message,
    });
  });

  test("should returns error if cannot find executeData from batch response", async () => {
    vitest
      .spyOn(approveGatewayDeps.axelarQueryRpcClient.evm, "GatewayAddress")
      .mockResolvedValueOnce({ address: destGatewayAddress });
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [
          {
            execute_data: "",
          } as any,
        ],
      });

    const response = await sendEvmGatewayApproveTx(params, approveGatewayDeps);

    expect(response).toMatchObject({
      skip: true,
      type: "evm.gateway_approve",
      skipReason: "cannot find executeData from batch response",
    });
  });
});
