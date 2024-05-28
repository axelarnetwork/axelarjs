export const GatewayApproveError = {
  RPC_NOT_FOUND: (chain: string) =>
    new Error(`Cannot find rpcUrl for ${chain}`),
};
