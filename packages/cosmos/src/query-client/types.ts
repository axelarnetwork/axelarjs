import {
  QueryServiceClientImpl as AxelarnetQSCI,
  type QueryService as AxelarnetQS,
} from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import {
  QueryServiceClientImpl as EVMQSCI,
  type QueryService as EvmQS,
} from "@axelarjs/proto/axelar/evm/v1beta1/service";
import {
  QueryServiceClientImpl as NexusQSCI,
  type QueryService as NexusQS,
} from "@axelarjs/proto/axelar/nexus/v1beta1/service";
import {
  QueryServiceClientImpl as TSSQSCI,
  type QueryService as TSSQS,
} from "@axelarjs/proto/axelar/tss/v1beta1/service";

import { createProtobufRpcClient, type QueryClient } from "@cosmjs/stargate";

export interface AxelarQueryService {
  readonly evm: EvmQS;
  readonly axelarnet: AxelarnetQS;
  readonly nexus: NexusQS;
  readonly tss: TSSQS;
}

export function setupQueryExtension(base: QueryClient): AxelarQueryService {
  const client = createProtobufRpcClient(base);
  return {
    evm: new EVMQSCI(client),
    axelarnet: new AxelarnetQSCI(client),
    nexus: new NexusQSCI(client),
    tss: new TSSQSCI(client),
  };
}
