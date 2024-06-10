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

import { type SendEvmGatewayApproveTxDependencies } from ".";
import * as Helper from "../helper";
import { GatewayApproveError } from "./error";
import { sendEvmGatewayApproveTx } from "./index";
import * as EvmClient from "./txHelper";

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
            command_ids: ["0x1"],
            execute_data: "",
            status: "BATCHED_COMMANDS_STATUS_SIGNED",
          } as any,
        ],
      });

    const response = await sendEvmGatewayApproveTx(params, approveGatewayDeps);

    expect(response).toMatchObject({
      skip: true,
      type: "evm.gateway_approve",
      error: GatewayApproveError.EXECUTE_DATA_NOT_FOUND.message,
    });
  });

  test("should returns error if reach max retries for search batch commands", async () => {
    const maxRetriesError = new Error("max retries");
    vitest
      .spyOn(approveGatewayDeps.axelarQueryRpcClient.evm, "GatewayAddress")
      .mockResolvedValueOnce({ address: destGatewayAddress });
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [
          {
            commands_ids: ["0x1"],
            execute_data: "",
            status: "UNKNOWN",
          } as any,
        ],
      });

    vitest.spyOn(Helper, "retry").mockRejectedValueOnce(maxRetriesError);

    const response = await sendEvmGatewayApproveTx(params, approveGatewayDeps);

    expect(response).toMatchObject({
      skip: true,
      type: "evm.gateway_approve",
      error: GatewayApproveError.FAILED_TX(maxRetriesError).message,
    });
  });

  test("should send approve gateway tx if executeData is found", async () => {
    vitest
      .spyOn(approveGatewayDeps.axelarQueryRpcClient.evm, "GatewayAddress")
      .mockResolvedValueOnce({ address: destGatewayAddress });
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [
          {
            execute_data: "0x",
            command_ids: ["0x1"],
            status: "BATCHED_COMMANDS_STATUS_SIGNED",
          } as any,
        ],
      });
    vitest.spyOn(EvmClient, "executeApproveTx").mockResolvedValueOnce(txHash);
    const response = await sendEvmGatewayApproveTx(params, approveGatewayDeps);
    expect(response).toMatchObject({
      skip: false,
      type: "evm.gateway_approve",
      tx: {
        transactionHash: txHash,
      },
    });
  });
});
