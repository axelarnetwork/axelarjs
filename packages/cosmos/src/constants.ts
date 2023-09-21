import { StdFee } from "@cosmjs/stargate";

import { Environment } from "./types";
import { memoize } from "./utils";

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

const configsMap: Record<Environment, EnvironmentConfigs> = {
  devnet: testnetConfigs,
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
      amount: "1000000",
    },
  ],
  gas: "5000000",
};
