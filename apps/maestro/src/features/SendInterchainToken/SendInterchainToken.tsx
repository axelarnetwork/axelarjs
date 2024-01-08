import type { EVMChainConfig } from "@axelarjs/api";
import { Button, FormControl, Label, Modal, TextInput } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { invariant } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { formatUnits, parseUnits } from "viem";

import { logger } from "~/lib/logger";
import { preventNonNumericInput } from "~/lib/utils/validation";
import BigNumberText from "~/ui/components/BigNumberText";
import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import GMPTxStatusMonitor from "~/ui/compounds/GMPTxStatusMonitor";
import { useSendInterchainTokenState } from "./SendInterchainToken.state";

type FormState = {
  amountToTransfer: string;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  kind: "canonical" | "interchain";
  sourceChain: EVMChainConfig;
  isOpen?: boolean;
  onClose?: () => void;
  originTokenAddress?: `0x${string}`;
  originTokenChainId?: number;
  balance: {
    tokenBalance: string;
    decimals: string | number | bigint | null;
  };
};

export const SendInterchainToken: FC<Props> = (props) => {
  const [state, actions] = useSendInterchainTokenState({
    tokenAddress: props.tokenAddress,
    tokenId: props.tokenId,
    sourceChain: props.sourceChain,
    isModalOpen: props.isOpen,
    kind: props.kind,
    originTokenAddress: props.originTokenAddress,
    originTokenChainId: props.originTokenChainId,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset: resetForm,
    setValue,
  } = useForm<FormState>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const amountToTransfer = watch("amountToTransfer");

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();

    invariant(state.selectedToChain, "selectedToChain is undefined");

    await actions.sendTokenAsync(
      {
        tokenAddress: props.tokenAddress,
        amount: data.amountToTransfer,
      },
      {
        // handles unhandled errors in the mutation
        onError(error) {
          if (error instanceof Error) {
            toast.error("Failed to transfer token. Please try again.");
            logger.always.error(error);
          }
        },
      }
    );
  };

  const buttonChildren = useMemo(() => {
    const pluralized = `token${Number(amountToTransfer) > 1 ? "s" : ""}`;

    switch (state.txState?.status) {
      case "awaiting_spend_approval":
        return "Approve spend on wallet";
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return (
          <>
            Transferring {amountToTransfer} {pluralized} to{" "}
            {state.selectedToChain?.name}
          </>
        );
      default:
        if (!formState.isValid) {
          return (
            formState.errors.amountToTransfer?.message ?? "Amount is required"
          );
        }
        return (
          <>
            Transfer {amountToTransfer || 0} {pluralized} to{" "}
            {state.selectedToChain?.name}
          </>
        );
    }
  }, [
    amountToTransfer,
    formState.errors.amountToTransfer?.message,
    formState.isValid,
    state.selectedToChain?.name,
    state.txState?.status,
  ]);

  const isFormDisabled = useMemo(
    () =>
      state.txState.status !== "idle" && state.txState.status !== "reverted",
    [state.txState.status]
  );

  const txHash = useMemo(
    () =>
      state.txState.status === "submitted" ? state.txState.hash : undefined,
    [state.txState]
  );

  useEffect(() => {
    if (!txHash) return;

    actions.trackTransaction({
      status: "submitted",
      hash: txHash,
      chainId: props.sourceChain.chain_id,
    });
  }, [actions, props.sourceChain, state.txState, txHash]);

  const handleAllChainsExecuted = useCallback(async () => {
    await actions.refetchBalances();
    resetForm();
    actions.resetTxState();
    actions.setIsModalOpen(false);
    toast.success("Tokens sent successfully!", {
      // use txHash as id to prevent duplicate toasts
      id: `token-sent:${txHash}`,
    });
  }, [actions, resetForm, txHash]);

  return (
    <Modal
      trigger={props.trigger}
      open={state.isModalOpen}
      disableCloseButton={
        state.txState.status === "awaiting_approval" ||
        state.txState.status === "awaiting_spend_approval"
      }
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          props.onClose?.();
          resetForm();
          actions.resetTxState();
        }
        actions.setIsModalOpen(isOpen);
      }}
    >
      <Modal.Body className="flex h-96 flex-col">
        <Modal.Title>Interchain Transfer</Modal.Title>
        <div className="my-4 grid grid-cols-2 gap-4 p-1">
          <div className="flex items-center gap-2">
            <label className="text-md align-top">From:</label>
            <EVMChainsDropdown
              disabled
              compact
              selectedChain={props.sourceChain}
              hideLabel={false}
              chainIconClassName="-translate-x-1.5"
              triggerClassName="w-full md:w-auto rounded-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-md align-top">To:</label>
            <EVMChainsDropdown
              compact
              hideLabel={false}
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
              chainIconClassName="-translate-x-1.5"
              triggerClassName="w-full md:w-auto"
            />
          </div>
        </div>

        <form
          className="flex flex-1 flex-col justify-between"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormControl>
            <Label htmlFor="amountToTransfer">
              <Label.Text>Amount to transfer</Label.Text>
              <Label.AltText
                role="button"
                aria-label="set max balance to transfer"
                onClick={() => {
                  setValue(
                    "amountToTransfer",
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
              id="amountToTransfer"
              bordered
              placeholder="Enter your amount to transfer"
              className="bg-base-200"
              min={0}
              onKeyDown={preventNonNumericInput}
              {...register("amountToTransfer", {
                disabled: isFormDisabled,
                validate(value) {
                  if (!value || value === "0") {
                    return "Amount must be greater than 0";
                  }

                  const bnBalance = parseUnits(
                    `${props.balance.tokenBalance}` as `${number}`,
                    Number(props.balance.decimals)
                  );

                  const bnValue = parseUnits(
                    value as `${number}`,
                    Number(props.balance.decimals)
                  );

                  if (bnValue > bnBalance) {
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
              onAllChainsExecuted={handleAllChainsExecuted}
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
