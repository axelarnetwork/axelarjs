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
  environment: Environment;
  asset?: string; // if not specified, it is the native asset
  options?: {
    salt?: string;
    refundAddress?: string;
    skipUnwrap?: boolean;
  };
};

export type DepositNativeWrapOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  refundAddress: string;
  salt?: string | undefined;
  environment: Environment;
};

export type DepositNativeUnwrapOptions = Omit<DepositNativeWrapOptions, "salt">;

export type GetLinkedDepositAddressDependencies = {
  gmpClient: GMPClient;
  depositAddressClient: DepositAddressClient;
  configClient: AxelarConfigClient;
  axelarscanClient: AxelarscanClient;
};

export type GetDepositAddressDependencies =
  GetLinkedDepositAddressDependencies & {
    depositServiceClient: DepositServiceClient;
  };

export type GetDepositServiceDependencies = {
  gmpClient: GMPClient;
  configClient: AxelarConfigClient;
  depositServiceClient: DepositServiceClient;
};
