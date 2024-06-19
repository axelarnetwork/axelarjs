import type {
  GMPClient,
  GMPTxStatus,
  SearchGMPApprove,
  SearchGMPCall,
  SearchGMPExecuted,
  SearchGMPExpressExecuted,
  SearchGMPGasPaid,
  SearchGMPGasStatus,
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
  status: GMPTxStatus;
  error?: QueryTransactionStatusError;
  timeSpent: number;
  gasPaidInfo: {
    status: SearchGMPGasStatus;
    details: SearchGMPGasPaid;
  };
  callTx: SearchGMPCall;
  executed: SearchGMPExecuted;
  expressExecuted: SearchGMPExpressExecuted;
  expressExecutedAt: number;
  approved: SearchGMPApprove;
};

export type QueryTransactionStatusError = {
  message: string;
  txHash: string;
  chain: string;
};
