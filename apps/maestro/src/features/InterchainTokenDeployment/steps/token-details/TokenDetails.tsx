import { Dialog, FormControl, Label } from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { ComponentRef, useRef, type FC } from "react";
import { type SubmitHandler } from "react-hook-form";

import {
  useInterchainTokenDeploymentStateContainer,
  type TokenDetailsFormState,
} from "~/features/InterchainTokenDeployment";
import {
  ModalFormInput,
  NextButton,
  TokenNameLabelWithTooltip,
  ValidationError,
} from "~/ui/compounds/MultiStepForm";

const TokenDetails: FC = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const { register, handleSubmit, formState } = state.tokenDetailsForm;

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<ComponentRef<"button">>(null);

  const submitHandler: SubmitHandler<TokenDetailsFormState> = (data, e) => {
    e?.preventDefault();

    actions.setTokenDetails(data);
    actions.nextStep();
  };

  const { errors } = state.tokenDetailsForm.formState;

  return (
    <>
      <form
        className="grid grid-cols-1 sm:gap-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormControl>
          <Label>
            <TokenNameLabelWithTooltip />
          </Label>
          <ModalFormInput
            placeholder="Enter your token name"
            {...register("tokenName")}
          />
          {Maybe.of(errors.tokenName).mapOrNull(ValidationError)}
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <ModalFormInput
            placeholder="Enter your token symbol"
            maxLength={11}
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
            min={0}
            max={18}
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
          Token Settings
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default TokenDetails;
