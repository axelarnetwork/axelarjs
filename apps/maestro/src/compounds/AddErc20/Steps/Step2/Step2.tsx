import { FC } from "react";

import { useAddErc20StateContainer } from "../../AddErc20.state";
import { NewERC20Token } from "./NewERC20Token";
import { PreExistingERC20Token } from "./PreExisting";

export const Step2: FC = () => {
  const { state } = useAddErc20StateContainer();

  return state.newTokenType === "new" ? (
    <NewERC20Token />
  ) : (
    <PreExistingERC20Token />
  );
};

export default Step2;
