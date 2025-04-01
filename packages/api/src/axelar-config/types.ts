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

export interface ChainSuiSubconfig {
  contracts: {
    Utils: SuiContract;
    VersionControl: SuiContract;
    AxelarGateway: SuiContract;
    RelayerDiscovery: SuiContract;
    Operators: SuiContract;
    GasService: SuiContract;
    Abi: SuiContract;
    InterchainTokenService: SuiContract;
    Example: SuiContract;
  };
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

export interface BaseContracts {
  [contractName: string]: { address: string };
}

export interface SuiContract {
  address: string;
  objects: Record<string, string>;
}

interface BaseChainConfig {
  id: string;
  displayName: string;
  iconUrl: string;
  nativeCurrency: {
    name: string;
    symbol?: string;
    denom?: string;
    decimals: number;
    iconUrl: string;
  } | null;
  blockExplorers: { name: string; url: string }[] | null;
  assets: { [assetId: string]: string };
}

// Chain configs for each chain type with associated contracts
export interface EvmChainConfig extends BaseChainConfig {
  chainType: "evm";
  externalChainId: number;
  config: ChainEvmSubconfig;
}

interface AxelarChainConfig extends BaseChainConfig {
  chainType: "axelarnet";
  externalChainId: string;
  config: ChainCosmosSubconfig;
}

export interface SuiChainConfig extends BaseChainConfig {
  chainType: "sui";
  externalChainId?: string;
  config: ChainSuiSubconfig;
}

// Union type of all possible chain configs
export type ChainConfig = EvmChainConfig | AxelarChainConfig | SuiChainConfig;

export interface AxelarConfigsResponse {
  chains: { [chainId: string]: ChainConfig };
  assets: { [assetId: string]: AssetConfig };
  tokenAddressToAsset: { [chainId: string]: { [assetId: string]: string } };
  version: string;
  environment: string;
  resources: { staticAssetHost: string };
}
