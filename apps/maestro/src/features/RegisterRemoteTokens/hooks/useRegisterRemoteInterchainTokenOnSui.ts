import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

import { suiClient as client } from "~/lib/clients/suiClient";
import { useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";

type RegisterRemoteInterchainTokenOnSuiInput = {
  axelarChainIds: string[];
  originChainId: number;
  tokenAddress: string;
  symbol: string;
  gasValues: bigint[];
};

export function useRegisterRemoteInterchainTokenOnSui() {
  const currentAccount = useAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) => {
        const result = await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showObjectChanges: true,
            showEvents: true,
            showEffects: true,
            showRawEffects: true,
          },
        });
        return result;
      },
    });

  const { mutateAsync: getRegisterRemoteInterchainTokenTx } =
    trpc.sui.getRegisterRemoteInterchainTokenTx.useMutation({
      onError(error) {
        console.log(
          "error in getRegisterRemoteInterchainTokenTx",
          error.message
        );
      },
    });

  const registerRemoteInterchainToken = async (
    input: RegisterRemoteInterchainTokenOnSuiInput
  ) => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    try {
      const registerTokenTxJSON = await getRegisterRemoteInterchainTokenTx({
        tokenAddress: input.tokenAddress,
        destinationChainIds: input.axelarChainIds,
        originChainId: input.originChainId,
        sender: currentAccount.address,
        symbol: input.symbol,
        gasValues: input.gasValues
      });

      const registerTokenResult = await signAndExecuteTransaction({
        transaction: registerTokenTxJSON,
      });

      return registerTokenResult;
    } catch (error) {
      console.error("Register remote token failed:", error);
      throw error;
    }
  };

  return {
    registerRemoteInterchainToken,
    isConnected: !!currentAccount,
    account: currentAccount,
  };
}
