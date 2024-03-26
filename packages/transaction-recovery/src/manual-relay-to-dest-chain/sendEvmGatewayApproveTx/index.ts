import type {
  AxelarRecoveryApiClient,
  AxelarscanClient,
  SearchBatchesResponse,
  SearchGMPResponseData,
} from "@axelarjs/api";
import type { AxelarQueryClientService } from "@axelarjs/cosmos";

import type { ChainConfig } from "../lib/helper";
import type { RecoveryTxResponse } from "../types";

export type SendEvmGatewayApproveTxParams = {
  searchGMPData: SearchGMPResponseData;
  srcChainConfig: ChainConfig;
};

export type SendEvmGatewayApproveTxDependencies = {
  axelarQueryRpcClient: AxelarQueryClientService;
  axelarscanClient: AxelarscanClient;
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};

export async function sendEvmGatewayApproveTx(
  params: SendEvmGatewayApproveTxParams,
  deps: SendEvmGatewayApproveTxDependencies
) {
  const { axelarRecoveryApiClient, axelarscanClient, axelarQueryRpcClient } =
    deps;

  const { address } = await axelarQueryRpcClient.evm.GatewayAddress({
    chain: params.srcChainConfig.id,
  });

  const gatewayAddress = address;
}
