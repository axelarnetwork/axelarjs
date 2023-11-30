import {
  Button,
  Dialog,
  EyeIcon,
  EyeOffIcon,
  FormControl,
  HelpCircleIcon,
  Label,
  TextInput,
  Tooltip,
} from "@axelarjs/ui";
import { useRef, useState, type FC } from "react";
import { type SubmitHandler } from "react-hook-form";

import {
  useInterchainTokenDeploymentStateContainer,
  type TokenDetailsFormState,
} from "~/features/InterchainTokenDeployment";
import {
  isValidEVMAddress,
  preventNonHexInput,
  preventNonNumericInput,
} from "~/lib/utils/validation";
import { NextButton } from "../shared";

const FormInput = Object.assign({}, TextInput, {
  defaultProps: {
    ...TextInput.defaultProps,
    className: "bg-base-200",
    bordered: true,
  },
}) as typeof TextInput;

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
      originTokenSupply: data.originTokenSupply,
      distributor: data.distributor,
      salt: data.salt,
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
          <FormInput
            placeholder="Enter your token name"
            disabled={isReadonly}
            {...register("tokenName")}
          />
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <FormInput
            placeholder="Enter your token symbol"
            maxLength={11}
            disabled={isReadonly}
            {...register("tokenSymbol")}
          />
        </FormControl>
        <FormControl>
          <Label htmlFor="tokenDecimals">Token Decimals</Label>
          <FormInput
            id="tokenDecimals"
            type="number"
            placeholder="Enter your token decimals"
            min={1}
            max={18}
            disabled={isReadonly}
            {...register("tokenDecimals")}
          />
        </FormControl>
        <FormControl>
          <Label htmlFor="originTokenSupply">Amount to mint</Label>
          <FormInput
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
                <FormInput
                  id="distributor"
                  placeholder="Enter token distributor address"
                  onKeyDown={preventNonHexInput}
                  defaultValue={state.tokenDetailsForm.getValues("distributor")}
                  {...register("distributor", {
                    disabled: isReadonly,
                    validate(value) {
                      if (!value) {
                        return false;
                      }

                      // this field is optional, so we only validate if it's not empty
                      if (!isValidEVMAddress(value)) {
                        return "Invalid address";
                      }

                      return false;
                    },
                  })}
                />
              </FormControl>
              <FormControl>
                <Label htmlFor="salt">Salt</Label>
                <FormInput
                  id="salt"
                  onKeyDown={preventNonHexInput}
                  defaultValue={state.tokenDetailsForm.getValues("salt")}
                  {...register("salt", {
                    disabled: isReadonly,
                    validate(value) {
                      if (!value) {
                        return "Salt is required";
                      }

                      return true;
                    },
                  })}
                />
              </FormControl>
            </>
          )}
        </div>
        <button type="submit" ref={formSubmitRef} />
      </form>

      {Object.values(formState.errors).length > 0 && (
        <div className="text-sm">
          <div>Please fix the following errors:</div>
          <ul>
            {Object.entries(formState.errors).map(([key, error]) => (
              <li key={key} className="list-item">
                <span>{key}</span>:{" "}
                <span className="text-red-500">{error.message}</span>
              </li>
            ))}
          </ul>
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
