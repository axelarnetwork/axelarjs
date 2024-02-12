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

import {
  isAddress,
  TransactionExecutionError,
  type TransactionReceipt,
} from "viem";
import { useChainId, useWaitForTransactionReceipt } from "wagmi";

import { useWriteInterchainTokenTransferMintership } from "~/lib/contracts/InterchainToken.hooks";
import { useTransactionState } from "~/lib/hooks/useTransactionState";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useManageInterchainTokenContainer } from "../../ManageInterchaintoken.state";

type FormState = {
  recipientAddress: `0x${string}`;
};

export const TransferInterchainTokenMintership: FC = () => {
  const [txState, setTxState] = useTransactionState();
  const [state] = useManageInterchainTokenContainer();
  const chainId = useChainId();

  const { register, handleSubmit, formState } = useForm<FormState>({
    defaultValues: {
      recipientAddress: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    writeContractAsync: transferMintershipAsync,
    isPending: isTransfering,
    data: transferTxHash,
  } = useWriteInterchainTokenTransferMintership();

  const trpcContext = trpc.useUtils();

  const onReceipt = useCallback(
    async (receipt: TransactionReceipt) => {
      if (!transferTxHash) {
        return;
      }

      await Promise.all([
        trpcContext.interchainToken.searchInterchainToken.invalidate(),
        trpcContext.erc20.getERC20TokenBalanceForOwner.invalidate(),
      ]);

      await Promise.all([
        trpcContext.interchainToken.searchInterchainToken.refetch(),
        trpcContext.erc20.getERC20TokenBalanceForOwner.refetch(),
      ]);

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Successfully transferred token mintership");
    },
    [
      setTxState,
      transferTxHash,
      trpcContext.erc20.getERC20TokenBalanceForOwner,
      trpcContext.interchainToken.searchInterchainToken,
    ]
  );

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: transferTxHash,
    confirmations: 8,
  });

  useEffect(
    () => {
      if (receipt) {
        onReceipt(receipt).catch((error) => {
          logger.error("Failed to process receipt", error);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receipt]
  );

  const submitHandler = useCallback<SubmitHandler<FormState>>(
    async (data, e) => {
      e?.preventDefault();

      setTxState({
        status: "awaiting_approval",
      });

      try {
        const txHash = await transferMintershipAsync({
          address: state.tokenAddress,
          args: [data.recipientAddress],
        });

        if (txHash) {
          setTxState({
            status: "submitted",
            chainId,
            hash: txHash,
          });
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(
            `Failed to transfer token mintership: ${error.cause.shortMessage}`
          );
          logger.error(
            `Failed to transfer token mintership: ${error.cause.message}`
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
    [chainId, setTxState, state.tokenAddress, transferMintershipAsync]
  );

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Transfer token mintership";
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Transfering token mintership";
      case "reverted":
        return "Failed to transfer mintership";
    }
  }, [txState]);

  return (
    <>
      <Dialog.Title className="flex">
        <span>Transfer token mintership</span>
      </Dialog.Title>
      {txState.status === "confirmed" ? (
        <Alert status="success">
          Token mintership has been successfully transferred.
        </Alert>
      ) : (
        <form
          className="flex flex-1 flex-col justify-between gap-4"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormControl>
            <Label htmlFor="recipientAddress">
              <Label.Text>New minter</Label.Text>
            </Label>
            <TextInput
              id="recipientAddress"
              bordered
              placeholder="Enter new minter"
              className="bg-base-200"
              min={0}
              {...register("recipientAddress", {
                disabled: isTransfering,
                validate(value) {
                  if (!value || !isAddress(value)) {
                    return "Invalid address";
                  }

                  return true;
                },
              })}
            />
          </FormControl>

          <Button
            variant="primary"
            type="submit"
            disabled={!formState.isValid || isTransfering}
            loading={
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

export default TransferInterchainTokenMintership;
