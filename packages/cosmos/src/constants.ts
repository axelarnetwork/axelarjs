import { memoize } from "@axelarjs/utils";

import { GasPrice, StdFee } from "@cosmjs/stargate";

import { Environment } from "./types";

export type EnvironmentConfigs = {
  axelarRpcUrl: string;
  axelarLcdUrl: string;
};

const testnetConfigs: EnvironmentConfigs = {
  axelarRpcUrl: "https://rpc-axelar-testnet.imperator.co:443", // "https://testnet.rpc.axelar.dev/chain/axelar",
  axelarLcdUrl: "https://lcd-axelar-testnet.imperator.co",
};

const mainnetConfigs: EnvironmentConfigs = {
  axelarRpcUrl: "https://mainnet.rpc.axelar.dev/chain/axelar",
  axelarLcdUrl: "https://lcd-axelar.imperator.co",
};

const devnetAmplifierConfigs: EnvironmentConfigs = {
  axelarRpcUrl: "http://devnet-amplifier.axelar.dev:26657",
  axelarLcdUrl: "http://devnet-amplifier.axelar.dev:1317",
};

const configsMap: Record<Environment, EnvironmentConfigs> = {
  ["devnet-amplifier"]: devnetAmplifierConfigs,
  testnet: testnetConfigs,
  mainnet: mainnetConfigs,
};

export const getConfigs = memoize(
  (environment: Environment): EnvironmentConfigs => configsMap[environment]
);

export const STANDARD_FEE: StdFee = {
  amount: [
    {
      denom: "uaxl",
      amount: "100000",
    },
  ],
  gas: "500000",
};

export const STANDARD_GAS_PRICE = GasPrice.fromString("0.025uaxl");
