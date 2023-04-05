import { FC, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Button,
  FormControl,
  Label,
  LinkButton,
  Modal,
  TextInput,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatUnits } from "ethers/lib/utils.js";
import { ExternalLink } from "lucide-react";
import invariant from "tiny-invariant";
import { z } from "zod";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { EVMChainConfig } from "~/services/axelarscan/types";
import {
  useGetTransactionStatusOnDestinationChainsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

import {
  TransactionState,
  useSendInterchainTokenMutation,
} from "./hooks/useSendInterchainTokenMutation";

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

  const formSchema = useMemo(() => {
    const tokenBalanceAsNumber = Number(
      formatUnits(props.balance.tokenBalance, props.balance.decimals)
    );
    return z.object({
      amountToSend: z
        .string()
        .refine((v) => Number(v) > 0, "Amount must be greater than 0")
        .refine(
          (v) => Number(v) <= tokenBalanceAsNumber,
          `Amount must be less than or equal to ${tokenBalanceAsNumber}`
        ),
    });
  }, [props.balance.decimals, props.balance.tokenBalance]);

  type FormState = z.infer<typeof formSchema>;

  const { register, handleSubmit, watch, formState } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountToSend: undefined,
    },
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

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
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
      case "approving":
        return (
          <>
            Approving {amountToSend} tokens to be sent to{" "}
            {selectedToChain?.name}
          </>
        );
      case "sending":
        return (
          <>
            Sending {amountToSend} tokens to {selectedToChain?.name}
          </>
        );
      case "failed":
        return (
          <>
            Failed to send {amountToSend} tokens to {selectedToChain?.name}
          </>
        );
      default:
        if (!formState.isValid) {
          return !Number(amountToSend) ? "Send tokens" : "Insufficient balance";
        }

        return (
          <>
            Send {amountToSend || 0} tokens to {selectedToChain?.name}
          </>
        );
    }
  }, [
    amountToSend,
    formState.isValid,
    selectedToChain?.name,
    sendTokenStatus?.type,
  ]);

  const { data: statuses } = useGetTransactionStatusOnDestinationChainsQuery({
    txHash:
      sendTokenStatus?.type === "sending" ? sendTokenStatus.txHash : undefined,
  });

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
            <Label>
              <Label.Text>Amount to send</Label.Text>
              <Label.AltText>
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
              bordered
              type="number"
              placeholder="Enter your amount to send"
              min={0}
              {...register("amountToSend")}
            />
          </FormControl>

          {sendTokenStatus?.type === "failed" && (
            <div className="alert alert-error">
              {sendTokenStatus?.error?.message}
            </div>
          )}

          {sendTokenStatus?.type === "sending" && (
            <div className="grid gap-4">
              <LinkButton
                color="accent"
                outline
                href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${sendTokenStatus.txHash}`}
                className="flex items-center gap-2"
                target="_blank"
              >
                View on axelarscan {maskAddress(sendTokenStatus.txHash)}{" "}
                <ExternalLink className="h-4 w-4" />
              </LinkButton>
              <ul>
                {Object.entries(statuses ?? {}).map(([chainName, status]) => (
                  <li key={chainName}>
                    {chainName}: {status}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            color="primary"
            type="submit"
            disabled={!formState.isValid || !selectedToChain}
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
