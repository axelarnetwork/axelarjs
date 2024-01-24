import { Dialog, FormControl, Label } from "@axelarjs/ui";
import { type FC } from "react";

import { useCanonicalTokenDeploymentStateContainer } from "~/features/CanonicalTokenDeployment";
import {
  ModalFormInput,
  NextButton,
  TokenNameTooltip,
} from "~/ui/compounds/MultiStepForm";

const TokenDetails: FC = () => {
  const { state, actions } = useCanonicalTokenDeploymentStateContainer();

  return (
    <>
      <form className="grid grid-cols-1 sm:gap-2">
        <FormControl>
          <Label>
            <Label.Text>
              Token Name <TokenNameTooltip />
            </Label.Text>
          </Label>
          <ModalFormInput
            placeholder="Enter your token name"
            disabled
            defaultValue={state.tokenDetails.tokenName}
          />
        </FormControl>
        <FormControl>
          <Label>Token Symbol</Label>
          <ModalFormInput
            placeholder="Enter your token symbol"
            disabled
            defaultValue={state.tokenDetails.tokenSymbol}
          />
        </FormControl>
        <FormControl>
          <Label htmlFor="tokenDecimals">Token Decimals</Label>
          <ModalFormInput
            id="tokenDecimals"
            type="number"
            placeholder="Enter your token decimals"
            disabled
            defaultValue={state.tokenDetails.tokenDecimals}
          />
        </FormControl>
      </form>
      <Dialog.Actions>
        <Dialog.CloseAction onClick={actions.reset}>
          Cancel & exit
        </Dialog.CloseAction>
        <NextButton onClick={actions.nextStep}>Deploy & Register</NextButton>
      </Dialog.Actions>
    </>
  );
};

export default TokenDetails;
