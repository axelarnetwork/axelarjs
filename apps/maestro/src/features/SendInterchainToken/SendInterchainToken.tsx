import type { EVMChainConfig } from "@axelarjs/api";
import {
  Alert,
  Button,
  EyeIcon,
  FormControl,
  Label,
  Modal,
  TextInput,
  Tooltip,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { invariant } from "@axelarjs/utils";
import { useCallback, useEffect, useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { formatUnits, parseUnits } from "viem";

import { SUI_CHAIN_ID, useAccount } from "~/lib/hooks";
import { logger } from "~/lib/logger";
import {
  isValidEVMAddress,
  preventNonNumericInput,
} from "~/lib/utils/validation";
import BigNumberText from "~/ui/components/BigNumberText";
import ChainsDropdown from "~/ui/components/ChainsDropdown";
import GMPTxStatusMonitor from "~/ui/compounds/GMPTxStatusMonitor";
import { ShareHaikuButton } from "~/ui/compounds/MultiStepForm";
import { useSendInterchainTokenState } from "./SendInterchainToken.state";

type FormState = {
  amountToTransfer: string;
  destinationAddress: string;
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
  const { address } = useAccount();
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
        tokenId: props.tokenId,
        destinationAddress: data.destinationAddress,
        decimals: Number(props.balance.decimals),
      },
      {
        onError(error) {
          if (error instanceof Error) {
            toast.error("Failed to transfer token. Please try again.");
            logger.always.error(error);
          }
        },
        onSuccess() {
          void actions.refetchBalances();
        },
      }
    );
  };

  const { children: buttonChildren, status: buttonStatus } = useMemo(() => {
    const pluralized = `token${Number(amountToTransfer) > 1 ? "s" : ""}`;

    switch (state.txState?.status) {
      case "awaiting_spend_approval":
        return {
          children: "Approve spend on wallet",
          status: "loading",
        };
      case "awaiting_approval":
        return {
          children: "Confirm on wallet",
          status: "loading",
        };
      case "submitted":
        return {
          children: (
            <>
              Transferring {amountToTransfer} {pluralized} to{" "}
              {state.selectedToChain?.name}
            </>
          ),
          status: "loading",
        };
      default:
        if (!formState.isValid) {
          return {
            children:
              formState.errors.amountToTransfer?.message ??
              formState.errors.destinationAddress?.message ??
              "Please fill in all required fields",
            status: "error",
          };
        }

        if (state.hasInsufficientGasBalance) {
          return {
            children: `Insufficient ${state.nativeTokenSymbol} for gas fees`,
            status: "error",
          };
        }

        return {
          children: (
            <>
              Transfer {amountToTransfer || 0} {pluralized} to{" "}
              {state.selectedToChain?.name}
            </>
          ),
          status: "idle",
        };
    }
  }, [
    amountToTransfer,
    formState.errors.amountToTransfer?.message,
    formState.errors.destinationAddress?.message,
    formState.isValid,
    state.hasInsufficientGasBalance,
    state.nativeTokenSymbol,
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
      txType: "INTERCHAIN_TRANSFER",
    });
  }, [actions, props.sourceChain, state.txState, txHash]);

  const suiTxDigest = useMemo(() => {
    return state.txState.status === "submitted"
      ? state.txState.suiTx?.digest
      : undefined;
  }, [state.txState]);

  const handleSuiTransactionComplete = useCallback(
    async (result: SuiTransactionBlockResponse) => {
      // Check if transaction was successful
      if (result.effects?.status?.status === "success") {
        await actions.refetchBalances();
        resetForm();
        actions.resetTxState();
        actions.setIsModalOpen(false);
        toast.success("Tokens sent successfully!", {
          id: `token-sent:${result.digest}`,
        });
      }
    },
    [actions, resetForm]
  );

  useEffect(() => {
    async function trackTransaction() {
      if (state.txState.status !== "submitted") return;
      if (!state.txState.suiTx) return;
      if (!suiTxDigest) return;

      actions.trackTransaction({
        status: "submitted",
        hash: suiTxDigest,
        suiTx: state.txState.suiTx,
        chainId: SUI_CHAIN_ID,
        txType: "INTERCHAIN_TRANSFER",
      });

      await handleSuiTransactionComplete(state.txState.suiTx);
    }

    if (state.txState.status === "submitted") {
      trackTransaction().catch((error) => {
        logger.error("Failed to track transaction", error);
      });
    }
  }, [
    actions,
    suiTxDigest,
    state.txState,
    address,
    handleSuiTransactionComplete,
  ]);

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

  const handleSetMaxBalance = useCallback(() => {
    const value = formatUnits(
      BigInt(props.balance.tokenBalance),
      Number(props.balance.decimals)
    ).replace(/,/gi, "");

    const [integerPart, decimalPart] = value.split(".") as [string, string];

    const sanitizedValue = decimalPart
      ? `${integerPart}.${decimalPart.slice(0, 8)}`
      : integerPart;

    setValue("amountToTransfer", sanitizedValue, {
      shouldValidate: true,
    });
  }, [props.balance.decimals, props.balance.tokenBalance, setValue]);

  const isSameChainType = useMemo(() => {
    if (props.sourceChain.chain_type === "evm") {
      // Handle edge case where the source chain is EVM and the destination chain is flow which is compatible with EVM but it's a VM chain
      return (
        state.selectedToChain?.chain_type === "evm" ||
        state.selectedToChain?.id.includes("flow")
      );
    }

    return state.selectedToChain?.chain_type === props.sourceChain.chain_type;
  }, [
    state.selectedToChain?.chain_type,
    state.selectedToChain?.id,
    props.sourceChain.chain_type,
  ]);

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
      <Modal.Body className="flex min-h-96 flex-col">
        <Modal.Title>Interchain Transfer</Modal.Title>

        <div className="grid grid-cols-2 gap-4 p-1">
          <div className="flex items-center gap-2">
            <label className="text-md align-top">From:</label>
            <ChainsDropdown
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
            <ChainsDropdown
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
              <Label.Text>
                Amount to Transfer{" "}
                <span className="text-info">{state?.tokenSymbol}</span>
              </Label.Text>
              <Label.AltText
                role="button"
                aria-label="set max balance to transfer"
                onClick={handleSetMaxBalance}
              >
                Balance:{" "}
                <BigNumberText
                  decimals={Number(props.balance.decimals)}
                  localeOptions={{
                    style: "decimal",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 6,
                  }}
                >
                  {BigInt(props.balance.tokenBalance)}
                </BigNumberText>
              </Label.AltText>
            </Label>
            <TextInput
              id="amountToTransfer"
              $bordered
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

                  const bnValue = parseUnits(
                    value as `${number}`,
                    Number(props.balance.decimals) * 2
                  );

                  const bnBalance = parseUnits(
                    props.balance.tokenBalance,
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

          <FormControl>
            <Label htmlFor="destinationAddress">
              <Label.Text>Destination Address</Label.Text>
              {isSameChainType && (
                <Label.AltText className="hover:cursor-pointer hover:opacity-30 transition-opacity" onClick={() => {
                  setValue("destinationAddress", address ?? "");
                }}>Use connected wallet address</Label.AltText>
              )}
            </Label>
            <TextInput
              id="destinationAddress"
              $bordered
              placeholder="Enter destination address"
              className="bg-base-200"
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              aria-autocomplete="none"
              {...register("destinationAddress", {
                required: "Destination address is required",
                validate: (value) => {
                  // TODO handle sui address length
                  if (
                    state.selectedToChain.id.includes("sui") &&
                    !isValidSuiAddress(value)
                  ) {
                    return "Invalid SUI address";
                  }

                  if (
                    (state.selectedToChain.chain_type === "evm" ||
                      state.selectedToChain.id.includes("flow")) &&
                    !isValidEVMAddress(value)
                  ) {
                    return "Invalid EVM address";
                  }

                  return true;
                },
              })}
            />
          </FormControl>

          {state.txState.status === "idle" &&
            state.estimatedWaitTimeInMinutes > 2 && (
              <Alert icon={<EyeIcon />}>
                This transfer may take ≈{state.estimatedWaitTimeInMinutes}{" "}
                minutes to confirmation
              </Alert>
            )}

          {state.txState.status === "submitted" && (
            <ShareHaikuButton
              additionalChainNames={[state.selectedToChain.id]}
              originChainName={props.sourceChain.chain_name}
              tokenName={state.tokenSymbol ?? ""}
              originAxelarChainId={props.sourceChain.id}
              tokenAddress={props.tokenAddress}
              haikuType="send"
            />
          )}

          {state.txState.status === "submitted" && (
            <GMPTxStatusMonitor
              txHash={state.txState.hash}
              onAllChainsExecuted={handleAllChainsExecuted}
            />
          )}

          <div className="grid w-full">
            <Label>
              <Label.Text />
              {Boolean(state.gasFee) && (
                <Label.AltText>
                  <Tooltip tip="Approximate gas cost">
                    <span className="ml-2 whitespace-nowrap text-xs">
                      (≈ {state.gasFee} {state.nativeTokenSymbol} in fees)
                    </span>
                  </Tooltip>
                </Label.AltText>
              )}
            </Label>
            {buttonStatus === "error" ? (
              <Alert role="alert" $status="error">
                {buttonChildren}
              </Alert>
            ) : (
              <Button
                $variant="primary"
                type="submit"
                disabled={
                  !formState.isValid ||
                  isFormDisabled ||
                  state.hasInsufficientGasBalance
                }
                $loading={state.isSending}
              >
                {buttonChildren}
              </Button>
            )}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SendInterchainToken;
