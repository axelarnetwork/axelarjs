export type TOKEN_TYPE =
  | "customInterchain"
  | "interchain"
  | "canonical"
  | "gateway";
export type TOKEN_MANAGER_TYPE = "mintBurn" | "lockUnlock";
export interface AssetConfig {
  id: string;
  prettySymbol: string;
  name: string | null;
  originAxelarChainId: string;
  coingeckoId: string;
  decimals: number;
  iconUrl: string;
  type: string;
  details?: {
    deployer: string;
    deploySalt: string;
    deploymentMessageId: string;
    originalMinter: string;
  };
  chains: {
    [chainId: string]: {
      tokenAddress: string;
      symbol: string;
      name: string | null;
      tokenManager?: string;
      tokenManagerType?: string;
      isERC20WrappedNativeGasToken?: boolean;
      details?: { fullDenomPath?: string };
    };
  };
}

export type CHAIN_TYPE = "axelarnet" | "evm" | "sui";

export interface ChainEvmSubconfig {
  contracts?: {
    AxelarGateway?: { address: string };
    AxelarGasService?: { address: string };
    AxelarDepositService?: { address: string };
    ConstAddressDeployer?: { address: string };
    Create3Deployer?: { address: string };
    InterchainProposalSender?: { address: string };
    InterchainGovernance?: { address: string };
    Multisig?: { address: string };
    Operators?: { address: string };
    InterchainTokenService?: { address: string };
    InterchainTokenFactory?: { address: string };
  };
  approxFinalityHeight: number;
  rpc: string[];
}

export interface ChainCosmosSubconfig {
  addressPrefix: string;
  ibc: {
    fromAxelar: {
      portId: string;
      channelId: string;
    };
    toAxelar: {
      portId: string;
      channelId: string;
    };
  } | null;
  rpc: string[];
  lcd: string[];
  grpc: string[];
}

export interface ChainConfig {
  id: string;
  displayName: string;
  chainType: CHAIN_TYPE;
  externalChainId: string | number;
  iconUrl: string;
  nativeCurrency: {
    name: string;
    symbol?: string;
    denom?: string;
    decimals: number;
    iconUrl: string;
  } | null;
  blockExplorers: { name: string; url: string }[] | null;
  config: ChainCosmosSubconfig | ChainEvmSubconfig;
  assets: { [assetId: string]: string };
}

export interface AxelarConfigsResponse {
  chains: { [chainId: string]: ChainConfig };
  assets: { [assetId: string]: AssetConfig };
  tokenAddressToAsset: { [chainId: string]: { [assetId: string]: string } };
  version: string;
  environment: string;
  resources: { staticAssetHost: string };
}
