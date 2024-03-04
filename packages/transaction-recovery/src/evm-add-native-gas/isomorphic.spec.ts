/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createAxelarQueryClient } from "@axelarjs/api";
import { createGMPClient, SearchGMPGasStatus } from "@axelarjs/api/gmp";
import { ENVIRONMENTS } from "@axelarjs/core";

import { createWalletClient, http, parseEther, publicActions } from "viem";
import { generatePrivateKey } from "viem/accounts";

import { addNativeGasEvm } from "./client";
import { EvmAddNativeGasError } from "./error";

vi.mock("viem", async () => {
  const actualViem = await vi.importActual("viem");

  return {
    ...actualViem,
    createWalletClient: vi.fn().mockReturnValue({
      extend: vi.fn().mockReturnValue({
        requestAddresses: vi.fn(),
      }),
    }),
    getContract: vi.fn(() => ({
      write: {
        addNativeGas: vi.fn(),
      },
    })),
  };
});

vi.mock("@axelarjs/api/gmp", async () => {
  const actualGMP = await vi.importActual("@axelarjs/api/gmp");

  return {
    ...actualGMP,
    createGMPClient: vi.fn().mockReturnValue({
      searchGMP: vi.fn(),
    }),
  };
});

vi.mock("@axelarjs/api/axelar-query", async () => {
  const actualAxelar = await vi.importActual("@axelarjs/api/axelar-query");

  return {
    ...actualAxelar,
    createAxelarQueryClient: vi.fn().mockReturnValue({
      estimateGasFee: vi.fn(),
    }),
  };
});

function mockGasStatus(status: SearchGMPGasStatus) {
  const gmpClient = createGMPClient(ENVIRONMENTS.mainnet);

  gmpClient.searchGMP = vi.fn().mockResolvedValueOnce([
    {
      gas_status: status,
    },
  ]);
}

function mockRequestAccounts() {
  const walletClient = createWalletClient({
    transport: http(),
    account: generatePrivateKey(),
  }).extend(publicActions);

  walletClient.requestAddresses = vi.fn().mockResolvedValueOnce(["0xSender"]);
}

function mockEstimateGasFee(mockedAmount: string) {
  const queryClient = createAxelarQueryClient(ENVIRONMENTS.mainnet);

  queryClient.estimateGasFee = vi.fn().mockResolvedValueOnce(mockedAmount);
}

describe("addNativeGasEvm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw ENOUGH_PAID error when the transaction already has enough gas paid", async () => {
    mockRequestAccounts();
    mockGasStatus("gas_paid_enough_gas");
    const randomPk = generatePrivateKey();
    await expect(
      addNativeGasEvm({
        srcChain: "linea",
        estimatedGasUsed: 100000,
        txHash:
          "0x37183ac1c2b0910276f2e3b3ecb14f11f0196dd0068edf4783254a8ccee11996",
        environment: "mainnet",
        addNativeGasOptions: {
          privateKey: randomPk,
        },
      })
    ).rejects.toThrowError(EvmAddNativeGasError.ENOUGH_PAID);
  });

  it("should throw WALLET_CLIENT_NOT_FOUND error when privateKey or window.ethereum is not defined", async () => {
    mockRequestAccounts();
    mockGasStatus("gas_paid_not_enough_gas");
    mockEstimateGasFee(parseEther("1000").toString());
    await expect(
      addNativeGasEvm({
        srcChain: "linea",
        estimatedGasUsed: 100000,
        txHash:
          "0x37183ac1c2b0910276f2e3b3ecb14f11f0196dd0068edf4783254a8ccee11996",
        environment: "mainnet",
      })
    ).rejects.toThrowError(EvmAddNativeGasError.WALLET_CLIENT_NOT_FOUND);
  });

  it("should throw CHAIN_CONFIG_NOT_FOUND if the srcChain is unknown", async () => {
    await expect(
      addNativeGasEvm({
        srcChain: "unknown",
        estimatedGasUsed: 100000,
        txHash:
          "0x37183ac1c2b0910276f2e3b3ecb14f11f0196dd0068edf4783254a8ccee11996",
        environment: "mainnet",
        addNativeGasOptions: {
          privateKey: generatePrivateKey(),
        },
      })
    ).rejects.toThrowError(
      EvmAddNativeGasError.CHAIN_CONFIG_NOT_FOUND("unknown")
    );
  });
});
