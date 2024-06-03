import {
  createAxelarConfigClient,
  createAxelarRecoveryApiClient,
  createAxelarscanClient,
  createGMPClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";
import { createAxelarRPCQueryClient } from "@axelarjs/cosmos";

import { hashMessage } from "viem";

import * as ConfirmTx from "../AxelarConfirmTx";
import * as RouteTx from "../AxelarRouteMessageTx";
import * as SignTx from "../AxelarSignTx";
import * as GatewayApproveTx from "../EvmGatewayApproveTx";
import { recoverEvmToEvm } from "./recoverEvmToEvm";
import { recoverEvmToIbc } from "./recoverEvmToIbc";
import { recoverIbcToEvm } from "./recoverIbcToEvm";
import { recoverIbcToIbc } from "./recoverIbcToIbc";
import type { RecoveryDependencies } from "./types";

export type ChainConfig = {
  chain_type: "evm" | "cosmos";
  id: string;
  name: string;
  rpcUrl?: string | undefined;
};
describe("recovery", () => {
  const environment = "testnet";
  const srcChainConfig = {
    chain_type: "evm" as const,
    id: "eth",
    name: "eth",
  };
  const destChainConfig = {
    chain_type: "evm" as const,
    id: "polygon",
    name: "polygon",
  };
  const searchGMPData = {
    call: {
      transactionHash: "0x123",
      blockNumber: 1,
      returnValues: {
        destinationChain: "test2",
      },
    },
  };
  let deps: RecoveryDependencies;

  beforeEach(async () => {
    const axelarQueryRpcClient = await createAxelarRPCQueryClient({
      environment,
    });

    deps = {
      axelarscanClient: createAxelarscanClient(environment),
      axelarRecoveryApiClient: createAxelarRecoveryApiClient(environment),
      configClient: createAxelarConfigClient(environment),
      gmpClient: createGMPClient(environment),
      axelarQueryRpcClient,
    };
  });

  test("recoverEvmToEvm: should return only [confirm] response if there's an error at the confirm step", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
    };
    const mockConfirmTx = {
      skip: true,
      type: "axelar.confirm_gateway_tx" as const,
      error: "cannot confirm tx",
    };
    vitest
      .spyOn(ConfirmTx, "sendAxelarConfirmTx")
      .mockResolvedValueOnce(mockConfirmTx);

    const result = await recoverEvmToEvm(params, deps);

    expect(result).toEqual([mockConfirmTx]);
  });

  test("recoverEvmToEvm: should return [confirm] response if escapeAfterConfirm is true", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
      escapeAfterConfirm: true,
    };
    const mockConfirmTx = {
      skip: false,
      type: "axelar.confirm_gateway_tx" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    vitest
      .spyOn(ConfirmTx, "sendAxelarConfirmTx")
      .mockResolvedValueOnce(mockConfirmTx);

    const result = await recoverEvmToEvm(params, deps);

    expect(result).toEqual([mockConfirmTx]);
  });

  test("recoveryEvmToEvm: should return [confirm, sign] response if there's an error at the sign step", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
    };
    const mockConfirmTx = {
      skip: false,
      type: "axelar.confirm_gateway_tx" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockSignTx = {
      skip: true,
      type: "axelar.sign_commands" as const,
      error: "cannot sign tx",
    };
    vitest
      .spyOn(ConfirmTx, "sendAxelarConfirmTx")
      .mockResolvedValueOnce(mockConfirmTx);
    vitest.spyOn(SignTx, "sendAxelarSignTx").mockResolvedValueOnce(mockSignTx);

    const result = await recoverEvmToEvm(params, deps);

    expect(result).toEqual([mockConfirmTx, mockSignTx]);
  });

  test("recoveryEvmToEvm: should return [confirm, sign, gateway approve] response", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
    };
    const mockConfirmTx = {
      skip: false,
      type: "axelar.confirm_gateway_tx" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockSignTx = {
      skip: false,
      type: "axelar.sign_commands" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockSendEvmGatewayApproveTx = {
      skip: true,
      type: "evm.gateway_approve" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    vitest
      .spyOn(ConfirmTx, "sendAxelarConfirmTx")
      .mockResolvedValueOnce(mockConfirmTx);
    vitest.spyOn(SignTx, "sendAxelarSignTx").mockResolvedValueOnce(mockSignTx);
    vitest
      .spyOn(GatewayApproveTx, "sendEvmGatewayApproveTx")
      .mockResolvedValueOnce(mockSendEvmGatewayApproveTx);

    const result = await recoverEvmToEvm(params, deps);

    expect(result).toEqual([
      mockConfirmTx,
      mockSignTx,
      mockSendEvmGatewayApproveTx,
    ]);
  });

  test("recoveryEvmToIbc should return [confirm, sign, route] response", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
    };
    const mockConfirmTx = {
      skip: false,
      type: "axelar.confirm_gateway_tx" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockSignTx = {
      skip: false,
      type: "axelar.sign_commands" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockRouteTx = {
      skip: false,
      type: "axelar.route_message" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    vitest
      .spyOn(ConfirmTx, "sendAxelarConfirmTx")
      .mockResolvedValueOnce(mockConfirmTx);
    vitest.spyOn(SignTx, "sendAxelarSignTx").mockResolvedValueOnce(mockSignTx);
    vitest
      .spyOn(RouteTx, "sendAxelarRouteMessageTx")
      .mockResolvedValueOnce(mockRouteTx);

    const result = await recoverEvmToIbc(params, deps);

    expect(result).toEqual([mockConfirmTx, mockSignTx, mockRouteTx]);
  });

  test("recoverIbcToEvm: should return [route, sign, gateway approve] response", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
    };
    const mockRouteMessageTx = {
      skip: false,
      type: "axelar.route_message" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockSignTx = {
      skip: false,
      type: "axelar.sign_commands" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };
    const mockGatewayApproveTx = {
      skip: false,
      type: "evm.gateway_approve" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };

    vitest
      .spyOn(RouteTx, "sendAxelarRouteMessageTx")
      .mockResolvedValueOnce(mockRouteMessageTx);
    vitest.spyOn(SignTx, "sendAxelarSignTx").mockResolvedValueOnce(mockSignTx);
    vitest
      .spyOn(GatewayApproveTx, "sendEvmGatewayApproveTx")
      .mockResolvedValueOnce(mockGatewayApproveTx);

    const result = await recoverIbcToEvm(params, deps);

    expect(result).toEqual([
      mockRouteMessageTx,
      mockSignTx,
      mockGatewayApproveTx,
    ]);
  });

  test("recoverIbcToIbc: should return [route] response", async () => {
    const params = {
      searchGMPData: searchGMPData as SearchGMPResponseData,
      srcChainConfig,
      destChainConfig,
    };
    const mockRouteMessageTx = {
      skip: false,
      type: "axelar.route_message" as const,
      tx: {
        transactionHash: hashMessage("tx"),
      },
    };

    vitest
      .spyOn(RouteTx, "sendAxelarRouteMessageTx")
      .mockResolvedValueOnce(mockRouteMessageTx);

    const result = await recoverIbcToIbc(params, deps);

    expect(result).toEqual([mockRouteMessageTx]);
  });
});
