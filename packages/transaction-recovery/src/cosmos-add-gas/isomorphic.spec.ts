/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAxelarConfigClient } from "@axelarjs/api/axelar-config";
import { createAxelarQueryClient } from "@axelarjs/api/axelar-query";
import { createGMPClient } from "@axelarjs/api/gmp";
import { ENVIRONMENTS } from "@axelarjs/core";

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { vi } from "vitest";

import { addGas, type AddGasDependencies } from "./isomorphic";
import { type AutocalculateGasOptions, type SendOptions } from "./types";

const MOCK_ADD_GAS_RESPONSE = {
  code: 0,
  height: 2561692,
  txIndex: 6,
  events: [[]],
  rawLog: "",
  transactionHash:
    "448337FAAAA9EAD528BB9D6B1DD32BDD5171988A87B9C5D1F8578D9927714918",
  msgResponses: [],
  gasUsed: 130739,
  gasWanted: 250000,
};

const COSMOS_WALLET_MNEMONIC = String(process.env["COSMOS_WALLET_MNEMONIC"]);

describe("addGas - (isomorphic)", () => {
  const mockSignAndBroadcast = () => MOCK_ADD_GAS_RESPONSE;

  const mockGetSigningStargateClient = vi.fn(() =>
    Promise.resolve({
      signAndBroadcast: vi.fn().mockImplementation(mockSignAndBroadcast),
      messages: {
        ibcTransfer: {
          transfer: {
            signAndBroadcast: vi.fn().mockImplementation(mockSignAndBroadcast),
          },
        },
      },
    })
  );

  const DEFAULT_ADD_GAS_DEPENDENCIES: AddGasDependencies = {
    axelarQueryClient: createAxelarQueryClient(ENVIRONMENTS.testnet),
    configClient: createAxelarConfigClient(ENVIRONMENTS.testnet),
    gmpClient: createGMPClient(ENVIRONMENTS.testnet),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSigningStargateClient: mockGetSigningStargateClient as any,
  };

  test("broadcast an IBC transfer", async () => {
    const txHash =
      "6118C285B0C7A139C5636184BECBF8C201FF36B61F44060B82EFE4C535084D9C";

    const token = {
      denom:
        "ibc/44E584C7B0EBEE2D268ABE24AE408825A60E55AC08C5E97D94497741B26C9654",
      amount: "1",
    };
    const offlineSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      COSMOS_WALLET_MNEMONIC,
      { prefix: "osmo" }
    );

    const sendOptions: SendOptions = {
      txFee: {
        gas: "250000",
        amount: [{ denom: "uosmo", amount: "30000" }],
      },
      rpcUrl: "https://rpc.osmotest5.osmosis.zone",
      environment: ENVIRONMENTS.testnet,
      offlineSigner,
    };

    const res = await addGas(
      {
        txHash,
        token,
        sendOptions,
        chain: "osmosis-7",
      },
      DEFAULT_ADD_GAS_DEPENDENCIES
    );

    expect(res).toEqual({
      broadcastResult: MOCK_ADD_GAS_RESPONSE,
      info: "",
      success: true,
    });
  });

  test("autocalculate", async () => {
    const txHash =
      "78377623A0D4643305F02A4F0F825B1C4AAE2868831AE2D59CE4C79A98BD827C";

    const autocalculateGasOptions: AutocalculateGasOptions = {
      gasLimit: BigInt(700_000),
      gasMultipler: 1.1,
    };

    const offlineSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      COSMOS_WALLET_MNEMONIC,
      { prefix: "osmo" }
    );

    const sendOptions: SendOptions = {
      txFee: {
        gas: "250000",
        amount: [{ denom: "uosmo", amount: "30000" }],
      },
      environment: ENVIRONMENTS.testnet,
      offlineSigner,
    };

    const res = await addGas(
      {
        txHash,
        token: "autocalculate",
        sendOptions,
        autocalculateGasOptions,
        chain: "osmosis-7",
      },
      DEFAULT_ADD_GAS_DEPENDENCIES
    );

    expect(res).toEqual({
      broadcastResult: MOCK_ADD_GAS_RESPONSE,
      info: "",
      success: true,
    });
  });
});
