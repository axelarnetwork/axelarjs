import { Dialog, FormControl, Label } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { type FC } from "react";
import { FieldError } from "react-hook-form";

import { useCanonicalTokenDeploymentStateContainer } from "~/features/CanonicalTokenDeployment";
import ModalFormInput from "~/ui/components/ModalFormInput";
import { NextButton } from "../shared";

const TokenDetails: FC = () => {
  const { state, actions } = useCanonicalTokenDeploymentStateContainer();

  const { register, formState } = state.tokenDetailsForm;

  const isReadonly = state.isPreExistingToken;

  const { errors } = state.tokenDetailsForm.formState;

  return (
    <>
      <form className="grid grid-cols-1 sm:gap-2">
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
      </form>
      <Dialog.Actions>
        <Dialog.CloseAction onClick={actions.reset}>
          Cancel & exit
        </Dialog.CloseAction>
        <NextButton
          disabled={!formState.isValid}
          onClick={() => actions.nextStep()}
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
