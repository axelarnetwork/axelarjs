import { useState, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import type { EVMChainConfig } from "@axelarjs/api";
import {
  Button,
  FormControl,
  Label,
  Modal,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { useWaitForTransaction } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useMintInterchainToken } from "~/lib/contract/hooks/useInterchainToken";
import { trpc } from "~/lib/trpc";

type FormState = {
  amountToMint: string;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  tokenId: `0x${string}`;
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

type TransactionState =
  | "idle"
  | "pending_approval"
  | "pending_confirmation"
  | "confirmed"
  | "error";

export const MintInterchainToken: FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(props.isOpen ?? false);

  const [txState, setTxState] = useState<TransactionState>("idle");

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
    async onSuccess(receipt) {
      if (!mintResult) {
        return;
      }

      setTxState("confirmed");

      await trpcContext.erc20.getERC20TokenBalanceForOwner.refetch();

      toast.success("Successfully minted interchain tokens");

      console.log("receipt", receipt);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset: resetForm,
  } = useForm<FormState>({
    defaultValues: {
      amountToMint: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const amountToMint = watch("amountToMint");

  const submitHandler: SubmitHandler<FormState> = async (_data, e) => {
    e?.preventDefault();

    const decimalAdjustment = BigInt(10 ** props.tokenDecimals);
    const adjustedAmount = BigInt(amountToMint) * decimalAdjustment;

    setTxState("pending_approval");
    await mintTokenAsync({
      args: [props.accountAddress, adjustedAmount],
    });
    setTxState("pending_confirmation");
  };

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
          <EVMChainsDropdown
            disabled
            compact
            selectedChain={props.sourceChain}
          />
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
              txState === "pending_approval" ||
              txState === "pending_confirmation"
            }
          >
            Mint tokens
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default MintInterchainToken;
