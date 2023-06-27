import {
  Alert,
  Button,
  Dialog,
  FormControl,
  Label,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { useCallback, useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { isAddress, TransactionExecutionError } from "viem";
import { useWaitForTransaction } from "wagmi";

import { useTransferInterchainTokenOnwership } from "~/lib/contract/hooks/useInterchainToken";
import { useTransactionState } from "~/lib/hooks/useTransaction";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useManageInterchainTokenContainer } from "../../ManageInterchaintoken.state";

type FormState = {
  recipientAddress: `0x${string}`;
};

export const TransferInterchainTokenOwnership: FC = () => {
  const [txState, setTxState] = useTransactionState();
  const [state] = useManageInterchainTokenContainer();

  const {
    writeAsync: transferOwnershipAsync,
    isLoading: isTransfering,
    data: transferResult,
  } = useTransferInterchainTokenOnwership({
    address: state.tokenAddress,
  });

  const trpcContext = trpc.useContext();

  useWaitForTransaction({
    hash: transferResult?.hash,
    confirmations: 8,
    async onSuccess(receipt) {
      if (!transferResult) {
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

      toast.success("Successfully transferred token ownership");
    },
  });

  const { register, handleSubmit, formState } = useForm<FormState>({
    defaultValues: {
      recipientAddress: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitHandler = useCallback<SubmitHandler<FormState>>(
    async (data, e) => {
      e?.preventDefault();

      setTxState({
        status: "awaiting_approval",
      });

      try {
        const txResult = await transferOwnershipAsync({
          args: [data.recipientAddress],
        });

        if (txResult?.hash) {
          setTxState({
            status: "submitted",
            hash: txResult?.hash,
          });
        }
      } catch (error) {
        if (error instanceof TransactionExecutionError) {
          toast.error(
            `Failed to transfer token ownership: ${error.cause.shortMessage}`
          );
          logger.error(`Failed to transfer token ownership: ${error.cause}`);

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
    [setTxState, transferOwnershipAsync]
  );

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Transfer token ownership";
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Transfering token ownership";
      case "reverted":
        return "Failed to transfer ownership";
    }
  }, [txState]);

  return (
    <>
      <Dialog.Title className="flex">
        <span>Transfer token ownership</span>
      </Dialog.Title>
      {txState.status === "confirmed" ? (
        <Alert status="success">
          Token ownership has been successfully transferred. The recipient now
          must accept the ownership transfer.
        </Alert>
      ) : (
        <form
          className="flex flex-1 flex-col justify-between gap-4"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormControl>
            <Label htmlFor="recipientAddress">
              <Label.Text>Recipient address</Label.Text>
            </Label>
            <TextInput
              id="recipientAddress"
              bordered
              placeholder="Enter recipient address"
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

export default TransferInterchainTokenOwnership;
