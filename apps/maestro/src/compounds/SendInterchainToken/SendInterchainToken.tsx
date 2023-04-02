import { FC, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button, FormControl, Label, Modal, TextInput } from "@axelarjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatUnits } from "ethers/lib/utils.js";
import invariant from "tiny-invariant";
import { z } from "zod";

import BigNumberText from "~/components/BigNumberText/BigNumberText";
import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import { EVMChainConfig } from "~/services/axelarscan/types";

import { useSendInterchainTokenMutation } from "./hooks/useSendInterchainTokenMutation";

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
  const { data: evmChains } = useEVMChainConfigsQuery();
  const { mutateAsync: sendToken, isLoading: isSending } =
    useSendInterchainTokenMutation({
      tokenAddress: props.tokenAddress,
      tokenId: props.tokenId,
    });

  const formSchema = useMemo(() => {
    const tokenBalanceAsNumber = Number(
      formatUnits(props.balance.tokenBalance, props.balance.decimals)
    );
    return z.object({
      amountToSend: z.coerce.number().min(1).max(tokenBalanceAsNumber),
    });
  }, [props.balance.decimals, props.balance.tokenBalance]);

  type FormState = z.infer<typeof formSchema>;

  const { register, handleSubmit, watch, formState } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountToSend: undefined,
    },
  });

  const amount = watch("amountToSend");
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const [toChainId, setToChainId] = useState(5);

  const selectedToChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === toChainId),
    [toChainId, evmChains]
  );

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();

    invariant(selectedToChain, "selectedToChain is undefined");

    await sendToken({
      tokenAddress: props.tokenAddress,
      tokenId: props.tokenId,
      toNetwork: selectedToChain.chain_name,
      fromNetwork: props.sourceChain.chain_name,
      amount: amount?.toString(),
    });
  };

  return (
    <Modal trigger={props.trigger}>
      <Modal.Body className="flex h-96 flex-col">
        <Modal.Title>
          <div className="text-2xl"> Send Interchain Token</div>
        </Modal.Title>
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
              chains={evmChains}
              onSwitchNetwork={(chain_id) => {
                const target = evmChains?.find((c) => c.chain_id === chain_id);
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
          <Button
            color="primary"
            type="submit"
            disabled={!formState.isValid || !selectedToChain}
            loading={isSending}
            ref={formSubmitRef}
          >
            Send {amount || 0} tokens to {selectedToChain?.name}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
export default SendInterchainToken;
