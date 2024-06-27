import {
  AxelarRecoveryApiClient,
  type SearchGMPResponseData,
} from "@axelarjs/api";

export type SendAxelarRouteMessageTxParams = {
  messageId?: string | undefined;
  searchGMPData: SearchGMPResponseData;
};

export type SendAxelarRouteMessageTxDependencies = {
  axelarRecoveryApiClient: AxelarRecoveryApiClient;
};
