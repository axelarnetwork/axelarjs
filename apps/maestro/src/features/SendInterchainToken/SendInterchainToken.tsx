import type { EVMChainConfig } from "@axelarjs/api";
import {
  Button,
  FormControl,
  Label,
  Modal,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import invariant from "tiny-invariant";
import { formatUnits, parseUnits } from "viem";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import GMPTxStatusMonitor from "~/compounds/GMPTxStatusMonitor";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useSendInterchainTokenState } from "./SendInterchainToken.state";

type FormState = {
  amountToSend: string;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  sourceChain: EVMChainConfig;
  isOpen?: boolean;
  onClose?: () => void;
  balance: {
    tokenBalance: string;
    decimals: string | number;
  };
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

export const SendInterchainToken: FC<Props> = (props) => {
  const [state, actions] = useSendInterchainTokenState({
    tokenAddress: props.tokenAddress,
    sourceChain: props.sourceChain,
    isModalOpen: props.isOpen,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset: resetForm,
    setValue,
  } = useForm<FormState>({
    defaultValues: {
      amountToSend: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const amountToSend = watch("amountToSend");

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();

    invariant(state.selectedToChain, "selectedToChain is undefined");

    await actions.sendTokenAsync(
      {
        tokenAddress: props.tokenAddress,
        amount: data.amountToSend,
        onStatusUpdate(state) {
          if (state.status === "reverted") {
            toast.error("Failed to send token. Please try again.");
            logger.always.error(state.error);
          }

          actions.setTxState(state);
        },
      },
      {
        // handles unhandled errors in the mutation
        onError(error) {
          if (error instanceof Error) {
            toast.error("Failed to send token. Please try again.");
            logger.always.error(error);
          }
        },
      }
    );
  };

  const buttonChildren = useMemo(() => {
    switch (state.txState?.status) {
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return (
          <>
            Sending {amountToSend} tokens to {state.selectedToChain?.name}
          </>
        );
      default:
        if (!formState.isValid) {
          return formState.errors.amountToSend?.message ?? "Amount is reauired";
        }
        return (
          <>
            Send {amountToSend || 0} tokens to {state.selectedToChain?.name}
          </>
        );
    }
  }, [
    amountToSend,
    formState.errors.amountToSend?.message,
    formState.isValid,
    state.selectedToChain?.name,
    state.txState?.status,
  ]);

  const trpcContext = trpc.useContext();

  const isFormDisabled =
    state.txState.status !== "idle" && state.txState.status !== "reverted";

  return (
    <Modal
      trigger={props.trigger}
      disableCloseButton={isFormDisabled}
      open={state.isModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (isFormDisabled) {
            return;
          }
          props.onClose?.();
          resetForm();
          actions.setTxState({ status: "idle" });
        }
        actions.setIsModalOpen(isOpen);
      }}
    >
      <Modal.Body className="flex h-96 flex-col">
        <Modal.Title>Send interchain token</Modal.Title>
        <div className="my-4 grid grid-cols-2 gap-4 p-1">
          <div className="flex items-center gap-2">
            <label className="text-md align-top">From:</label>
            <EVMChainsDropdown
              disabled
              compact
              selectedChain={props.sourceChain}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-md align-top">To:</label>
            <EVMChainsDropdown
              compact
              selectedChain={state.selectedToChain}
              chains={state.eligibleTargetChains}
              disabled={
                isFormDisabled || state.eligibleTargetChains.length <= 1
              }
              onSelectChain={(chain) => {
                if (chain) {
                  actions.selectToChain(chain.chain_id);
                }
              }}
              contentClassName="translate-x-20"
            />
          </div>
        </div>

        <form
          className="flex flex-1 flex-col justify-between"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormControl>
            <Label htmlFor="amountToSend">
              <Label.Text>Amount to send</Label.Text>
              <Label.AltText
                role="button"
                onClick={() => {
                  setValue(
                    "amountToSend",
                    formatUnits(
                      BigInt(props.balance.tokenBalance),
                      Number(props.balance.decimals)
                    ).replace(/,/gi, "")
                  );
                }}
              >
                Balance:{" "}
                <BigNumberText
                  decimals={Number(props.balance.decimals)}
                  localeOptions={{
                    style: "decimal",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  }}
                >
                  {BigInt(props.balance.tokenBalance)}
                </BigNumberText>
              </Label.AltText>
            </Label>
            <TextInput
              id="amountToSend"
              bordered
              placeholder="Enter your amount to send"
              className="bg-base-200"
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
              {...register("amountToSend", {
                disabled: isFormDisabled,
                validate(value) {
                  if (!value || value === "0") {
                    return "Amount must be greater than 0";
                  }

                  const bnBalance = parseUnits(
                    `${props.balance.tokenBalance}` as `${number}`,
                    Number(props.balance.decimals)
                  );

                  if (BigInt(value) > bnBalance) {
                    return "Insufficient balance";
                  }

                  return true;
                },
              })}
            />
          </FormControl>
          {state.txState.status === "submitted" && (
            <GMPTxStatusMonitor
              txHash={state.txState.hash}
              onAllChainsExecuted={async () => {
                await trpcContext.erc20.getERC20TokenBalanceForOwner.refetch();
                resetForm();
                actions.setTxState({ status: "idle" });
                toast.success("Tokens sent successfully!");
              }}
            />
          )}
          <Button
            variant="primary"
            type="submit"
            disabled={!formState.isValid || isFormDisabled}
            loading={state.isSending}
          >
            {buttonChildren}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SendInterchainToken;
