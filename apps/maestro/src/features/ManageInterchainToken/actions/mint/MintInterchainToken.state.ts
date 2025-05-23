import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect } from "react";

import { isAddress, type TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import { useWriteIerc20MintableBurnableMint } from "~/lib/contracts/IERC20MintableBurnable.hooks";
import { useAccount, useChainId } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { trpc } from "~/lib/trpc";
import { useManageInterchainTokenContainer } from "../../ManageInterchaintoken.state";

export function useMintInterchainTokenState() {
  const [txState, setTxState] = useTransactionState();
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();

  const [managerState] = useManageInterchainTokenContainer();

  const { data: erc20Details } =
    trpc.nativeTokens.getNativeTokenDetails.useQuery(
      {
        tokenAddress: managerState.tokenAddress,
        chainId,
      },
      {
        enabled: isAddress(managerState.tokenAddress) && Boolean(chainId),
      }
    );

  const {
    writeContractAsync: mintTokenAsync,
    isPending: isMinting,
    data: mintTxHash,
  } = useWriteIerc20MintableBurnableMint({
    // address: managerState.tokenAddress,
  });

  const trpcContext = trpc.useUtils();

  const onReceipt = useCallback(
    async function (receipt: TransactionReceipt) {
      if (!mintTxHash) {
        return;
      }

      await trpcContext.interchainToken.getInterchainTokenBalanceForOwner.invalidate();
      await trpcContext.interchainToken.getInterchainTokenBalanceForOwner.refetch(
        {
          chainId,
          tokenAddress: managerState.tokenAddress,
          owner: accountAddress,
        }
      );

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Successfully minted interchain tokens");
    },
    [
      mintTxHash,
      trpcContext.interchainToken.getInterchainTokenBalanceForOwner,
      chainId,
      managerState.tokenAddress,
      accountAddress,
      setTxState,
    ]
  );

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  useEffect(
    () => {
      if (!receipt) return;
      onReceipt(receipt).catch((err) => {
        console.error("useMintInterchainTokenState: onReceipt", err);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt]
  );

  const state = {
    txState,
    accountAddress,
    erc20Details,
    isMinting,
    tokenAddress: managerState.tokenAddress,
    tokenId: managerState.tokenId,
  };

  const actions = {
    setTxState,
    mintTokenAsync,
  };

  return [state, actions] as const;
}
