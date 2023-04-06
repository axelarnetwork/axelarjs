import {
  AxelarQueryAPI,
  Environment,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";
import { useAccount, useMutation, useSigner } from "wagmi";

import { useERC20 } from "~/lib/contract/hooks/useERC20";
import { useInterchainTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";

export const gasTokenMap: Record<string, GasToken> = {
  avalanche: GasToken.AVAX,
  "ethereum-2": GasToken.ETH,
  ethereum: GasToken.ETH,
  moonbeam: GasToken.GLMR,
  fantom: GasToken.FTM,
  polygon: GasToken.MATIC,
  aurora: GasToken.AURORA,
  binance: GasToken.BINANCE,
  celo: GasToken.CELO,
  kava: GasToken.KAVA,
};

export type TransactionState =
  | { type: "idle" }
  | { type: "failed"; error: Error }
  | { type: "awaiting_approval" }
  | { type: "awaiting_confirmation"; txHash: `0x${string}` }
  | { type: "sending"; txHash: `0x${string}` };

export type UseSendInterchainTokenConfig = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
};

export type UseSendInterchainTokenInput = {
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  toNetwork: string;
  fromNetwork: string;
  amount: string;
  onFinished?: () => void;
  onStatusUpdate?: (message: TransactionState) => void;
};

export function useSendInterchainTokenMutation(
  config: UseSendInterchainTokenConfig
) {
  const signer = useSigner();
  const erc20 = useERC20({
    address: config.tokenAddress,
    signerOrProvider: signer.data,
  });

  const { address } = useAccount();

  const tokenLinker = useInterchainTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
  });

  return useMutation(async (input: UseSendInterchainTokenInput) => {
    if (!(erc20 && address && tokenLinker)) {
      console.log("useMutation SendInterchainTokenModal: return erc20", erc20);
      console.log(
        "useMutation SendInterchainTokenModal: return address",
        address
      );
      console.log(
        "useMutation SendInterchainTokenModal: return tokenLInker",
        tokenLinker
      );
      return;
    }

    const { toNetwork, fromNetwork, onFinished, onStatusUpdate } = input;

    const decimals = await erc20.decimals();
    const bigNumberAmount = BigNumber.from(parseUnits(input.amount, decimals));
    const environment = process.env.NEXT_PUBLIC_NETWORK_ENV as Environment;
    const axelarQueryAPI = new AxelarQueryAPI({ environment });
    const gas = await axelarQueryAPI.estimateGasFee(
      fromNetwork,
      toNetwork,
      gasTokenMap[fromNetwork.toLowerCase()]
    );

    //approve
    try {
      onStatusUpdate?.({ type: "awaiting_approval" });
      const tx = await erc20.approve(tokenLinker.address, bigNumberAmount);

      onStatusUpdate?.({
        type: "awaiting_confirmation",
        txHash: tx.hash as `0x${string}`,
      });

      // wait for tx to be mined
      await tx.wait(1);
    } catch (e) {
      if (e instanceof Error) {
        onStatusUpdate?.({ type: "failed", error: e });
      } else {
        onStatusUpdate?.({
          type: "failed",
          error: new Error("failed to approve token spend amount"),
        });
      }

      return;
    }

    try {
      //send token
      const sendTokenTx = await tokenLinker.sendToken(
        input.tokenId,
        input.toNetwork,
        address,
        bigNumberAmount,
        { value: BigNumber.from(gas) }
      );

      onStatusUpdate?.({
        type: "sending",
        txHash: sendTokenTx.hash as `0x${string}`,
      });

      await sendTokenTx.wait(1);

      if (onFinished) {
        onFinished();
      }
    } catch (e) {
      if (e instanceof Error) {
        onStatusUpdate?.({ type: "failed", error: e });
      } else {
        onStatusUpdate?.({
          type: "failed",
          error: new Error("Failed to send token"),
        });
      }

      return;
    }
  });
}
