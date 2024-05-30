/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createAxelarConfigClient,
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
  createGMPClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";

import { hashMessage } from "viem";

import { sendAxelarSignTx } from ".";
import { SignCommandsError } from "./error";

describe("AxelarSignTx", () => {
  const environment = "testnet";
  const txHash = hashMessage("random tx hash");
  const searchGMPData = {
    call: {
      transactionHash: txHash,
      blockNumber: 1,
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
    srcChainConfig: mockConfig,
    searchGMPData: searchGMPData as SearchGMPResponseData,
  };

  test("should returns error if cannot search batched commands", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockRejectedValueOnce(new Error("search batched commands failed"));

    const response = await sendAxelarSignTx(params, deps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.sign_commands",
      error: SignCommandsError.SEARCH_BATCH_COMMANDS_FAILED.message,
    });
  });

  test("should skip if batched commands are empty", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({ data: [] });

    const response = await sendAxelarSignTx(params, deps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.sign_commands",
    });
  });

  test("should skip if batched commands are already executed", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [
          {
            commands: [
              {
                executed: true,
              },
            ],
          },
        ],
      } as any);

    const response = await sendAxelarSignTx(params, deps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.sign_commands",
      error: SignCommandsError.ALREADY_EXECUTED.message,
    });
  });

  test("should returns error if failed to sign commands", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [
          {
            commands: [],
          },
        ],
      } as any);

    vitest
      .spyOn(deps.axelarRecoveryApiClient, "signCommands")
      .mockResolvedValueOnce({
        code: 1,
      } as any);

    const response = await sendAxelarSignTx(params, deps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.sign_commands",
      error: SignCommandsError.SIGN_COMMANDS_FAILED.message,
    });
  });

  test("should returns success if all conditions are met", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [
          {
            commands: [],
          },
        ],
      } as any);

    vitest
      .spyOn(deps.axelarRecoveryApiClient, "signCommands")
      .mockResolvedValueOnce({
        code: 0,
        transactionHash: txHash,
      } as any);

    const response = await sendAxelarSignTx(params, deps);

    expect(response).toMatchObject({
      skip: false,
      type: "axelar.sign_commands",
      tx: {
        hash: txHash,
      },
    });
  });
});
