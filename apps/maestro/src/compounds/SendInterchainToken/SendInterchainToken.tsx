import { FC, useCallback, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormControl, Label, Modal, TextInput } from "@axelarjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  const { mutateAsync: sendToken } = useSendInterchainTokenMutation({
    tokenAddress: props.tokenAddress,
    tokenId: props.tokenId,
  });
  const schema = z.object({
    amountToSend: z.coerce
      .number()
      .min(0)
      .max(Number(props.balance.tokenBalance)),
  });
  type FormState = z.infer<typeof schema>;
  const { register, handleSubmit, watch } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountToSend: undefined,
    },
  });
  const amount = watch("amountToSend");
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const [toChainId, setToChainId] = useState(5);
  const back = () => (
    <Modal.CloseAction color="secondary">Close</Modal.CloseAction>
  );

  const forward = () => (
    <Modal.CloseAction color="primary">Close</Modal.CloseAction>
  );
  const selectedToChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === toChainId),
    [toChainId, evmChains]
  );

  const handleSend = useCallback(async () => {
    if (!selectedToChain || !amount) return;
    await sendToken({
      tokenAddress: props.tokenAddress,
      tokenId: props.tokenId,
      toNetwork: selectedToChain.chain_name,
      fromNetwork: props.sourceChain.chain_name,
      amount: amount?.toString(),
    });
  }, [sendToken, props.tokenAddress, props.tokenId, selectedToChain, amount]);

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();
    console.log("clicked");
    await handleSend();
  };

  return (
    <Modal trigger={props.trigger}>
      <Modal.Body>
        <div className="flex h-80 w-full flex-col align-top">
          <Modal.Title>
            <div className="text-2xl"> Send Interchain Token</div>
          </Modal.Title>
          <div className="mt-5 flex w-full flex-row justify-between">
            <div className="w-1/2">
              <label className="text-md align-top">From:</label>
              <EVMChainsDropdown compact selectedChain={props.sourceChain} />
            </div>
            <div className="w-1/2">
              <label className="text-md align-top">To:</label>
              <EVMChainsDropdown
                compact
                selectedChain={selectedToChain}
                chains={evmChains}
                onSwitchNetwork={(chain_id) => {
                  const target = evmChains?.find(
                    (c) => c.chain_id === chain_id
                  );
                  if (target) {
                    setToChainId(target?.chain_id);
                  }
                }}
              />
            </div>
          </div>

          <div>Balance: {props.balance.tokenBalance}</div>

          <form
            className="grid h-24 grid-cols-1 gap-y-2"
            onSubmit={handleSubmit(submitHandler)}
          >
            <FormControl>
              <Label>Amount to send</Label>
              <TextInput
                bordered
                type="number"
                placeholder="Enter your amount to send"
                min={0}
                {...register("amountToSend")}
              />
            </FormControl>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!amount}
              ref={formSubmitRef}
            >
              Send {amount || 0} tokens to {selectedToChain?.name}
            </button>
          </form>
        </div>
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
export default SendInterchainToken;
