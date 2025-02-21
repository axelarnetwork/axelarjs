import {
  Alert,
  Button,
  Dialog,
  FormControl,
  Label,
  TextInput,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { useCallback, useEffect, useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { isValidSuiAddress } from "@mysten/sui/utils";
import {
  isAddress,
  TransactionExecutionError,
  type TransactionReceipt,
} from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import { useWriteTokenManagerTransferOperatorship } from "~/lib/contracts/TokenManager.hooks";
import { SUI_CHAIN_ID, useChainId, useTransactionState } from "~/lib/hooks";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useTransferTreasuryCapMutation } from "../../hooks/useTransferTreasuryCapMutation";
import { useManageInterchainTokenContainer } from "../../ManageInterchaintoken.state";

type FormState = {
  recipientAddress: `0x${string}`;
};

export const TransferInterchainTokenOperatorship: FC = () => {
  const [txState, setTxState] = useTransactionState();
  const [state] = useManageInterchainTokenContainer();
  const chainId = useChainId();

  const { data: tokenDetails } =
    trpc.interchainToken.getInterchainTokenByTokenId.useQuery(
      {
        tokenId: state.tokenId,
      },
      {
        enabled: !!state.tokenId,
      }
    );

  const { register, handleSubmit, formState } = useForm<FormState>({
    defaultValues: {
      recipientAddress: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    writeContractAsync: transferOperatorshipAsync,
    isPending: isTransfering,
    data: transferTxHash,
  } = useWriteTokenManagerTransferOperatorship({
    // address: tokenDetails?.tokenManagerAddress as `0x${string}`,
  });

  const trpcContext = trpc.useUtils();

  const onSuccess = useCallback(
    (receipt?: TransactionReceipt) => {
      Promise.all([
        trpcContext.interchainToken.searchInterchainToken.invalidate(),
        trpcContext.interchainToken.getInterchainTokenBalanceForOwner.invalidate(),
      ]).catch((error) => {
        logger.error("Failed to invalidate queries", error);
      });

      Promise.all([
        trpcContext.interchainToken.searchInterchainToken.refetch(),
        trpcContext.interchainToken.getInterchainTokenBalanceForOwner.refetch(),
      ]).catch((error) => {
        logger.error("Failed to refetch queries", error);
      });

      setTxState({
        status: "confirmed",
        receipt: receipt ?? undefined,
      });

      toast.success("Successfully transferred token operatorship");
    },
    [
      setTxState,
      trpcContext.interchainToken.getInterchainTokenBalanceForOwner,
      trpcContext.interchainToken.searchInterchainToken,
    ]
  );

  const onReceipt = useCallback(
    (receipt?: TransactionReceipt) => {
      if (!transferTxHash) {
        return;
      }

      onSuccess(receipt);
    },
    [onSuccess, transferTxHash]
  );

  const { transferTreasuryCap } = useTransferTreasuryCapMutation();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: transferTxHash,
  });

  useEffect(() => {
    if (receipt) {
      onReceipt(receipt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt]);

  const submitHandler = useCallback<SubmitHandler<FormState>>(
    async (data, e) => {
      e?.preventDefault();

      setTxState({
        status: "awaiting_approval",
      });

      try {
        if (chainId === SUI_CHAIN_ID) {
          const result = await transferTreasuryCap(
            tokenDetails?.tokenAddress as string,
            data.recipientAddress
          );

          if (result?.digest) {
            setTxState({
              status: "submitted",
              hash: result.digest,
              chainId,
              suiTx: result,
            });
            onSuccess();
          }
        } else {
          const txHash = await transferOperatorshipAsync({
            address: tokenDetails?.tokenManagerAddress as `0x${string}`,
            args: [data.recipientAddress],
          });

          if (txHash) {
            setTxState({
              status: "submitted",
              chainId,
              hash: txHash,
            });
          }
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(
            `Failed to transfer token operatorship: ${error.cause.shortMessage}`
          );
          logger.error(
            `Failed to transfer token operatorship: ${error.cause.message}`
          );

          setTxState({
            status: "idle",
          });
          return;
        }

        setTxState({
          status: "reverted",
          error: error as Error,
        });
      }
    },
    [
      setTxState,
      chainId,
      transferTreasuryCap,
      tokenDetails?.tokenAddress,
      tokenDetails?.tokenManagerAddress,
      onSuccess,
      transferOperatorshipAsync,
    ]
  );

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Transfer token operatorship";
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Transfering token operatorship";
      case "reverted":
        return "Failed to transfer operatorship";
    }
  }, [txState]);

  return (
    <>
      <Dialog.Title className="flex">
        <span>Transfer rate limit operator</span>
      </Dialog.Title>
      {txState.status === "confirmed" ? (
        <Alert $status="success">
          Token operatorship has been successfully transferred.
        </Alert>
      ) : (
        <form
          className="flex flex-1 flex-col justify-between gap-4"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormControl>
            <Label htmlFor="recipientAddress">
              <Label.Text>New operator address</Label.Text>
            </Label>
            <TextInput
              id="recipientAddress"
              $bordered
              placeholder="Enter new operator address"
              className="bg-base-200"
              min={0}
              {...register("recipientAddress", {
                disabled: isTransfering,
                validate(value) {
                  if (!value) return "Address is required";

                  if (chainId === SUI_CHAIN_ID) {
                    if (!isValidSuiAddress(value)) {
                      return "Invalid Sui address";
                    }
                  } else {
                    if (!isAddress(value)) {
                      return "Invalid EVM address";
                    }
                  }

                  return true;
                },
              })}
            />
          </FormControl>

          <Button
            type="submit"
            disabled={!formState.isValid || isTransfering}
            $variant="primary"
            $loading={
              txState.status === "awaiting_approval" ||
              txState.status === "submitted"
            }
          >
            {buttonChildren}
          </Button>
        </form>
      )}
    </>
  );
};

export default TransferInterchainTokenOperatorship;
