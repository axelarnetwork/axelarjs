import {
  QueryService as AxelarnetQS,
  QueryServiceClientImpl as AxelarnetQSCI,
} from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";
import {
  QueryService as EvmQS,
  QueryServiceClientImpl as EVMQSCI,
} from "@axelarjs/proto/axelar/evm/v1beta1/service";
import {
  QueryService as NexusQS,
  QueryServiceClientImpl as NexusQSCI,
} from "@axelarjs/proto/axelar/nexus/v1beta1/service";
import {
  QueryService as TSSQS,
  QueryServiceClientImpl as TSSQSCI,
} from "@axelarjs/proto/axelar/tss/v1beta1/service";

import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

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
