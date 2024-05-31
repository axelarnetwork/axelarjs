import { createPublicClient, http, serializeTransaction, type Hex } from "viem";

export const createEvmClient = (rpcUrl: string) => {
  return createPublicClient({
    transport: http(rpcUrl),
  });
};

export const getChainIdandMaxPriorityFeePerGas = async (rpcUrl: string) => {
  const publicClient = createEvmClient(rpcUrl);
  const [chainId, maxPriorityFeePerGas] = await Promise.all([
    publicClient.getChainId(),
    publicClient.estimateMaxPriorityFeePerGas(),
  ]);

  return { chainId, maxPriorityFeePerGas };
};

export const createApproveTx = async (
  rpcUrl: string,
  executeData: string,
  gatewayAddress: Hex
) => {
  const { chainId, maxPriorityFeePerGas } =
    await getChainIdandMaxPriorityFeePerGas(rpcUrl);

  const serializedTx = serializeTransaction({
    to: gatewayAddress,
    data: executeData as Hex,
    maxPriorityFeePerGas,
    chainId,
  });

  return serializedTx;
};

export const executeApproveTx = async (
  rpcUrl: string,
  executeData: string,
  gatewayAddress: Hex
) => {
  const serializedTx = await createApproveTx(
    rpcUrl,
    executeData,
    gatewayAddress
  );
  const publicClient = createEvmClient(rpcUrl);
  const transactionHash = await publicClient.sendRawTransaction({
    serializedTransaction: serializedTx,
  });
  return transactionHash;
};
