import type { EVMChainConfig } from "@axelarjs/api";
import {
  Button,
  FormControl,
  Label,
  Modal,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { useMemo, useState, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { TransactionExecutionError, UserRejectedRequestError } from "viem";
import { useWaitForTransaction } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useMintInterchainToken } from "~/lib/contract/hooks/useInterchainToken";
import { useTransactionState } from "~/lib/hooks/useTransaction";
import { trpc } from "~/lib/trpc";

type FormState = {
  amountToMint: string;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  sourceChain: EVMChainConfig;
  isOpen?: boolean;
  accountAddress: `0x${string}`;
  onClose?: () => void;
};

const ALLOWED_NON_NUMERIC_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
];

export const MintInterchainToken: FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(props.isOpen ?? false);
  const [txState, setTxState] = useTransactionState();

  const {
    writeAsync: mintTokenAsync,
    isLoading: isMinting,
    data: mintResult,
  } = useMintInterchainToken({
    address: props.tokenAddress,
  });

  const trpcContext = trpc.useContext();

  useWaitForTransaction({
    hash: mintResult?.hash,
    confirmations: 5,
    async onSuccess(receipt) {
      if (!mintResult) {
        return;
      }

      await trpcContext.erc20.getERC20TokenBalanceForOwner.invalidate();
      await trpcContext.erc20.getERC20TokenBalanceForOwner.refetch();

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Successfully minted interchain tokens");
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    reset: resetForm,
  } = useForm<FormState>({
    defaultValues: {
      amountToMint: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();

    const decimalAdjustment = BigInt(10 ** props.tokenDecimals);
    const adjustedAmount = BigInt(data.amountToMint) * decimalAdjustment;

    setTxState({
      status: "awaiting_approval",
    });

    const txResult = await mintTokenAsync({
      args: [props.accountAddress, adjustedAmount],
    }).catch((error) => {
      if (
        error instanceof TransactionExecutionError &&
        error.cause instanceof UserRejectedRequestError
      ) {
        console.log("User rejected request");
      }
    });

    if (txResult?.hash) {
      setTxState({
        status: "submitted",
        hash: txResult?.hash,
      });
    }
  };

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Mint tokens";
      case "awaiting_approval":
        return "Waiting for approval";
      case "reverted":
        return "Failed to mint tokens";
    }
  }, [txState]);

  return (
    <Modal
      trigger={props.trigger}
      disableCloseButton={isMinting}
      open={isModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (isMinting) {
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
          <span>Mint interchain tokens on</span>
          <EVMChainsDropdown disabled compact />
        </Modal.Title>
        <form
          className="flex flex-1 flex-col justify-between"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormControl>
            <Label htmlFor="amountToMint">
              <Label.Text>Amount to mint</Label.Text>
            </Label>
            <TextInput
              id="amountToMint"
              bordered
              placeholder="Enter your amount to mint"
              min={0}
              onKeyDown={(e) => {
                // prevent non-numeric characters
                if (
                  // allow backspace, delete, tab, arrow keys, enter
                  !ALLOWED_NON_NUMERIC_KEYS.includes(e.key) &&
                  // is not numeric
                  !/^[0-9.]+$/.test(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              {...register("amountToMint", {
                disabled: isMinting,
                validate(value) {
                  if (!value || value === "0") {
                    return "Amount must be greater than 0";
                  }

                  return true;
                },
              })}
            />
          </FormControl>

          <Button
            color="primary"
            type="submit"
            disabled={!formState.isValid || isMinting}
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

export default MintInterchainToken;
