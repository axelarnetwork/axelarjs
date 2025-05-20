import { useMutation } from '@tanstack/react-query';
import { rpc, Transaction } from '@stellar/stellar-sdk';

import { useStellarKit } from '~/lib/providers/StellarWalletKitProvider';
import { useStellarTransactionPoller } from './useStellarTransactionPoller';
import { trpc } from '~/lib/trpc';
import { STELLAR_RPC_URL } from '~/server/routers/stellar/utils/config';
import { useTransactionState } from '~/lib/hooks/useTransactionState';
import { useChainId } from '~/lib/hooks';

export interface SendStellarTokenParams {
  tokenId: string;
  destinationChain: string;
  destinationAddress: string;
  amount: number;
  gasValue: number;
}

export interface SendStellarTokenOptions {
  onStatusUpdate?: (status: {
    type: string;
    txHash?: string;
    attempt?: number;
    totalAttempts?: number;
  }) => void;
}

/**
 * Hook for sending Stellar tokens to other chains
 */
export function useSendStellarToken() {
  const [txState, setTxState] = useTransactionState();
  const { kit } = useStellarKit();
  const { pollTransaction } = useStellarTransactionPoller();
  const chainId = useChainId();

  // Get the transaction bytes from the backend
  const { mutateAsync: getSendTokenTxBytes } = trpc.stellar.getSendTokenTxBytes.useMutation({
    onError(error) {
      console.log('Error in getSendTokenTxBytes:', error);
    },
  });

  /**
   * Send a Stellar token to another chain
   */
  const sendToken = useMutation<
    { hash: string },
    Error,
    SendStellarTokenParams & { caller: string } & SendStellarTokenOptions
  >({
    mutationFn: async ({ caller, tokenId, destinationChain, destinationAddress, amount, gasValue, onStatusUpdate }) => {
      if (!kit) {
        throw new Error('Stellar wallet kit is not available');
      }

      setTxState({
        status: 'awaiting_approval',
      });

      try {
        // Get transaction bytes from the backend
        const { transactionXDR } = await getSendTokenTxBytes({
          caller,
          tokenId,
          destinationChain,
          destinationAddress,
          amount,
          gasValue,
        });

        // Sign the transaction
        const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
          networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || '',
        });

        // Submit the transaction
        const server = new rpc.Server(STELLAR_RPC_URL, {
          allowHttp: STELLAR_RPC_URL.startsWith('http://'),
        });
        
        const tx = new Transaction(
          signedTxXdr,
          process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || ''
        );
        
        const initialResponse = await server.sendTransaction(tx);
        
        if (initialResponse.status === 'PENDING' && initialResponse.hash) {
          const txHash = initialResponse.hash;
          
          setTxState({
            status: 'submitted',
            hash: txHash,
            chainId,
          });
          
          // Start polling for the transaction status
          const result = await pollTransaction(server, txHash, {
            onStatusUpdate: (status) => {
              // Forward status updates to the caller
              onStatusUpdate?.(status);
              
              // Update the transaction state based on polling status
              if (status.type === 'polling' && status.txHash) {
                console.log(`Polling attempt ${status.attempt}/${status.totalAttempts} for ${status.txHash}`);
              }
            },
          });
          
          if (result.status === 'SUCCESS') {
            setTxState({
              status: 'confirmed',
              hash: txHash,
            });
            return { hash: txHash };
          } else if (result.status === 'FAILED') {
            const error = result.error || new Error('Transaction failed');
            setTxState({
              status: 'reverted',
              error,
            });
            throw error;
          } else {
            setTxState({
              status: 'reverted',
              error: new Error('Transaction timed out'),
            });
            throw new Error('Transaction timed out');
          }
        } else {
          setTxState({
            status: 'reverted',
            error: new Error(`Transaction submission failed with status: ${initialResponse.status}`),
          });
          throw new Error(`Transaction submission failed with status: ${initialResponse.status}`);
        }
      } catch (error) {
        setTxState({
          status: 'reverted',
          error: error instanceof Error ? error : new Error(String(error)),
        });
        throw error;
      }
    },
  });

  return {
    sendToken,
    txState,
    reset: () => {
      setTxState({ status: 'idle' });
      sendToken.reset();
    },
  };
}
