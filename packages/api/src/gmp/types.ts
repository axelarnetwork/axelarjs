import type { Log } from "viem";

type BaseGMPResponse<T> = T & {
  time_spent: number;
};

export type GMPTxStatus =
  | "called"
  | "confirming"
  | "confirmable"
  | "express_executed"
  | "confirmed"
  | "approving"
  | "approvable"
  | "approved"
  | "executing"
  | "executed"
  | "error"
  | "express_executable"
  | "express_executable_without_gas_paid"
  | "executable"
  | "executable_without_gas_paid"
  | "insufficient_fee";

export type ChainType = "evm" | "cosmos";

export type SortOrder = "asc" | "desc";

type BaseGMPParams = {
  contractMethod?: string;
  sourceChain?: string;
  destinationChain?: string;
  sourceAddress?: string;
  contractAddress?: string;
  senderAddress?: string;
  relayerAddress?: string;
  /**
   * Unix timestamp in seconds
   */
  fromTime?: number;
  /**
   * Unix timestamp in seconds
   */
  toTime?: number;
};

export const VALID_CONTRACT_METHODS = [
  "callContract",
  "callContractWithToken",
  "InterchainTransfer",
  "InterchainTokenDeploymentStarted",
  "TokenManagerDeploymentStarted",
] as const;

export type ContractMethod = (typeof VALID_CONTRACT_METHODS)[number];

export type SearchGMPParams = Omit<BaseGMPParams, "contractMethod"> & {
  contractMethod?: ContractMethod[] | ContractMethod;
  txHash?: string | undefined;
  txLogIndex?: number | undefined;
  messageId?: string | undefined;
  status?: GMPTxStatus;
  from?: number;
  size?: number;
  sort?: Record<string, SortOrder>;
  sourceContractAddress?: `0x${string}`;
  destinationContractAddress?: `0x${string}`;
  _source?: {
    includes?: string[];
    excludes?: string[];
  };
};

export type TransactionReceipt = {
  blockHash: `0x${string}`;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: `0x${string}`;
  gasUsed: string;
  logs: Array<Log>;
  status: number;
  to: `0x${string}`;
  transactionHash: `0x${string}`;
  transactionIndex: number;
  type: number;
  gasLimit: string;
};

export type SearchGMPCall = {
  blockNumber: number;
  blockHash: `0x${string}`;
  block_timestamp: number;
  transactionIndex: number;
  address: `0x${string}`;
  removed: boolean;
  data: unknown;
  topics: `0x${string}`[];
  transactionHash: `0x${string}`;
  _logIndex?: number;
  logIndex?: number;
  event: string;
  eventIndex: number;
  eventSignature: string;
  _id: string;
  chain: string;
  contract_address: `0x${string}`;
  chain_type: ChainType;
  destination_chain_type: ChainType;
  receipt?: TransactionReceipt;
  messageIdIndex: number;
  returnValues: {
    sender: string;
    destinationChain: string;
    destinationContractAddress: string;
    payloadHash: string;
    payload: string;
    symbol: string;
    amount: string;
    messageId?: string;
  };
};

export type SearchGMPCallback = {
  chain: string;
  chain_type: ChainType;
  destination_chain_type: ChainType;
  created_at: GMPTxCreatedAt;
  eventIndex: number;
  returnValues: {
    sourceChain: string;
    destinationChain: string;
    sourceAddress: string;
    destinationAddress: string;
    destinationContractAddress: string;
    sender: string;
    payload: string;
    messageID: string;
    messageId: string;
    payloadHash: string;
  };
  messageIdIndex: number;
  blockNumber: number;
  block_timestamp: number;
  parentMessageID: string;
  receipt: SearchGMPReceipt;
  _id: string;
  id: string;
  messageIdHash: string;
  event: string;
  transaction: SearchGMPTransaction;
};

type SearchGMPReceipt = {
  gasUsed: string;
  blockNumber: number;
  from: `0x${string}`;
  transactionHash: `0x${string}`;
  status: number;
  confirmations: number;
};

type SearchGMPTransaction = {
  gasLimit: string;
  blockNumber: number;
  from: string;
  hash: string;
};

export type SearchGMPExecuted = {
  chain: string;
  sourceTransactionIndex: number;
  sourceChain: string;
  chain_type: ChainType;
  sourceTransactionLogIndex: number;
  transactionIndex: number;
  contract_address: `0x${string}`;
  transactionHash: `0x${string}`;
  blockNumber: number;
  block_timestamp: number;
  from: `0x${string}`;
  receipt: SearchGMPReceipt;
  sourceTransactionHash: `0x${string}`;
  id: string;
  event: "execute";
  transaction: SearchGMPTransaction;
  relayerAddress: `0x${string}`;
  _id: string;
};

type GMPTokenInfo = {
  token_price: {
    usd: number;
  };
  gas_price: string;
  symbol: string;
  gas_price_gwei: string;
  decimals: number;
  name: string;
  contract_address: `0x${string}`;
};

type GMPAxelarTokenInfo = Pick<
  GMPTokenInfo,
  "token_price" | "symbol" | "decimals" | "name"
>;

type SearchGMPFees = {
  base_fee: number;
  destination_base_fee: number;
  destination_native_token: GMPTokenInfo;
  express_fee: number;
  source_express_fee: {
    base_fee: number;
    total: number;
    express_gas_overhead_fee: number;
  };
  source_token: GMPTokenInfo;
  source_base_fee: number;
  axelar_token: GMPAxelarTokenInfo;
  destination_express_fee: {
    base_fee: number;
    total: number;
    express_gas_overhead_fee: number;
  };
};

export type SearchGMPApprove = {
  transactionHash: string;
  contract_address: string;
  chain: string;
  chain_type: string;
};

export type SearchGMPGasStatus =
  | "gas_paid"
  | "gas_paid_not_enough_gas"
  | "gas_unpaid"
  | "gas_paid_enough_gas";

type GMPTxCreatedAt = {
  week: number;
  hour: number;
  month: number;
  year: number;
  ms: number;
  day: number;
  quarter: number;
};

export type SearchGMPGasPaid = {
  axelarTransactionHash: string;
  chain: string;
  chain_type: string;
  logIndex: number;
  created_at: GMPTxCreatedAt;
  transactionHash: string;
  returnValues: {
    refundAddress: string;
    amount: string;
    refundRecipient: string;
    sourceAddress: string;
    destinationAddress: string;
    gasFeeAmount: string;
    recipient: string;
    messageId: string;
    payloadHash: string;
    denom: string;
    destinationChain: string;
    asset: string;
  };
  blockNumber: number;
  block_timestamp: number;
  receipt: SearchGMPReceipt;
  _id: string;
  id: string;
  event: string;
  transaction: SearchGMPTransaction;
  destination_chain_type: string;
};

type InterchainTransferEvent = {
  event: "InterchainTransfer";
  symbol: string;
  amount: string;
  destinationAddress: `0x${string}`;
  tokenId: `0x${string}`;
  decimals: number;
  name: string;
  destinationChain: string;
  contract_address: `0x${string}`;
  id: string;
};

type InterchainTokenDeploymentStartedEvent = {
  event: "InterchainTokenDeploymentStarted";
  tokenId: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenName: string;
  destinationChain: string;
  distributor: `0x${string}`;
};

type TokenManagerDeploymentStartedEvent = {
  event: "TokenManagerDeploymentStarted";
  tokenId: `0x${string}`;
  tokenManagerType: number;
  destinationChain: string;
  params: `0x${string}`;
};

export type SearchGMPResponseData = {
  call: SearchGMPCall;
  fees: SearchGMPFees;
  status: GMPTxStatus;
  executed?: SearchGMPExecuted;
  error?: SearchGMPDataError;
  message_id: string;
  time_spent: SearchGMPTimespent;
  gas_paid: SearchGMPGasPaid;
  gas_status: SearchGMPGasStatus;
  express_executed?: SearchGMPExpressExecuted;
  express_executing_at?: number;
  approved: SearchGMPApprove;
  command_id?: string;
  is_invalid_destination_chain: boolean;
  is_call_from_relayer: boolean;
  is_invalid_call: boolean;
  is_insufficient_fee: boolean;
  interchain_transfer?: InterchainTransferEvent;
  interchain_token_deployment_started?: InterchainTokenDeploymentStartedEvent;
  token_manager_deployment_started?: TokenManagerDeploymentStartedEvent;
  callback?: SearchGMPCallback;
};

export type SearchGMPTimespent = {
  call_express_executed?: number;
  call_confirm?: number;
  call_approve?: number;
  approved_executed?: number;
  total: number;
};

export type SearchGMPExpressExecuted = {
  sourceChain: string;
  chain: string;
  created_at: GMPTxCreatedAt;
};

export type SearchGMPDataError = {
  chain: string;
  sourceChain: string;
  chain_type: string;
  messageId: string;
  error: {
    reason: string;
    message: string;
    transactionHash: string;
  };
};

export type SearchGMPResponse = BaseGMPResponse<{
  data: SearchGMPResponseData[];
  total: number;
}>;

export type GetContractsResponse = BaseGMPResponse<{
  constant_address_deployer: `0x${string}`;
  express_contract: {
    address: `0x${string}`;
  };
  gateway_contracts: Record<string, { address: `0x${string}` }>;
  gas_service_contracts: Record<string, { address: `0x${string}` }>;
  time_spent: number;
}>;

export type GetGasPriceParams = {
  sourceChain: string;
  destinationChain: string;
  sourceTokenSymbol?: string;
  sourceTokenAddress?: `0x${string}`;
};

export type GetGasPriceResponse = BaseGMPResponse<{
  method: "getGasPrice";
  params: GetGasPriceParams & {
    method: "getGasPrice";
  };
  result: {
    source_token: GMPTokenInfo;
    destination_native_token: GMPTokenInfo;
  };
  time_spent: number;
}>;

// GetGMPStatistics

type BaseStats<T = Record<string, unknown>> = T & {
  key: string;
  num_txs: number;
};

export type GetGMPStatisticsParams = BaseGMPParams;

export type GetGMPStatisticsResponse = {
  messages: BaseStats<{
    source_chains: BaseStats<{
      destination_chains: BaseStats<{ contracts: BaseStats[] }>[];
    }>[];
  }>[];
  time_spent: number;
};

// GetGMPChart

export type GetGMPChartParams = BaseGMPParams;

export type GetGMPChartResponse = {
  data: {
    timestamp: number;
    num_txs: number;
  }[];
};

// GetGMPCumulativeVolume

export type GetGMPCumulativeVolumeParams = BaseGMPParams;

export type GetGMPCumulativeVolumeResponse = {
  data: {
    timestamp: number;
    volume: number;
    cumulative_volume: number;
    num_txs: number;
  }[];
};

// GetGMPTotalVolume

export type GetGMPTotalVolumeParams = BaseGMPParams;

export type GetGMPTotalVolumeResponse = number;

// EstimateTimeSpent

export type EstimateTimeSpentParams = Pick<
  BaseGMPParams,
  | "contractMethod"
  | "sourceChain"
  | "destinationChain"
  | "sourceAddress"
  | "contractAddress"
  | "fromTime"
  | "toTime"
>;

export type EstimateTimeSpentResponse = BaseStats<{
  express_execute: number | null;
  confirm: number | null;
  approve: number | null;
  execute: number | null;
  total: number;
}>[];

// GetFees

export type GetFeesParams = {
  sourceChain: string;
  destinationChain: string;
  sourceTokenSymbol?: string | undefined;
  executeData?: `0x${string}` | undefined;
  sourceTokenAddress?: `0x${string}` | undefined;
  destinationContractAddress?: `0x${string}` | undefined;
  sourceContractAddress?: `0x${string}` | undefined;
  tokenSymbol?: string | undefined;
  amount?: number | undefined;
  amountInUnits?: string | undefined;
};

type ExpressFee = {
  relayer_fee: number;
  relayer_fee_usd: number;
  express_gas_overhead_fee: number;
  express_gas_overhead_fee_usd: number;
  total: number;
  total_usd: number;
};

type TokenPrice = {
  usd: number;
};

export type TokenUnit = {
  value: string;
  decimals: number;
};

export type L2Type = "op" | "mantle" | "arb" | undefined;

export type Token = {
  contract_address: string;
  symbol: string;
  name: string;
  decimals: number;
  token_price: TokenPrice;
  gas_price: string;
  gas_price_in_units: TokenUnit;
  l1_gas_price?: string;
  l1_gas_price_in_units?: TokenUnit;
  gas_price_gwei: string;
};

export type GetBaseFeesResult = {
  base_fee: number;
  base_fee_usd: number;
  source_base_fee: number;
  source_base_fee_string: string;
  source_base_fee_usd: number;
  destination_base_fee: number;
  destination_base_fee_string: string;
  destination_base_fee_usd: number;
  express_supported: boolean;
  express_fee: number;
  express_fee_string: string;
  express_fee_usd: number;
  execute_gas_multiplier: number;
  express_execute_gas_limit_adjustment: number;
  express_execute_gas_limit_adjustment_with_multiplier: number;
  source_express_fee: ExpressFee;
  destination_express_fee: ExpressFee;
  source_token: Token;
  l2_type: L2Type;
  destination_native_token: Token & {
    name: string;
    symbol: string;
    l1_gas_oracle_address?: `0x${string}` | undefined;
  };
  ethereum_token: {
    name: string;
    symbol: string;
    decimals: number;
    token_price: TokenPrice;
  };
  axelar_token: {
    name: string;
    symbol: string;
    decimals: number;
    token_price: TokenPrice;
  };
};

export type GetFeesResponse = BaseGMPResponse<{
  method: "getBaseFees";
  params: GetFeesParams & { method: "getFees" };
  result: GetBaseFeesResult;
}>;
