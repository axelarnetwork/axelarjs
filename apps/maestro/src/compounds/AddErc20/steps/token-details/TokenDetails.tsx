import { FC, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormControl, Label, Modal, TextInput } from "@axelarjs/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { z } from "zod";

import { useAddErc20StateContainer } from "~/compounds/AddErc20";

import { NextButton } from "../core";

const schema = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(11),
  tokenDecimals: z.coerce.number().min(1).max(18),
  amountToMint: z.coerce.number().min(1),
});

type FormState = z.infer<typeof schema>;

const TokenDetails: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  const { register, handleSubmit, formState } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: {
      tokenName: state.tokenName,
      tokenSymbol: state.tokenSymbol,
      tokenDecimals: state.tokenDecimals,
      amountToMint: state.amountToMint,
    },
  });

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<FormState> = (data, e) => {
    e?.preventDefault();

    actions.setTokenName(data.tokenName);
    actions.setTokenSymbol(data.tokenSymbol);
    actions.setTokenDecimals(Number(data.tokenDecimals));
    actions.setAmountToMint(Number(data.amountToMint));
    actions.incrementStep();
  };

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
            {...register("tokenName")}
          />
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <TextInput
            bordered
            placeholder="Enter your token symbol"
            maxLength={11}
            className={clsx({
              uppercase: state.tokenSymbol.length > 0,
            })}
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
            {...register("tokenDecimals")}
          />
        </FormControl>
        <FormControl>
          <Label>Amount to mint (leave zero for none)</Label>
          <TextInput
            bordered
            type="number"
            placeholder="Enter your amount to mint"
            min={0}
            {...register("amountToMint")}
          />
        </FormControl>
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
        <Modal.CloseAction>Cancel and exit</Modal.CloseAction>
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
