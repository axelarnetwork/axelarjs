import {
  Dialog,
  FormControl,
  HelpCircleIcon,
  Label,
  RefreshCwIcon,
  Toggle,
  Tooltip,
} from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useMemo, useRef, type FC } from "react";
import { FieldError, type SubmitHandler } from "react-hook-form";

import {
  useInterchainTokenDeploymentStateContainer,
  type TokenDetailsFormState,
} from "~/features/InterchainTokenDeployment";
import {
  isValidEVMAddress,
  preventNonHexInput,
  preventNonNumericInput,
} from "~/lib/utils/validation";
import {
  ModalFormInput,
  NextButton,
  ValidationError,
} from "~/ui/compounds/MultiStepForm";

const TokenSettings: FC = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const { register, handleSubmit, formState, watch } = state.tokenDetailsForm;

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const isMintable = watch("isMintable");
  const minter = watch("minter");

  const minterErrorMessage = useMemo<FieldError | undefined>(() => {
    if (!isMintable) {
      return;
    }

    if (!minter) {
      return {
        type: "required",
        message: "Minter address is required",
      };
    }

    if (!isValidEVMAddress(minter)) {
      return {
        type: "validate",
        message: "Invalid minter address",
      };
    }
  }, [isMintable, minter]);

  const isFormValid = useMemo(() => {
    if (minterErrorMessage) {
      return false;
    }

    return formState.isValid;
  }, [minterErrorMessage, formState.isValid]);

  const submitHandler: SubmitHandler<TokenDetailsFormState> = (data, e) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    actions.setTokenDetails({
      ...data,
      minter: data.isMintable && data.minter ? data.minter : undefined,
    });
    actions.nextStep();
  };

  return (
    <>
      <form
        className="grid grid-cols-1 sm:gap-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormControl>
          <Label htmlFor="isMintable">
            <Label.Text className="inline-flex items-center gap-1">
              Is Mintable?
              <Tooltip
                position="right"
                variant="info"
                tip="When active, the token minter will be able to mint new tokens."
              >
                <HelpCircleIcon className="text-info mr-1 h-[1em]" />
              </Tooltip>
            </Label.Text>
            <Label.AltText>
              <Toggle
                id="isMintable"
                variant="primary"
                size="sm"
                {...register("isMintable")}
              />
            </Label.AltText>
          </Label>
        </FormControl>
        {isMintable && (
          <FormControl>
            <Label htmlFor="minter">
              <Label.Text className="inline-flex items-center gap-1">
                Token Minter
                <Tooltip
                  position="right"
                  variant="info"
                  tip="This address will receive the minted tokens. It will also be able to mint, burn tokens and transfer mintership."
                >
                  <HelpCircleIcon className="text-info mr-1 h-[1em]" />
                </Tooltip>
              </Label.Text>
              <Label.AltText>
                <button
                  type="button"
                  onClick={actions.setCurrentAddressAsMinter}
                >
                  use current address
                </button>
              </Label.AltText>
            </Label>
            <ModalFormInput
              id="minter"
              placeholder="Enter token minter address"
              onKeyDown={preventNonHexInput}
              {...register("minter")}
            />
            {Maybe.of(minterErrorMessage).mapOrNull(ValidationError)}
          </FormControl>
        )}
        <FormControl>
          <Label htmlFor="initialSupply">
            Enter {isMintable ? "initial" : "total"} supply
          </Label>
          <ModalFormInput
            id="initialSupply"
            placeholder={`Enter ${isMintable ? "initial" : "total"} supply`}
            min={0}
            onKeyDown={preventNonNumericInput}
            {...register("initialSupply", {
              validate(value) {
                if (!value || value === "0") {
                  return "Amount must be greater than 0";
                }

                return true;
              },
            })}
          />
          {Maybe.of(formState.errors.initialSupply).mapOrNull(ValidationError)}
        </FormControl>
        <FormControl>
          <Label htmlFor="salt">
            <Label.Text>Salt</Label.Text>
            <Label.AltText>
              <Tooltip tip="Generate random salt" position="left">
                <button
                  type="button"
                  onClick={() => actions.generateRandomSalt()}
                >
                  <RefreshCwIcon className="hover:text-primary h-[1em]" />
                </button>
              </Tooltip>
            </Label.AltText>
          </Label>
          <ModalFormInput
            id="salt"
            onKeyDown={preventNonHexInput}
            defaultValue={state.tokenDetailsForm.getValues("salt")}
            {...register("salt")}
          />
          {Maybe.of(formState.errors.salt).mapOrNull(ValidationError)}
        </FormControl>
        <button type="submit" ref={formSubmitRef} />
      </form>
      <Dialog.Actions>
        <NextButton
          length="block"
          disabled={!isFormValid}
          onClick={() => formSubmitRef.current?.click()}
        >
          Register & Deploy
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default TokenSettings;
