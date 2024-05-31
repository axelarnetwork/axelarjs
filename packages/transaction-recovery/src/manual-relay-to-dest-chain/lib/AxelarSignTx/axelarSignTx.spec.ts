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
import { SignCommandsError, SignCommandsSkipReason } from "./constants";

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

  test("should call signCommands if there's error inside search batched commands", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockRejectedValueOnce(new Error("search batched commands failed"));

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

  test("should send sign commands tx if batched commands are empty", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({ data: [] });

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
      skipReason: SignCommandsSkipReason.ALREADY_EXECUTED,
    });
  });

  test("should returns error if failed to sign commands", async () => {
    vitest
      .spyOn(deps.axelarscanClient, "searchBatchedCommands")
      .mockResolvedValueOnce({
        data: [],
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
});
