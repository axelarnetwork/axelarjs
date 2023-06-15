import { Dialog, FormControl, Label, TextInput } from "@axelarjs/ui";
import { useRef, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAddErc20StateContainer } from "~/features/AddErc20";
import { NextButton } from "../shared";

const schema = z.object({
  tokenName: z.string().min(1).max(32),
  tokenSymbol: z.string().min(1).max(11),
  tokenDecimals: z.coerce.number().min(1).max(18),
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
    });

    actions.nextStep();
  };

  const isReadonly = state.isPreExistingToken;

  return (
    <>
      <form
        className="grid grid-cols-1 sm:gap-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormControl>
          <Label>Token Name</Label>
          <TextInput
            className="bg-base-200"
            bordered
            placeholder="Enter your token name"
            disabled={isReadonly}
            {...register("tokenName")}
          />
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <TextInput
            className="bg-base-200"
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
            className="bg-base-200"
            bordered
            type="number"
            placeholder="Enter your token decimals"
            min={1}
            max={18}
            disabled={isReadonly}
            {...register("tokenDecimals")}
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
      <Dialog.Actions>
        <Dialog.CloseAction onClick={actions.reset}>
          Cancel & exit
        </Dialog.CloseAction>
        <NextButton
          disabled={!formState.isValid}
          onClick={() => formSubmitRef.current?.click()}
        >
          Register token
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default TokenDetails;
