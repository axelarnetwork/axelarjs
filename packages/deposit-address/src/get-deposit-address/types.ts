import type {
  AxelarConfigClient,
  AxelarscanClient,
  DepositAddressClient,
  DepositServiceClient,
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

export type DepositAddressOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  asset: string;
  options: {
    salt?: string;
    refundAddress?: string;
  };
  environment: Environment;
};

export type DepositNativeWrapOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  refundAddress: string;
  salt: string;
  environment: Environment;
};

export type DepositNativeUnwrapOptions = Omit<DepositNativeWrapOptions, "salt">;

export type GetLinkedDepositAddressDependencies = {
  gmpClient: GMPClient;
  depositAddressClient: DepositAddressClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
};

export type GetDepositServiceDependencies = {
  gmpClient: GMPClient;
  configClient: AxelarConfigClient;
  depositServiceClient: DepositServiceClient;
};
