import { FC, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Alert,
  Button,
  FormControl,
  Label,
  Modal,
  TextInput,
} from "@axelarjs/ui";
import { formatUnits } from "ethers/lib/utils.js";
import invariant from "tiny-invariant";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { EVMChainConfig } from "~/services/axelarscan/types";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

import GMPTxStatusMonitor from "../GMPTxStatusMonitor";
import {
  TransactionState,
  useSendInterchainTokenMutation,
} from "./hooks/useSendInterchainTokenMutation";

type FormState = {
  amountToSend: number;
};

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
  sourceChain: EVMChainConfig;
  balance: {
    tokenBalance: string;
    decimals: string | number;
  };
};

export const SendInterchainToken: FC<Props> = (props) => {
  const { computed } = useEVMChainConfigsQuery();

  const { data: interchainToken } = useInterchainTokensQuery({
    tokenAddress: props.tokenAddress,
    chainId: props.sourceChain.chain_id,
  });

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

  const [sendTokenStatus, setSendTokenStatus] = useState<TransactionState>();

  const submitHandler: SubmitHandler<FormState> = async (_data, e) => {
    e?.preventDefault();

    invariant(selectedToChain, "selectedToChain is undefined");

    await sendTokenAsync({
      tokenAddress: props.tokenAddress,
      tokenId: props.tokenId,
      toNetwork: selectedToChain.chain_name,
      fromNetwork: props.sourceChain.chain_name,
      amount: amountToSend?.toString(),
      onStatusUpdate: setSendTokenStatus,
    });
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
          return formState.errors.amountToSend?.message;
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

  return (
    <Modal trigger={props.trigger}>
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
              disabled={isSending || eligibleTargetChains.length <= 1}
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
                    Number(formatUnits(props.balance.tokenBalance))
                  );
                }}
              >
                Balance:{" "}
                <BigNumberText
                  decimals={props.balance.decimals}
                  localeOptions={{
                    style: "decimal",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  }}
                >
                  {props.balance.tokenBalance}
                </BigNumberText>
              </Label.AltText>
            </Label>
            <TextInput
              id="amountToSend"
              bordered
              type="number"
              placeholder="Enter your amount to send"
              min={0}
              {...register("amountToSend", {
                valueAsNumber: true,
                required: {
                  value: true,
                  message: "Amount is required",
                },
                validate(value) {
                  if (value <= 0) {
                    return "Amount must be greater than 0";
                  }

                  if (value > Number(formatUnits(props.balance.tokenBalance))) {
                    return "Insufficient balance";
                  }

                  return true;
                },
              })}
            />
          </FormControl>

          {sendTokenStatus?.type === "failed" && (
            <Alert status="error">{sendTokenStatus?.error?.message}</Alert>
          )}

          {sendTokenStatus?.type === "sending" && (
            <GMPTxStatusMonitor
              txHash={sendTokenStatus.txHash}
              onAllChainsExecuted={() => {
                Promise.all([
                  trpcContext.gmp.searchInterchainToken.invalidate(),
                  trpcContext.gmp.getERC20TokenBalanceForOwner.invalidate(),
                ]).then(() => {
                  resetForm();
                });
              }}
            />
          )}
          <Button
            color="primary"
            type="submit"
            disabled={!formState.isValid || isSending}
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
