import { rpc, Transaction } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { useStellarTransactionPoller } from "~/features/stellarHooks/useStellarTransactionPoller";
import { useAccount } from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "~/lib/trpc";

export type RegisterRemoteInterchainTokenOnStellarInput = {
  salt: string;
  destinationChainIds: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
};

export const useRegisterRemoteInterchainTokenOnStellar = () => {
  const { mutateAsync: getDeployRemoteTokensTxBytes } =
    trpc.stellar.getDeployRemoteTokensTxBytes.useMutation();
  const { kit } = useStellarKit();
  const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
  const server = new rpc.Server(rpcUrl);
  const { pollTransaction } = useStellarTransactionPoller();
  const { address: publicKey } = useAccount();

  const registerRemoteInterchainToken = async ({
    salt,
    destinationChainIds,
    gasValues,
    onStatusUpdate,
  }: RegisterRemoteInterchainTokenOnStellarInput) => {
    if (!kit) {
      throw new Error("Wallet not connected");
    }

    try {
      // Get transaction bytes for remote deployment
      const { transactionXDR: remoteTxXDR } =
        await getDeployRemoteTokensTxBytes({
          caller: publicKey,
          salt,
          destinationChainIds,
          gasValues: gasValues.map((v) => v.toString()),
        });

      // Sign the transaction
      const { signedTxXdr: signedRemoteTxXdr } = await kit.signTransaction(
        remoteTxXDR,
        {
          networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
        }
      );

      // Submit the transaction
      const remoteTx = new Transaction(
        signedRemoteTxXdr,
        NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
      );

      // Get the transaction hash before sending it (will be used as GMP ID)
      const txHash = remoteTx.hash().toString("hex");

      onStatusUpdate?.({
        type: "deploying",
        txHash: txHash,
      });

      // Submitting multicall transaction

      const remoteResponse = await server.sendTransaction(remoteTx);
      // Remote transaction submitted

      // Check if the transaction was accepted for processing
      if (
        remoteResponse.status === "ERROR" ||
        remoteResponse.status === "DUPLICATE" ||
        remoteResponse.status === "TRY_AGAIN_LATER"
      ) {
        const errorMessage = `Stellar remote deployment failed with status: ${remoteResponse.status}. Error: ${JSON.stringify(remoteResponse.errorResult)}`;
        // Error in remote transaction submission
        throw new Error(errorMessage);
      }

      // Poll to check the transaction status using the polling hook
      // Transaction pending, starting polling

      const pollingResult = await pollTransaction(server, txHash, {
        onStatusUpdate: (status) => {
          if (status.type === "polling") {
            onStatusUpdate?.({
              type: "deploying",
              txHash: txHash,
            });
          }
        },
      });

      if (pollingResult.status === "SUCCESS") {
        return txHash;
      } else {
        throw pollingResult.error;
      }
    } catch (error) {
      // Remote deployment error
      onStatusUpdate?.({ type: "idle" });
      throw error;
    }
  };

  return {
    registerRemoteInterchainToken,
  };
};
