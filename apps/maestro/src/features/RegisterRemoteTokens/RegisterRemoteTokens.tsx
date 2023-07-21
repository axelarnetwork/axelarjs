import { LinkButton, toast } from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { useEffect, useMemo, type FC } from "react";

import { ExternalLinkIcon } from "lucide-react";
import { useAccount, useWaitForTransaction } from "wagmi";

import {
  useTransactionState,
  type TransactionState,
} from "~/lib/hooks/useTransactionState";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useGetTransactionStatusOnDestinationChainsQuery } from "~/services/gmp/hooks";
import { RegisterRemoteCanonicalTokens } from "./RegisterRemoteCanonicalTokens";
import { RegisterRemoteStandardizedTokens } from "./RegisterRemoteStandardizedTokens";

type Props = {
  tokenAddress: `0x${string}`;
  chainIds: number[];
  originChainId?: number;
  onTxStateChange?: (status: TransactionState) => void;
  existingTxHash?: `0x${string}` | null;
  deploymentKind: "canonical" | "standardized";
};

export const RegisterRemoteTokens: FC<Props> = ({
  existingTxHash,
  deploymentKind,
  onTxStateChange,
  ...props
}) => {
  const { address: deployerAddress } = useAccount();
  const [txState, setTxState] = useTransactionState();

  useEffect(
    () => {
      onTxStateChange?.(txState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txState]
  );

  const { mutateAsync: recordRemoteTokenDeployment } =
    trpc.interchainToken.recordRemoteTokensDeployment.useMutation();

  const { computed } = useEVMChainConfigsQuery();

  const txHash = useMemo(() => {
    if (txState.status === "submitted") {
      return txState.hash;
    }
    return existingTxHash;
  }, [txState, existingTxHash]);

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash:
      txState.status === "submitted"
        ? txState.hash
        : existingTxHash ?? undefined,
  });

  const pendingChains = useMemo(
    () =>
      statuses
        ? props.chainIds.filter(
            (chainId) => statuses[chainId]?.status !== "executed"
          )
        : undefined,
    [props.chainIds, statuses]
  );

  useEffect(() => {
    if (pendingChains && pendingChains.length === 0) {
      toast.success("Remote tokens registered");
    }
  }, [pendingChains]);

  useWaitForTransaction({
    hash: txState.status === "submitted" ? txState.hash : undefined,
    confirmations: 8,
    async onSuccess(receipt) {
      await recordRemoteTokenDeployment({
        tokenAddress: props.tokenAddress,
        chainId: props.originChainId ?? -1,
        deployerAddress: deployerAddress as `0x${string}`,
        remoteTokens: props.chainIds.map((chainId) => ({
          address: props.tokenAddress,
          status: "pending",
          chainId,
          tokenAddress: props.tokenAddress,
          deplymentTxHash: receipt.transactionHash,
          axelarChainId: computed.indexedByChainId[chainId].id,
        })),
      });

      setTxState({
        status: "confirmed",
        receipt,
      });
    },
  });

  const RegisterRemoteTokensAction = useMemo(() => {
    switch (deploymentKind) {
      case "canonical":
        return RegisterRemoteCanonicalTokens;
      case "standardized":
        return RegisterRemoteStandardizedTokens;
    }
  }, [deploymentKind]);

  return txHash ? (
    <LinkButton
      variant="accent"
      outline
      href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}`}
      className="flex items-center gap-2"
      target="_blank"
    >
      View on Axelarscan {maskAddress(txHash)}{" "}
      <ExternalLinkIcon className="h-4 w-4" />
    </LinkButton>
  ) : (
    <RegisterRemoteTokensAction {...props} onTxStateChange={setTxState} />
  );
};
