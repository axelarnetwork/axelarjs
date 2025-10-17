import { useEffect, useRef } from "react";

import { isAddress } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import { HEDERA_CHAIN_ID } from "~/config/chains";
import { useWriteIerc20MintableBurnableMint } from "~/lib/contracts/IERC20MintableBurnable.hooks";
import { useWriteTokenManagerMintToken } from "~/lib/contracts/TokenManager.hooks";
import { useAccount, useChainId } from "~/lib/hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { trpc } from "~/lib/trpc";
import { useManageInterchainTokenContainer } from "../../ManageInterchainToken.state";

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
    writeContractAsync: mintErc20Async,
    isPending: isEvmMinting,
    data: evmMintTxHash,
  } = useWriteIerc20MintableBurnableMint({});

  const {
    writeContractAsync: mintTokenManagerAsync,
    isPending: isHederaMinting,
    data: hederaMintTxHash,
  } = useWriteTokenManagerMintToken({});

  const trpcContext = trpc.useUtils();
  const hash = evmMintTxHash ?? hederaMintTxHash;
  const handledHashRef = useRef<string | null>(null);

  const {
    data: receipt,
    isSuccess: isReceiptSuccess,
    isError: isReceiptError,
    error: receiptError,
    isPending: isReceiptPending,
    isFetching: isReceiptFetching,
  } = useWaitForTransactionReceipt({
    hash: evmMintTxHash ?? hederaMintTxHash,
  });

  useEffect(() => {
    if (!hash) return;
    if (handledHashRef.current === hash) return;
    if (!(isReceiptSuccess || isReceiptError)) return;

    handledHashRef.current = hash;

    async function handleReceipt() {
      if (isReceiptSuccess && receipt && receipt.status === "success") {
        await trpcContext.interchainToken.getInterchainTokenBalanceForOwner.invalidate();
        await trpcContext.interchainToken.getInterchainTokenBalanceForOwner.refetch(
          {
            chainId,
            tokenAddress: managerState.tokenAddress,
            owner: accountAddress,
          }
        );
        setTxState({ status: "confirmed", receipt });
        return;
      }

      if (isReceiptError || (receipt && receipt.status !== "success")) {
        setTxState({ status: "reverted", error: new Error("tx reverted") });
        return;
      }
    }

    handleReceipt().catch((err) => {
      console.error("useMintInterchainTokenState: handleReceipt", err);
      setTxState({ status: "reverted", error: err as Error });
    });
  }, [
    isReceiptSuccess,
    isReceiptError,
    receiptError,
    isReceiptPending,
    isReceiptFetching,
    receipt,
    setTxState,
    evmMintTxHash,
    hederaMintTxHash,
    chainId,
    managerState.tokenAddress,
    accountAddress,
    hash,
    trpcContext.interchainToken.getInterchainTokenBalanceForOwner,
  ]);

  const state = {
    txState,
    accountAddress,
    erc20Details,
    isMinting: isEvmMinting || isHederaMinting,
    tokenAddress: managerState.tokenAddress,
    tokenId: managerState.tokenId,
  };

  const actions = {
    setTxState,
    mintTokenAsync: async (params: {
      address?: `0x${string}`;
      args?: readonly unknown[] | undefined;
    }) => {
      // Hedera: mint via TokenManager
      if (chainId === HEDERA_CHAIN_ID) {
        if (
          !managerState.tokenManagerAddress ||
          managerState.tokenManagerAddress === "0x"
        ) {
          throw new Error("Missing token manager address");
        }
        return mintTokenManagerAsync({
          address: managerState.tokenManagerAddress,
          args: [
            managerState.tokenAddress,
            (params.args?.[0] as `0x${string}`) ?? accountAddress,
            params.args?.[1] as bigint,
          ],
        });
      }

      // EVM default: mint on token contract
      return mintErc20Async(params as any);
    },
  };

  return [state, actions] as const;
}
