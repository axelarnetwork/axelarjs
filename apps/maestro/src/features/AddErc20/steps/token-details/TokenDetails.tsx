import { FC, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormControl, Label, Modal, TextInput } from "@axelarjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAddErc20StateContainer } from "~/features/AddErc20";

import { NextButton } from "../core";

const schema = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(11),
  tokenDecimals: z.coerce.number().min(1).max(18),
  amountToMint: z.coerce.number().min(0),
});

type FormState = z.infer<typeof schema>;

const TokenDetails: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  const { register, handleSubmit, formState } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: state.tokenDetails,
  });

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<FormState> = (data, e) => {
    e?.preventDefault();

    actions.setTokenDetails({
      tokenName: data.tokenName,
      tokenSymbol: data.tokenSymbol,
      tokenDecimals: data.tokenDecimals,
      amountToMint: data.amountToMint,
    });

    actions.nextStep();
  };

  const isReadonly = state.isPreExistingToken;

  return (
    <>
      <form
        className="grid grid-cols-1 gap-y-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormControl>
          <Label>Token Name</Label>
          <TextInput
            bordered
            placeholder="Enter your token name"
            disabled={isReadonly}
            {...register("tokenName")}
          />
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <TextInput
            bordered
            placeholder="Enter your token symbol"
            maxLength={11}
            disabled={isReadonly}
            {...register("tokenSymbol")}
          />
        </FormControl>
        <FormControl>
          <Label>Token Decimals</Label>
          <TextInput
            bordered
            type="number"
            placeholder="Enter your token decimals"
            min={1}
            max={18}
            disabled={isReadonly}
            {...register("tokenDecimals")}
          />
        </FormControl>
        {process.env.NEXT_PUBLIC_NETWORK_ENV === "testnet" && (
          <FormControl>
            <Label>Amount to mint (leave zero for none)</Label>
            <TextInput
              bordered
              type="number"
              placeholder="Enter your amount to mint"
              min={0}
              disabled={isReadonly}
              {...register("amountToMint")}
            />
          </FormControl>
        )}
        <button type="submit" ref={formSubmitRef} />
      </form>

      {formState.errors && (
        <div className="text-sm text-red-500">
          {Object.values(formState.errors).map((error) => (
            <div key={error.message}>{error.message}</div>
          ))}
        </div>
      )}
      <Modal.Actions>
        <Modal.CloseAction onClick={actions.reset}>
          Cancel and exit
        </Modal.CloseAction>
        <NextButton
          disabled={!formState.isValid}
          onClick={() => formSubmitRef.current?.click()}
        >
          Deploy & Register
        </NextButton>
      </Modal.Actions>
    </>
  );
};

export default TokenDetails;
