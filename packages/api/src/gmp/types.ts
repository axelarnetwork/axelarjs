type BaseGMPResponse<T> = T & {
  time_spent: number;
};

export type GMPStatus =
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
  | "not_executed"
  | "not_executed_without_gas_paid"
  | "insufficient_fee";

export type ChainType = "evm" | "cosmos";

export type SortOrder = "asc" | "desc";

export type SearchGMPParams = {
  contractMethod?: "callContrct" | "callContrctWithToken";
  txHash?: `0x${string}`;
  txLogIndex?: number;
  sourceChain?: string;
  destinationChain?: string;
  contractAddress?: `0x${string}`;
  senderAddress?: `0x${string}`;
  relayerAddress?: `0x${string}`;
  status?: GMPStatus;
  fromTime?: number;
  toTime?: number;
  from?: number;
  size?: number;
  sort?: Record<string, SortOrder>;
};

type HexAmount = {
  type: string;
  hex: string;
};

type SearchGMPCall = {
  blockNumber: number;
  blockHash: `0x${string}`;
  transactionIndex: number;
  address: `0x${string}`;
  removed: boolean;
  data: unknown;
  topics: `0x${string}`[];
  transactionHash: `0x${string}`;
  logIndex: number;
  event: string;
  eventSignature: string;
  id: string;
  chain: string;
  contract_address: `0x${string}`;
  chain_type: ChainType;
  destination_chain_type: ChainType;
  returnValues: {
    sender: string;
    destinationChain: string;
    destinationContractAddress: string;
    payloadHash: string;
    payload: string;
    symbol: string;
    amount: HexAmount;
  };
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

export type SearchGMPResponseData = {
  call: SearchGMPCall;
  fees: SearchGMPFees;
  status: GMPStatus;
  is_invalid_destination_chain: boolean;
  is_call_from_relayer: boolean;
  is_invalid_call: boolean;
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

export type GetGMPStatisticsResponse = {
  messages: {
    key: string;
    num_txs: number;
    source_chains: {
      key: string;
      num_txs: number;
      destination_chains: {
        key: string;
        num_txs: number;
        contracts: {
          key: string;
          num_txs: number;
        }[];
      }[];
    }[];
  }[];
  time_spent: number;
};

export type GetGMPChartResponse = {
  data: {
    timestamp: number;
    num_txs: number;
  }[];
};
