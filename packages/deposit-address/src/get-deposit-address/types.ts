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
  requestConfig?: DepositAddressRequestConfig;
};

export type DepositAddressOptions = {
  sourceChain: string;
  destinationChain: string;
  destinationAddress: string;
  environment: Environment;
  asset: string; // "native" for native token or other identifiers for non-native token e.g. "uusdc", "wavax-wei"
  options?: {
    salt?: string;
    refundAddress?: string;
    skipUnwrap?: boolean;
  };
  requestConfig?: DepositAddressRequestConfig;
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
export type DepositAddressRequestConfig =
  | {
      axelarRpcUrl?: string;
      axelarLcdUrl?: string;
    }
  | undefined;
