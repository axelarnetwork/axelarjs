import {
  QueryService as AxelarnetQS,
  QueryServiceClientImpl as AxelarnetQSCI,
} from "@axelarjs/proto/axelar/axelarnet/v1beta1/service";

import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

export interface AxelarSigningService {
  readonly axelarnet: AxelarnetQS;
}

export function setupQueryExtension(base: QueryClient): AxelarSigningService {
  const client = createProtobufRpcClient(base);
  return {
    axelarnet: new AxelarnetQSCI(client),
  };
}
