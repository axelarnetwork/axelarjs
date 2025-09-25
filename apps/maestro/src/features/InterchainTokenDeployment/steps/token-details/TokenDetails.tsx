import {
  Alert,
  Dialog,
  FormControl,
  HelpCircleIcon,
  Label,
  RefreshCwIcon,
  Toggle,
  Tooltip,
} from "@axelarjs/ui";
import { Maybe } from "@axelarjs/utils";
import { ComponentRef, useEffect, useMemo, useRef, type FC } from "react";
import { type FieldError, type SubmitHandler } from "react-hook-form";

import { isValidSuiAddress } from "@mysten/sui/utils";

import "~/features/InterchainTokenDeployment";

import {
  INITIAL_STATE,
  useInterchainTokenDeploymentStateContainer,
  type TokenDetailsFormState,
} from "~/features/InterchainTokenDeployment";
import {
  HEDERA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  useChainId,
} from "~/lib/hooks";
import {
  isValidEVMAddress,
  isValidStellarWalletAddress,
  preventNonHexInput,
  preventNonNumericInput,
} from "~/lib/utils/validation";
import {
  ModalFormInput,
  NextButton,
  TokenNameLabelWithTooltip,
  ValidationError,
} from "~/ui/compounds/MultiStepForm";

const MAX_UINT64 = BigInt(2) ** BigInt(64) - BigInt(1);

type Disclaimer = {
  title: string;
  description: string;
};

type ChainRule = {
  isMintable?: boolean;
  initialSupply?: string;
  disclaimer?: Disclaimer;
  hiddenFields?: ("isMintable" | "initialSupply")[];
};

const CHAIN_RULES: Record<number, ChainRule> = {
  [HEDERA_CHAIN_ID]: {
    isMintable: true,
    initialSupply: "0",
    disclaimer: {
      title: "Hedera Token Deployment",
      description:
        "When deploying new tokens on Hedera, a Minter address is required and the token starts with an initial supply of 0.",
    },
    hiddenFields: ["isMintable", "initialSupply"],
  },
};

const validateMinterAddress = (minter: string | undefined, chainId: number) => {
  if (!minter) {
    return {
      type: "validate",
      message: "Minter address is required",
    };
  }

  if (chainId === SUI_CHAIN_ID) {
    if (!isValidSuiAddress(minter)) {
      return {
        type: "validate",
        message: "Invalid Sui minter address",
      };
    }
  } else if (chainId === STELLAR_CHAIN_ID) {
    if (!isValidStellarWalletAddress(minter)) {
      return {
        type: "validate",
        message: "Invalid Stellar minter address",
      };
    }
  } else {
    if (!isValidEVMAddress(minter)) {
      return {
        type: "validate",
        message: "Invalid EVM minter address",
      };
    }
  }

  return true;
};

const TokenDetails: FC = () => {
  const { state, actions } = useInterchainTokenDeploymentStateContainer();
  const chainId = useChainId();
  const chainRules = CHAIN_RULES[chainId];
  const isInitialSupplyHidden =
    chainRules?.hiddenFields?.includes("initialSupply") === true;
  const hasIsMintableRule = chainRules?.isMintable !== undefined;
  const hasInitialSupplyRule = chainRules?.initialSupply !== undefined;

  const { register, handleSubmit, formState, watch } = state.tokenDetailsForm;

  // this is only required because the form and actions are sibling elements
  const formSubmitRef = useRef<ComponentRef<"button">>(null);

  const isMintable = watch("isMintable");
  const minter = watch("minter");
  const supply = watch("initialSupply");
  const tokenDecimals = watch("tokenDecimals");

  // keep default supply in sync with mintable toggle
  useEffect(() => {
    const { getValues, setValue } = state.tokenDetailsForm;
    if (formState.dirtyFields?.initialSupply) {
      return;
    }
    const currentSupply = getValues("initialSupply");
    const desired = isMintable ? "0" : INITIAL_STATE.tokenDetails.initialSupply;
    if (currentSupply !== desired) {
      setValue("initialSupply", desired, {
        shouldDirty: false,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [isMintable, formState.dirtyFields, state.tokenDetailsForm]);

  // enforce chain-specific rules
  useEffect(() => {
    const { setValue, getValues } = state.tokenDetailsForm;
    const currentIsMintable = getValues("isMintable");
    const currentSupply = getValues("initialSupply");

    if (hasIsMintableRule && currentIsMintable !== chainRules.isMintable) {
      setValue("isMintable", chainRules.isMintable!, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    }

    if (hasInitialSupplyRule && currentSupply !== chainRules.initialSupply) {
      setValue("initialSupply", chainRules.initialSupply!, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    }
  }, [
    chainId,
    hasIsMintableRule,
    hasInitialSupplyRule,
    chainRules,
    state.tokenDetailsForm,
  ]);

  const minterErrorMessage = useMemo<FieldError | undefined>(() => {
    if (!isMintable) {
      return;
    }

    const minterValidation = validateMinterAddress(minter, chainId);
    if (minterValidation !== true) {
      return minterValidation;
    }
  }, [isMintable, minter, chainId]);

  const initialSupplyErrorMessage = useMemo<FieldError | undefined>(() => {
    if (isInitialSupplyHidden) {
      return;
    }
    if (!isMintable && ["0", ""].includes(supply)) {
      return {
        type: "required",
        message: "Fixed supply token requires an initial balance",
      };
    }

    if (
      chainId === SUI_CHAIN_ID &&
      supply &&
      BigInt(supply) * BigInt(10) ** BigInt(tokenDecimals) > MAX_UINT64
    ) {
      return {
        type: "validate",
        message: "Supply must be less than 2^64 - 1 for Sui",
      };
    }
  }, [isMintable, supply, chainId, tokenDecimals, isInitialSupplyHidden]);

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
      minter: data.isMintable ? data.minter : undefined,
    });
    actions.nextStep();
  };

  const { errors } = state.tokenDetailsForm.formState;
  const showMinterError =
    formState.dirtyFields?.minter || formState.isSubmitted;

  return (
    <>
      <form
        className="grid grid-cols-1 sm:gap-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        {chainRules?.disclaimer && (
          <FormControl>
            <Alert $status="info">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {chainRules.disclaimer.title}
                </span>
                <span>{chainRules.disclaimer.description}</span>
              </div>
            </Alert>
          </FormControl>
        )}
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
          <Label>
            <Label.Text id="tokenDecimals-label">Token Decimals</Label.Text>
          </Label>
          <ModalFormInput
            id="tokenDecimals"
            type="number"
            placeholder="Enter your token decimals"
            min={0}
            max={18}
            aria-labelledby="tokenDecimals-label"
            {...register("tokenDecimals")}
          />
          {Maybe.of(errors.tokenDecimals).mapOrNull(ValidationError)}
        </FormControl>
        {!chainRules?.hiddenFields?.includes("isMintable") && (
          <FormControl>
            <div className="flex items-center justify-between">
              <Label>
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
              </Label>
              <Toggle
                id="isMintable"
                $variant="primary"
                $size="sm"
                disabled={hasIsMintableRule}
                {...register("isMintable")}
              />
            </div>
          </FormControl>
        )}
        {isMintable && (
          <FormControl>
            <div className="flex items-center justify-between">
              <Label>
                <Label.Text
                  id="minter-label"
                  className="inline-flex items-center gap-1"
                >
                  Token Minter
                  <Tooltip
                    $position="right"
                    $variant="info"
                    tip="Choose a secure minter address, e.g. governance, multisig etc. This address will be able to mint the token on any chain."
                  >
                    <HelpCircleIcon className="mr-1 h-[1em] text-info" />
                  </Tooltip>
                </Label.Text>
              </Label>
              <button type="button" onClick={actions.setCurrentAddressAsMinter}>
                Use current address
              </button>
            </div>
            <ModalFormInput
              id="minter"
              placeholder="Enter a secure minter address"
              onKeyDown={preventNonHexInput}
              aria-labelledby="minter-label"
              {...register("minter")}
            />
            {showMinterError &&
              Maybe.of(minterErrorMessage).mapOrNull(ValidationError)}
          </FormControl>
        )}
        {!chainRules?.hiddenFields?.includes("initialSupply") && (
          <FormControl>
            <Label>
              <Label.Text id="initialSupply-label">
                {isMintable
                  ? "Enter initial supply"
                  : "Enter total supply - This will be a fixed supply for the token"}
              </Label.Text>
            </Label>
            <ModalFormInput
              id="initialSupply"
              placeholder={`Enter ${isMintable ? "initial" : "total"} supply`}
              min={0}
              onKeyDown={preventNonNumericInput}
              aria-labelledby="initialSupply-label"
              readOnly={hasInitialSupplyRule}
              {...register("initialSupply")}
            />
            {Maybe.of(initialSupplyErrorMessage).mapOrNull(ValidationError)}
          </FormControl>
        )}
        <FormControl>
          <div className="flex items-center justify-between">
            <Label>
              <Label.Text id="salt-label">Salt</Label.Text>
            </Label>
            <Tooltip tip="Generate random salt" $position="left">
              <button
                type="button"
                onClick={() => actions.generateRandomSalt()}
              >
                <RefreshCwIcon className="h-[1em] hover:text-primary" />
              </button>
            </Tooltip>
          </div>
          <ModalFormInput
            id="salt"
            onKeyDown={preventNonHexInput}
            defaultValue={state.tokenDetailsForm.getValues("salt")}
            aria-labelledby="salt-label"
            {...register("salt")}
          />
          {Maybe.of(formState.errors.salt).mapOrNull(ValidationError)}
        </FormControl>
        <button type="submit" ref={formSubmitRef} />
      </form>
      <Dialog.Actions className="sticky bottom-0 bg-inherit pt-2">
        <Dialog.CloseAction onClick={actions.reset}>
          Cancel & exit
        </Dialog.CloseAction>
        <NextButton onClick={() => formSubmitRef.current?.click()}>
          <p className="text-indigo-600">Register & Deploy</p>
        </NextButton>
      </Dialog.Actions>
    </>
  );
};

export default TokenDetails;
