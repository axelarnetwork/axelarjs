import {
  Button,
  Dialog,
  EyeIcon,
  EyeOffIcon,
  FormControl,
  HelpCircleIcon,
  Label,
  Tooltip,
} from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { useRef, useState, type FC } from "react";
import { type SubmitHandler } from "react-hook-form";

import {
  useInterchainTokenDeploymentStateContainer,
  type TokenDetailsFormState,
} from "~/features/InterchainTokenDeployment";
import {
  preventNonHexInput,
  preventNonNumericInput,
} from "~/lib/utils/validation";
import {
  ModalFormInput,
  NextButton,
  ValidationError,
} from "~/ui/compounds/MultiStepForm";

const TokenDetails: FC = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const { register, handleSubmit, formState } = state.tokenDetailsForm;

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<HTMLButtonElement>(null);

  const submitHandler: SubmitHandler<TokenDetailsFormState> = (data, e) => {
    e?.preventDefault();

    actions.setTokenDetails({
      tokenName: data.tokenName,
      tokenSymbol: data.tokenSymbol,
      tokenDecimals: data.tokenDecimals,
      initialSupply: data.originTokenSupply,
      minter: data.distributor,
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
        <FormControl>
          <Label htmlFor="originTokenSupply">Amount to mint</Label>
          <ModalFormInput
            id="originTokenSupply"
            placeholder="Enter amount to mint"
            min={0}
            onKeyDown={preventNonNumericInput}
            {...register("originTokenSupply", {
              disabled: isReadonly,
              validate(value) {
                if (!value || value === "0") {
                  return "Amount must be greater than 0";
                }

                return true;
              },
            })}
          />
          {Maybe.of(errors.originTokenSupply).mapOrNull(ValidationError)}
        </FormControl>
        <div className="grid place-content-center pt-4 md:place-content-end">
          <Button size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            advanced settings
            {showAdvanced ? (
              <EyeOffIcon className="h-[1.25em]" />
            ) : (
              <EyeIcon className="h-[1.25em]" />
            )}
          </Button>
        </div>
        <div>
          {showAdvanced && (
            <>
              <FormControl>
                <Label htmlFor="distributor">
                  <Label.Text className="inline-flex items-center gap-1">
                    Token Distributor
                    <Tooltip
                      position="right"
                      variant="info"
                      tip="This address will receive the minted tokens. It will also be able to mint, burn tokens and transfer distributorship."
                    >
                      <HelpCircleIcon className="text-info mr-1 h-[1em]" />
                    </Tooltip>
                  </Label.Text>
                </Label>
                <ModalFormInput
                  id="distributor"
                  placeholder="Enter token distributor address"
                  onKeyDown={preventNonHexInput}
                  defaultValue={state.tokenDetailsForm.getValues("distributor")}
                  {...register("distributor", {
                    disabled: isReadonly,
                  })}
                />
                {Maybe.of(errors.distributor).mapOrNull(ValidationError)}
              </FormControl>
              <FormControl>
                <Label htmlFor="salt">Salt</Label>
                <ModalFormInput
                  id="salt"
                  onKeyDown={preventNonHexInput}
                  defaultValue={state.tokenDetailsForm.getValues("salt")}
                  {...register("salt", { disabled: isReadonly })}
                />
                {Maybe.of(errors.salt).mapOrNull(ValidationError)}
              </FormControl>
            </>
          )}
        </div>
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
