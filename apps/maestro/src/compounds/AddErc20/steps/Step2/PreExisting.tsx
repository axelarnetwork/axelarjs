import { FC, useEffect, useState } from "react";

import { Card, FormControl, Label, Modal, TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils";
import { useNetwork } from "wagmi";

import { useAddErc20StateContainer } from "~/compounds/AddErc20";
import { ADDRESS_ZERO_BYTES32 } from "~/config/constants";
import {
  useGetERC20TokenDetailsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

import { NextButton, PrevButton } from "../core";

export const PreExistingERC20Token: FC = () => {
  const { state, actions } = useAddErc20StateContainer();

  const [tokenAddress, setTokenAddress] = useState(
    state.deployedTokenAddress || ""
  );
  const [validatedAddr, setValidatedAddr] = useState<string>("");

  useEffect(() => {
    setValidatedAddr(isAddress(tokenAddress) ? tokenAddress : "");
  }, [tokenAddress]);

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <FormControl>
        <Label>Token Address</Label>
        <TextInput
          inputSize={"md"}
          color={"primary"}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Input your token address"
        />
      </FormControl>
      {validatedAddr ? (
        <ERC20Details address={validatedAddr} />
      ) : (
        <Modal.Actions>
          <PrevButton onClick={actions.decrementStep}>Select Flow</PrevButton>
          <NextButton disabled={true}>Deploy & Register</NextButton>
        </Modal.Actions>
      )}
    </div>
  );
};

type ERC20DetailsProps = {
  address: string;
};

export const ERC20Details: FC<ERC20DetailsProps> = (
  props: ERC20DetailsProps
) => {
  const [tokenInfo, setTokenInfo] = useState<{
    decimals: number;
    tokenName: string;
    tokenSymbol: string;
  }>();

  const { chain } = useNetwork();
  const { data: tlData } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: props.address as `0x${string}`,
  });
  const { data: token } = useGetERC20TokenDetailsQuery({
    chainId: chain?.id,
    tokenAddress: props.address as `0x${string}`,
  });

  const { actions } = useAddErc20StateContainer();

  useEffect(() => {
    if (token) {
      setTokenInfo(token);
      actions.setIsPreExistingToken(Boolean(token));
      actions.setDeployedTokenAddress(props.address);
    }
    actions.setTokenAlreadyRegistered(
      Boolean(tlData?.tokenId && tlData?.tokenId !== ADDRESS_ZERO_BYTES32)
    );
  }, [props.address, token, tlData, props, actions]);

  return (
    <>
      <Card className="bg-base-200 dark:bg-base-300" compact={true}>
        <Card.Body>
          <Card.Title>
            <h3>Token Details</h3>
          </Card.Title>

          <ul>
            <li>Decimals: {tokenInfo?.decimals ?? "..."}</li>
            <li>Token Name: {tokenInfo?.tokenName ?? "..."}</li>
            <li>Token Symbol: {tokenInfo?.tokenSymbol ?? "..."}</li>
          </ul>
        </Card.Body>
      </Card>
      <Modal.Actions>
        <PrevButton onClick={actions.decrementStep}>Select Flow</PrevButton>
        <NextButton
          onClick={actions.incrementStep}
          disabled={!tokenInfo?.decimals}
        >
          Deploy & Register
        </NextButton>
      </Modal.Actions>
    </>
  );
};
