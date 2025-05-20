import { useState } from "react";

import type { StellarWalletsKit as BaseStellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { rpc, Transaction } from "@stellar/stellar-sdk";

import { stellarChainConfig } from "~/config/chains";
import { NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE } from "~/config/env";
import type { DeployAndRegisterTransactionState } from "~/features/InterchainTokenDeployment";
import { trpc } from "~/lib/trpc";

// Interface estendida para incluir métodos que usamos mas que podem não estar na definição de tipos original
interface StellarWalletsKit extends BaseStellarWalletsKit {
  getPublicKey(): Promise<string>;
  signTransaction(
    xdr: string,
    options: { networkPassphrase: string }
  ): Promise<{ signedTxXdr: string }>;
}

export interface DeployTokenParams {
  kit: StellarWalletsKit;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  initialSupply: bigint;
  salt: string;
  minterAddress?: string;
  destinationChainIds: string[];
  gasValues: bigint[];
  onStatusUpdate?: (status: DeployAndRegisterTransactionState) => void;
}

export interface DeployTokenResult {
  hash: string;
  status: string;
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
  tokenManagerType: string;
  remote?: {
    hash: string;
    status: string;
  };
}

export function useDeployStellarToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DeployTokenResult | null>(null);

  const { mutateAsync: getDeployTokenTxBytes } =
    trpc.stellar.getDeployTokenTxBytes.useMutation({
      onError(error) {
        console.log("Error in getDeployTokenTxBytes:", error.message);
      },
    });

  const { mutateAsync: getDeployRemoteTokensTxBytes } =
    trpc.stellar.getDeployRemoteTokensTxBytes.useMutation({
      onError(error) {
        console.log("Error in getDeployRemoteTokensTxBytes:", error.message);
      },
    });

  const deployStellarToken = async ({
    kit,
    tokenName,
    tokenSymbol,
    decimals,
    initialSupply,
    salt,
    minterAddress,
    destinationChainIds,
    gasValues,
    onStatusUpdate,
  }: DeployTokenParams): Promise<DeployTokenResult> => {
    // Verificar se o kit está disponível
    if (!kit) {
      throw new Error("StellarWalletsKit not provided");
    }

    // Verificar se o usuário está conectado e obter a chave pública
    let publicKey: string;
    try {
      publicKey = (await kit.getAddress()).address;
      if (!publicKey) {
        throw new Error("Stellar wallet not connected");
      }
    } catch (error) {
      console.error("Error getting public key:", error);
      throw new Error("Failed to get Stellar wallet public key");
    }

    // Primeiro passo: deploy do token na Stellar
    onStatusUpdate?.({ type: "pending_approval", step: 1, totalSteps: 2 });

    try {
      // 1. Obter os bytes da transação para deploy do token
      const { transactionXDR } = await getDeployTokenTxBytes({
        caller: publicKey,
        tokenName,
        tokenSymbol,
        decimals,
        initialSupply: initialSupply.toString(),
        salt,
        minterAddress,
      });

      // 2. Assinar a transação
      const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
        networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
      });

      // 3. Enviar a transação
      const rpcUrl = stellarChainConfig.rpcUrls.default.http[0];
      const server = new rpc.Server(rpcUrl, {
        allowHttp: rpcUrl.startsWith("http://"),
      });

      const tx = new Transaction(
        signedTxXdr,
        NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
      );

      // Não enviamos o txHash aqui porque ainda não temos o hash da transação
      const initialResponse = await server.sendTransaction(tx);

      if (initialResponse.status === "PENDING") {
        console.log("[STATUS_UPDATE] Deploying - Hash:", initialResponse.hash);
        onStatusUpdate?.({
          type: "deploying",
          txHash: initialResponse.hash,
        });
      }

      if (
        initialResponse.status === "ERROR" ||
        initialResponse.status === "DUPLICATE" ||
        initialResponse.status === "TRY_AGAIN_LATER"
      ) {
        const errorMessage = `Stellar transaction submission failed with status: ${initialResponse.status}. Error: ${JSON.stringify(initialResponse.errorResult)}`;
        console.error(errorMessage, initialResponse);
        throw new Error(errorMessage);
      }

      // 4. Aguardar confirmação da transação
      console.log("Transaction PENDING, starting polling...");
      let getTxResponse: rpc.Api.GetTransactionResponse | undefined;
      const maxPollingAttempts = 20;
      const pollingIntervalMs = 3000;

      for (let i = 0; i < maxPollingAttempts; i++) {
        await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));

        try {
          getTxResponse = await server.getTransaction(initialResponse.hash);
          console.log(
            `Polling attempt ${i + 1}: Status = ${getTxResponse.status}`
          );

          if (getTxResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
            console.log("Transaction SUCCESS:", getTxResponse);
            break;
          } else if (
            getTxResponse.status === rpc.Api.GetTransactionStatus.FAILED
          ) {
            const failReason = `Transaction failed on-chain. Result XDR (base64): ${getTxResponse.resultXdr ? getTxResponse.resultXdr.toXDR("base64") : "N/A"}`;
            console.error("Transaction FAILED:", failReason, getTxResponse);
            throw new Error(failReason);
          }
        } catch (pollingError) {
          console.error(
            `Error during getTransactionStatus polling:`,
            pollingError
          );
          throw new Error(
            `Polling with getTransaction failed: ${pollingError instanceof Error ? pollingError.message : String(pollingError)}`
          );
        }
      }

      if (
        !getTxResponse ||
        getTxResponse.status !== rpc.Api.GetTransactionStatus.SUCCESS
      ) {
        throw new Error(
          `Transaction did not succeed after ${maxPollingAttempts} polling attempts. Last status: ${getTxResponse?.status ?? "unknown"}`
        );
      }

      // 5. Extrair informações do token da resposta (tokenId, tokenAddress, etc.)
      // Nota: Esta parte é complexa e requer parsing dos eventos da transação
      // Aqui estamos simplificando e assumindo que temos as informações
      const tokenId = "token_id_placeholder"; // Extrair do resultado
      const tokenAddress = "token_address_placeholder"; // Extrair do resultado
      const tokenManagerAddress = "token_manager_address_placeholder"; // Extrair do resultado
      const tokenManagerType = "mint_burn"; // Extrair do resultado

      // 6. Se houver destinationChainIds, fazer o deploy remoto
      let remoteDeployResult;
      if (destinationChainIds.length > 0) {
        onStatusUpdate?.({ type: "pending_approval", step: 2, totalSteps: 2 });

        // Obter os bytes da transação para deploy remoto
        const { transactionXDR: remoteTxXDR } =
          await getDeployRemoteTokensTxBytes({
            caller: publicKey,
            salt,
            tokenName,
            tokenSymbol,
            decimals,
            destinationChainIds,
            gasValues: gasValues.map((v) => v.toString()),
            minterAddress: minterAddress || publicKey,
          });

        // Assinar a transação
        const { signedTxXdr: signedRemoteTxXdr } = await kit.signTransaction(
          remoteTxXDR,
          {
            networkPassphrase: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
          }
        );

        // Enviar a transação
        const remoteTx = new Transaction(
          signedRemoteTxXdr,
          NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE
        );

        const remoteResponse = await server.sendTransaction(remoteTx);
        remoteDeployResult = {
          hash: remoteResponse.hash,
          status: remoteResponse.status,
        };
      }

      // 7. Retornar o resultado completo
      const result: DeployTokenResult = {
        hash: initialResponse.hash,
        status: "SUCCESS",
        tokenId,
        tokenAddress,
        tokenManagerAddress,
        tokenManagerType,
        remote: remoteDeployResult,
      };

      setData(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      onStatusUpdate?.({ type: "idle" });
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deployStellarToken,
    isLoading,
    error,
    data,
  };
}
