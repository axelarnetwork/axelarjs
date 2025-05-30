import type { SearchGMPResponseData } from "@axelarjs/api";

import type {
  QueryTransactionStatusDependencies,
  QueryTransactionStatusError,
  QueryTransactionStatusParams,
  QueryTransactionStatusResult,
} from "./types";

function parseTxError(
  firstTx: SearchGMPResponseData
): QueryTransactionStatusError | undefined {
  const errorDetails = firstTx.error;
  if (errorDetails) {
    return {
      message: errorDetails.error.message,
      txHash: errorDetails.error.transactionHash,
      chain: errorDetails.chain,
    };
  } else if (firstTx.is_insufficient_fee) {
    return {
      message: "Insufficient fee",
      txHash: firstTx.call.transactionHash,
      chain: firstTx.call.chain,
    };
  }

  return undefined;
}

export async function queryTransactionStatus(
  params: QueryTransactionStatusParams,
  dependencies: QueryTransactionStatusDependencies
): Promise<QueryTransactionStatusResult> {
  const { txHash, txLogIndex } = params;
  const { gmpClient } = dependencies;

  const txs = await gmpClient.searchGMP({
    txHash,
    txLogIndex,
  });

  if (txs.length === 0) {
    return {
      success: false,
      error: "Transaction not found",
    };
  }

  const firstTx = txs[0]!;

  const {
    call,
    status,
    gas_status,
    gas_paid,
    executed,
    time_spent,
    express_executed,
    express_executing_at,
    approved,
  } = firstTx;

  return {
    success: true,
    data: {
      status,
      error: parseTxError(firstTx),
      timeSpent: time_spent,
      gasPaidInfo: {
        status: gas_status,
        details: gas_paid,
      },
      callTx: call,
      executed,
      expressExecuted: express_executed,
      expressExecutedAt: express_executing_at,
      approved,
    },
  };
}
