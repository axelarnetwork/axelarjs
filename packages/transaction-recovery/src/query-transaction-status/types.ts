import type {
  GMPClient,
  GMPTxStatus,
  SearchGMPApprove,
  SearchGMPCall,
  SearchGMPExecuted,
  SearchGMPExpressExecuted,
  SearchGMPGasPaid,
  SearchGMPGasStatus,
  SearchGMPTimespent,
} from "@axelarjs/api";
import type { Environment } from "@axelarjs/core";

export type QueryTransactionStatusParams = {
  txHash: string;
  txLogIndex?: number;
  environment: Environment;
};

export type QueryTransactionStatusDependencies = {
  gmpClient: GMPClient;
};

export type QueryTransactionStatusResult = {
  success: boolean;
  error?: string;
  data?: {
    status: GMPTxStatus;
    error?: QueryTransactionStatusError | undefined;
    timeSpent: SearchGMPTimespent;
    gasPaidInfo: {
      status: SearchGMPGasStatus;
      details: SearchGMPGasPaid;
    };
    callTx: SearchGMPCall;
    executed?: SearchGMPExecuted | undefined;
    expressExecuted?: SearchGMPExpressExecuted | undefined;
    expressExecutedAt?: number | undefined;
    approved?: SearchGMPApprove | undefined;
  };
};

export type QueryTransactionStatusError = {
  message: string;
  txHash: string;
  chain: string;
};
