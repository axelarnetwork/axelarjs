import { toast } from "@axelarjs/ui/toaster";

import { isAddress } from "viem";
import { useAccount, useChainId, useWaitForTransaction } from "wagmi";

import { useIerc20MintableBurnableMint } from "~/lib/contracts/IERC20MintableBurnable.hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { trpc } from "~/lib/trpc";
import { useManageInterchainTokenContainer } from "../../ManageInterchaintoken.state";

export function useMintInterchainTokenState() {
  const [txState, setTxState] = useTransactionState();
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();

  const [managerState] = useManageInterchainTokenContainer();

  const { data: erc20Details } = trpc.erc20.getERC20TokenDetails.useQuery(
    {
      tokenAddress: managerState.tokenAddress,
      chainId,
    },
    {
      enabled: isAddress(managerState.tokenAddress) && Boolean(chainId),
    }
  );

  const {
    writeAsync: mintTokenAsync,
    isLoading: isMinting,
    data: mintResult,
  } = useIerc20MintableBurnableMint({
    address: managerState.tokenAddress,
  });

  const trpcContext = trpc.useUtils();

  useWaitForTransaction({
    hash: mintResult?.hash,
    confirmations: 8,
    async onSuccess(receipt) {
      if (!mintResult) {
        return;
      }

      await trpcContext.erc20.getERC20TokenBalanceForOwner.invalidate();
      await trpcContext.erc20.getERC20TokenBalanceForOwner.refetch({
        chainId,
        tokenAddress: managerState.tokenAddress,
        owner: accountAddress as `0x${string}`,
      });

      setTxState({
        status: "confirmed",
        receipt,
        hash: mintResult.hash,
        chainId,
      });

      toast.success("Successfully minted interchain tokens");
    },
  });

  const state = {
    txState,
    accountAddress,
    erc20Details,
    isMinting,
  };

  const actions = {
    setTxState,
    mintTokenAsync,
  };

  return [state, actions] as const;
}
