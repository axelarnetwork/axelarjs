import type { EVMChainConfig } from "@axelarjs/api";
import {
  Button,
  FormControl,
  Label,
  Modal,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { useCallback, useMemo, useState, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { isAddress } from "viem";
import { useWaitForTransaction } from "wagmi";

import { useTransferInterchainTokenOnwership } from "~/lib/contract/hooks/useInterchainToken";
import { useTransactionState } from "~/lib/hooks/useTransaction";
import { trpc } from "~/lib/trpc";

type FormState = {
  recipientAddress: `0x${string}`;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChain: EVMChainConfig;
  isOpen?: boolean;
  accountAddress: `0x${string}`;
  onClose?: () => void;
};

export const TransferInterchainTokenOwnership: FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(props.isOpen ?? false);
  const [txState, setTxState] = useTransactionState();

  const {
    writeAsync: transferOwnershipAsync,
    isLoading: isTransfering,
    data: transferResult,
  } = useTransferInterchainTokenOnwership({
    address: props.tokenAddress,
  });

  const trpcContext = trpc.useContext();

  useWaitForTransaction({
    hash: transferResult?.hash,
    confirmations: 5,
    async onSuccess(receipt) {
      if (!transferResult) {
        return;
      }

      await trpcContext.interchainToken.searchInterchainToken.invalidate();
      await trpcContext.interchainToken.searchInterchainToken.refetch();

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Successfully transferred token ownership");
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    reset: resetForm,
  } = useForm<FormState>({
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

      const txResult = await transferOwnershipAsync({
        args: [data.recipientAddress],
      });

      setTxState({
        status: "submitted",
        hash: txResult?.hash,
      });
    },
    [setTxState, transferOwnershipAsync]
  );

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Transfer token ownership";
      case "awaiting_approval":
        return "Waiting for approval";
      case "reverted":
        return "Failed to transfer ownership";
    }
  }, [txState]);

  return (
    <Modal
      trigger={props.trigger}
      disableCloseButton={isTransfering}
      open={isModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (isTransfering) {
            return;
          }
          props.onClose?.();
          resetForm();
        }
        setIsModalOpen(isOpen);
      }}
    >
      <Modal.Body className="flex h-96 flex-col">
        <Modal.Title className="flex">
          <span>Transfer interchain token ownership</span>
        </Modal.Title>
        <form
          className="flex flex-1 flex-col justify-between"
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
            color="primary"
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
      </Modal.Body>
    </Modal>
  );
};

export default TransferInterchainTokenOwnership;
