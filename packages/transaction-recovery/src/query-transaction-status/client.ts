import { createGMPClient } from "@axelarjs/api/gmp";

import { queryTransactionStatus as baseQueryTransactionStatus } from "./isomorphic";
import type {
  QueryTransactionStatusParams,
  QueryTransactionStatusResult,
} from "./types";

/**
 * Query the status of the transaction sent to the destination chain.
 * @param params - The parameters to query the transaction status. The parameters are:
 * - `txHash`: The hash of the source transaction.
 * - `environment`: The environment to query the transaction status. The value can be `mainnet`, `testnet`.
 * @returns see {@link QueryTransactionStatusResult}
 */
export function queryTransactionStatus(
  params: QueryTransactionStatusParams
): Promise<QueryTransactionStatusResult> {
  const { environment } = params;

  return baseQueryTransactionStatus(params, {
    gmpClient: createGMPClient(environment),
  });
}

export default queryTransactionStatus;
