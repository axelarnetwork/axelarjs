import { FC, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import type { EVMChainConfig } from "@axelarjs/api";
import {
  Button,
  FormControl,
  Label,
  Modal,
  TextInput,
  toast,
} from "@axelarjs/ui";
import invariant from "tiny-invariant";
import { formatUnits, parseUnits } from "viem";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import GMPTxStatusMonitor from "~/compounds/GMPTxStatusMonitor";
import { logger } from "~/lib/logger";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

import {
  TransactionState,
  useSendInterchainTokenMutation,
} from "./hooks/useSendInterchainTokenMutation";

type FormState = {
  amountToSend: string;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
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
  const { computed } = useEVMChainConfigsQuery();

  const { data: interchainToken } = useInterchainTokensQuery({
    tokenAddress: props.tokenAddress,
    chainId: props.sourceChain.chain_id,
  });

  const [isModalOpen, setIsModalOpen] = useState(props.isOpen ?? false);

  const { mutateAsync: sendTokenAsync, isLoading: isSending } =
    useSendInterchainTokenMutation({
      tokenAddress: props.tokenAddress,
      tokenId: props.tokenId,
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

  const [toChainId, setToChainId] = useState(5);

  const eligibleTargetChains = useMemo(() => {
    return (interchainToken?.matchingTokens ?? [])
      .filter((x) => x.isRegistered && x.chainId !== props.sourceChain.chain_id)
      .map((x) => computed.indexedByChainId[x.chainId]);
  }, [
    interchainToken?.matchingTokens,
    props.sourceChain.chain_id,
    computed.indexedByChainId,
  ]);

  const selectedToChain = useMemo(
    () =>
      eligibleTargetChains.find((c) => c.chain_id === toChainId) ??
      eligibleTargetChains[0],

    [toChainId, eligibleTargetChains]
  );

  const [sendTokenStatus, setSendTokenStatus] = useState<TransactionState>({
    type: "idle",
  });

  const submitHandler: SubmitHandler<FormState> = async (_data, e) => {
    e?.preventDefault();

    invariant(selectedToChain, "selectedToChain is undefined");

    await sendTokenAsync(
      {
        tokenAddress: props.tokenAddress,
        tokenId: props.tokenId,
        toNetwork: selectedToChain.chain_name,
        fromNetwork: props.sourceChain.chain_name,
        amount: amountToSend,
        onStatusUpdate(status) {
          if (status.type === "failed") {
            toast.error("Failed to send token. Please try again.");
            logger.always.error(status.error);
          }
          setSendTokenStatus(status);
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
    switch (sendTokenStatus?.type) {
      case "awaiting_approval":
        return (
          <>
            Approve {amountToSend} tokens to be sent to {selectedToChain?.name}
          </>
        );
      case "awaiting_confirmation":
        return <>Confirm transaction on wallet</>;
      case "sending":
        return (
          <>
            Sending {amountToSend} tokens to {selectedToChain?.name}
          </>
        );
      default:
        if (!formState.isValid) {
          return formState.errors.amountToSend?.message ?? "Amount is reauired";
        }
        return (
          <>
            Send {amountToSend || 0} tokens to {selectedToChain?.name}
          </>
        );
    }
  }, [
    amountToSend,
    formState.errors.amountToSend?.message,
    formState.isValid,
    selectedToChain?.name,
    sendTokenStatus?.type,
  ]);

  const trpcContext = trpc.useContext();

  const isFormDisabled =
    sendTokenStatus.type !== "idle" && sendTokenStatus.type !== "failed";

  return (
    <Modal
      trigger={props.trigger}
      disableCloseButton={isFormDisabled}
      open={isModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (isFormDisabled) {
            return;
          }
          props.onClose?.();
          resetForm();
          setSendTokenStatus({ type: "idle" });
        }
        setIsModalOpen(isOpen);
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
              selectedChain={selectedToChain}
              chains={eligibleTargetChains}
              disabled={isFormDisabled || eligibleTargetChains.length <= 1}
              onSwitchNetwork={(chain_id) => {
                const target = computed.indexedByChainId[chain_id];
                if (target) {
                  setToChainId(target?.chain_id);
                }
              }}
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
                    `${Number(props.balance.tokenBalance)}`,
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
          {sendTokenStatus?.type === "sending" && (
            <GMPTxStatusMonitor
              txHash={sendTokenStatus.txHash}
              onAllChainsExecuted={async () => {
                await trpcContext.erc20.getERC20TokenBalanceForOwner.refetch();
                resetForm();
                setSendTokenStatus({ type: "idle" });
                toast.success("Tokens sent successfully!");
              }}
            />
          )}
          <Button
            color="primary"
            type="submit"
            disabled={!formState.isValid || isFormDisabled}
            loading={isSending}
          >
            {buttonChildren}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SendInterchainToken;
