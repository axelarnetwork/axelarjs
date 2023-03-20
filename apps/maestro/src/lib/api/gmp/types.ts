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

export type SearchGMPResponseData = {
  call: {
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
  };
};

export type SearchGMPResponse = {
  data: SearchGMPResponseData[];
};

export type GetGMPContractsResponse = {
  constant_address_deployer: `0x${string}`;
  express_contract: {
    address: `0x${string}`;
  };
  gateway_contracts: Record<string, { address: `0x${string}` }>;
  gas_service_contracts: Record<string, { address: `0x${string}` }>;
  time_spent: number;
};
