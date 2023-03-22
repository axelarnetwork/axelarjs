import { FC } from "react";

import { StepProps } from "..";
import { NewERC20Token } from "./NewERC20Token";
import { PreExistingERC20Token } from "./PreExisting";

export const Step2: FC<StepProps> = (props: StepProps) => {
  return props.newTokenType === "new" ? (
    <NewERC20Token {...props} />
  ) : (
    <PreExistingERC20Token {...props} />
  );
};
