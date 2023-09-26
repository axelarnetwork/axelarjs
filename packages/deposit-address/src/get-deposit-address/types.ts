import type {
  AxelarConfigClient,
  AxelarscanClient,
  DepositAddressClient,
  GMPClient,
} from "@axelarjs/api";
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
