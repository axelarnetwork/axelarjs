import type {
  AxelarConfigClient,
  AxelarscanClient,
  GMPClient,
} from "@axelarjs/api";
import { type DepositAddressClient } from "@axelarjs/api/deposit-address-api/isomorphic";
import { type Environment } from "@axelarjs/core";

export type SendOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
  environment: Environment;
};

export type GetDepositAddressDependencies = {
  gmpClient: GMPClient;
  depositAddressClient: DepositAddressClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
};
