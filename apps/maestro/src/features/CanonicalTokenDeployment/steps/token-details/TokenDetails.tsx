import { Dialog, FormControl, Label } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useRef, type FC } from "react";
import { FieldError, type SubmitHandler } from "react-hook-form";

import {
  useCanonicalTokenDeploymentStateContainer,
  type TokenDetailsFormState,
} from "~/features/CanonicalTokenDeployment";
import ModalFormInput from "~/ui/components/ModalFormInput";
import { NextButton } from "../shared";

const TokenDetails: FC = () => {
  const { state, actions } = useCanonicalTokenDeploymentStateContainer();

  const { register, handleSubmit, formState } = state.tokenDetailsForm;

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TokenDetailsFormState> = (data, e) => {
    e?.preventDefault();

    actions.setTokenDetails({
      tokenName: data.tokenName,
      tokenSymbol: data.tokenSymbol,
      tokenDecimals: data.tokenDecimals,
      originTokenSupply: data.originTokenSupply,
      distributor: data.distributor,
      salt: data.salt,
    });

    actions.nextStep();
  };

  const isReadonly = state.isPreExistingToken;

  const { errors } = state.tokenDetailsForm.formState;

  return (
    <>
      <form
        className="grid grid-cols-1 sm:gap-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormControl>
          <Label>Token Name</Label>
          <ModalFormInput
            placeholder="Enter your token name"
            disabled={isReadonly}
            {...register("tokenName")}
          />
          {Maybe.of(errors.tokenName).mapOrNull(ValidationError)}
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <ModalFormInput
            placeholder="Enter your token symbol"
            maxLength={11}
            disabled={isReadonly}
            {...register("tokenSymbol")}
          />
          {Maybe.of(errors.tokenSymbol).mapOrNull(ValidationError)}
        </FormControl>
        <FormControl>
          <Label htmlFor="tokenDecimals">Token Decimals</Label>
          <ModalFormInput
            id="tokenDecimals"
            type="number"
            placeholder="Enter your token decimals"
            min={1}
            max={18}
            disabled={isReadonly}
            {...register("tokenDecimals")}
          />
          {Maybe.of(errors.tokenDecimals).mapOrNull(ValidationError)}
        </FormControl>
        <button type="submit" ref={formSubmitRef} />
      </form>

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

const ValidationError: FC<FieldError> = ({ message }) => (
  <div role="alert" className="text-error p-1.5 text-xs">
    {message}
  </div>
);
