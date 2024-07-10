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
import { ComponentRef, useMemo, useRef, type FC } from "react";
import { type FieldError, type SubmitHandler } from "react-hook-form";

import "~/features/InterchainTokenDeployment";

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
  TokenNameLabelWithTooltip,
  ValidationError,
} from "~/ui/compounds/MultiStepForm";

const TokenDetails: FC = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const { register, handleSubmit, formState, watch } = state.tokenDetailsForm;

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<ComponentRef<"button">>(null);

  const isMintable = watch("isMintable");
  const minter = watch("minter");
  const supply = watch("initialSupply");

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

  const initialSupplyErrorMessage = useMemo<FieldError | undefined>(() => {
    if (isMintable) {
      return;
    }

    if (["0", ""].includes(supply) && !minter) {
      return {
        type: "required",
        message: "Fixed supply token requires an initial balance",
      };
    }
  }, [isMintable, minter, supply]);

  const isFormValid = useMemo(() => {
    if (minterErrorMessage || initialSupplyErrorMessage) {
      return false;
    }

    return formState.isValid;
  }, [formState.isValid, initialSupplyErrorMessage, minterErrorMessage]);

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
        <FormControl>
          <Label htmlFor="isMintable">
            <Label.Text className="inline-flex items-center gap-1">
              Is Mintable?
              <Tooltip
                $position="right"
                $variant="info"
                tip="When active, the token minter will be able to mint new tokens."
              >
                <HelpCircleIcon className="mr-1 h-[1em] text-info" />
              </Tooltip>
            </Label.Text>
            <Label.AltText>
              <Toggle
                id="isMintable"
                $variant="primary"
                $size="sm"
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
                  $position="right"
                  $variant="info"
                  tip="Choose a secure minter address, e.g. governance, multisig etc. This address will be able to mint the token on any chain."
                >
                  <HelpCircleIcon className="mr-1 h-[1em] text-info" />
                </Tooltip>
              </Label.Text>
              <Label.AltText>
                <button
                  type="button"
                  onClick={actions.setCurrentAddressAsMinter}
                >
                  Use current address
                </button>
              </Label.AltText>
            </Label>
            <ModalFormInput
              id="minter"
              placeholder="Enter a secure minter address"
              onKeyDown={preventNonHexInput}
              {...register("minter")}
            />
            {Maybe.of(minterErrorMessage).mapOrNull(ValidationError)}
          </FormControl>
        )}
        <FormControl>
          <Label htmlFor="initialSupply">
            {isMintable
              ? "Enter initial supply"
              : "Enter total supply - This will be a fixed supply for the token"}
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
          {Maybe.of(initialSupplyErrorMessage).mapOrNull(ValidationError)}
        </FormControl>
        <FormControl>
          <Label htmlFor="salt">
            <Label.Text>Salt</Label.Text>
            <Label.AltText>
              <Tooltip tip="Generate random salt" $position="left">
                <button
                  type="button"
                  onClick={() => actions.generateRandomSalt()}
                >
                  <RefreshCwIcon className="h-[1em] hover:text-primary" />
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
        <Dialog.CloseAction onClick={actions.reset}>
          Cancel & exit
        </Dialog.CloseAction>
        <NextButton
          disabled={!isFormValid}
          onClick={() => formSubmitRef.current?.click()}
        >
          <p className="text-indigo-600">Register & Deploy</p>
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default TokenDetails;
