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

import type { DeliverTxResponse } from "@cosmjs/stargate";
import { hashMessage } from "viem";

import { sendAxelarConfirmTx, type SendAxelarConfirmTxDependencies } from ".";
import {
  Event,
  Event_Status,
} from "../../../../../proto/build/module/axelar/evm/v1beta1/types";
import { ConfirmGatewayTxError } from "./error";
import * as Qualifier from "./qualifier";

describe("AxelarConfirmTx", () => {
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
  };
  let confirmDeps: SendAxelarConfirmTxDependencies;

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

  beforeEach(async () => {
    const axelarQueryRpcClient = await createAxelarRPCQueryClient({
      environment,
    });
    confirmDeps = {
      ...deps,
      axelarQueryRpcClient,
    };
  });

  test("should returns error if not reach finalized block", async () => {
    vitest.spyOn(Qualifier, "isBlockFinalized").mockResolvedValueOnce(false);

    const response = await sendAxelarConfirmTx(params, confirmDeps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.NOT_FINALIZED(txHash).message,
    });
  });

  test("should returns error if failed to fetch EVM event or event not found", async () => {
    vitest.spyOn(Qualifier, "isBlockFinalized").mockResolvedValueOnce(true);
    vitest
      .spyOn(confirmDeps.axelarQueryRpcClient.evm, "Event")
      .mockRejectedValueOnce(new Error("error"));

    const response = await sendAxelarConfirmTx(params, confirmDeps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.FAILED_FETCH_EVM_EVENT.message,
    });

    vitest.spyOn(Qualifier, "isBlockFinalized").mockResolvedValueOnce(true);
    vitest
      .spyOn(confirmDeps.axelarQueryRpcClient.evm, "Event")
      .mockResolvedValueOnce({ event: undefined });

    const response2 = await sendAxelarConfirmTx(params, confirmDeps);

    expect(response2).toMatchObject({
      skip: true,
      type: "axelar.confirm_gateway_tx",
      error: ConfirmGatewayTxError.EVM_EVENT_NOT_FOUND.message,
    });
  });

  test("should returns skip: true if the tx is already confirmed", async () => {
    vitest.spyOn(Qualifier, "isBlockFinalized").mockResolvedValueOnce(true);
    const confirmEvent = Event.create({
      chain: "test",
      txId: new Uint8Array(0),
      index: 1,
      status: Event_Status.STATUS_COMPLETED,
    });
    vitest
      .spyOn(confirmDeps.axelarQueryRpcClient.evm, "Event")
      .mockResolvedValueOnce({
        event: confirmEvent,
      });
    const response = await sendAxelarConfirmTx(params, confirmDeps);

    expect(response).toMatchObject({
      skip: true,
      type: "axelar.confirm_gateway_tx",
    });
  });

  test("should returns success if all conditions are met", async () => {
    vitest.spyOn(Qualifier, "isBlockFinalized").mockResolvedValueOnce(true);
    const confirmEvent = Event.create({
      chain: "test",
      txId: new Uint8Array(0),
      index: 1,
      status: Event_Status.STATUS_UNSPECIFIED,
    });
    vitest
      .spyOn(confirmDeps.axelarQueryRpcClient.evm, "Event")
      .mockResolvedValueOnce({
        event: confirmEvent,
      });

    const mockConfirm = vitest
      .spyOn(confirmDeps.axelarRecoveryApiClient, "confirm")
      .mockResolvedValueOnce({
        transactionHash: txHash,
        code: 0,
      } as DeliverTxResponse);

    const response = await sendAxelarConfirmTx(params, confirmDeps);

    expect(response).toMatchObject({
      skip: false,
      type: "axelar.confirm_gateway_tx",
      tx: {
        transactionHash: txHash,
      },
    });
    expect(mockConfirm).toHaveBeenCalledOnce();
  });
});
