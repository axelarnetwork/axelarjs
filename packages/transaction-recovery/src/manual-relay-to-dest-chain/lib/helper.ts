import {
  BaseChainConfigsResponse,
  type SearchGMPResponseData,
} from "@axelarjs/api";

import {
  RouteDir,
  type ChainConfig,
  type ManualRelayToDestChainResponse,
  type RecoveryTxResponse,
} from "../types";

export function getRouteDir(srcChain: ChainConfig, destChain: ChainConfig) {
  if (srcChain.chain_type === "evm" && destChain.chain_type === "evm") {
    return RouteDir.EVM_TO_EVM;
  } else if (
    srcChain.chain_type === "evm" &&
    destChain.chain_type === "cosmos"
  ) {
    return RouteDir.EVM_TO_COSMOS;
  } else if (
    srcChain.chain_type === "cosmos" &&
    destChain.chain_type === "evm"
  ) {
    return RouteDir.COSMOS_TO_EVM;
  } else {
    return RouteDir.COSMOS_TO_COSMOS;
  }
}

export function findChainConfig(
  chainConfigs: BaseChainConfigsResponse,
  chain: string
): ChainConfig | undefined {
  const evmChainConfig = chainConfigs.evm.find(
    (config) => config.id.toLowerCase() === chain.toLowerCase()
  );

  if (evmChainConfig) {
    return {
      chain_type: "evm",
      id: evmChainConfig.id,
      rpcUrl: evmChainConfig.endpoints?.rpc?.[0],
      name: evmChainConfig.name,
    };
  }

  const cosmosChainConfig = chainConfigs.cosmos.find(
    (config) => config.id.toLowerCase() === chain.toLowerCase()
  );

  if (cosmosChainConfig) {
    return {
      chain_type: "cosmos",
      id: cosmosChainConfig.id,
      name: cosmosChainConfig.name,
    };
  }

  return undefined;
}

export function isAlreadyExecuted(status: string) {
  const executedStatuses = ["executed", "approved", "error"];
  return executedStatuses.includes(status);
}

export function mapSearchGMPResponse(tx: SearchGMPResponseData) {
  return {
    srcChain: tx.call.chain,
    destChain: tx.call.returnValues.destinationChain,
    eventIndex: tx.call._logIndex,
  };
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  delay = 5000
): Promise<T> {
  let error: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      error = e;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw error;
}

export function shouldAbortRecovery(recoveryTx: RecoveryTxResponse) {
  return recoveryTx.skip && recoveryTx.error;
}

export function mapRecoveryToResponse(
  type: RouteDir,
  recoverySteps: RecoveryTxResponse[]
): ManualRelayToDestChainResponse {
  const response: ManualRelayToDestChainResponse = {
    success: true,
    error: undefined,
    logs: [],
    type,
  };

  for (const step of recoverySteps) {
    if (step.type === "axelar.confirm_gateway_tx") {
      response["confirmTx"] = step.tx;
    } else if (step.type === "axelar.sign_commands") {
      response["signCommandTx"] = step.tx;
    } else if (step.type === "axelar.route_message") {
      response["routeMessageTx"] = step.tx;
    } else if (step.type === "evm.gateway_approve") {
      response["gatewayApproveTx"] = step.tx;
    }

    if (step.skip && step.skipReason) {
      response.logs.push(`Skipping ${step.type}: ${step.skipReason}`);
    }

    if (step.error) {
      response.success = false;
      response.error = step.error;
    }
  }

  return response;
}
