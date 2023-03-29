import { FC, useEffect, useState } from "react";

import { Card, TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils";
import { useNetwork } from "wagmi";

import { ADDRESS_ZERO_BYTES32 } from "~/config/constants";
import {
  useGetERC20TokenDetailsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

import { useAddErc20StateContainer } from "../../AddErc20.state";

export const PreExistingERC20Token: FC = () => {
  const { state } = useAddErc20StateContainer();

  const [tokenAddress, setTokenAddress] = useState(
    state.deployedTokenAddress || ""
  );
  const [validatedAddr, setValidatedAddr] = useState<string>("");

  useEffect(() => {
    setValidatedAddr(isAddress(tokenAddress) ? tokenAddress : "");
  }, [tokenAddress]);

  return (
    <div className="grid grid-cols-1 gap-y-2">
      <label className="text-sm">Token Address {validatedAddr}</label>
      <TextInput
        inputSize={"md"}
        color={"primary"}
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Input your token address"
      />
      {validatedAddr && <ERC20Details address={validatedAddr} />}
    </div>
  );
};

type ERC20DetailsProps = {
  address: string;
};

export const ERC20Details: FC<ERC20DetailsProps> = (
  props: ERC20DetailsProps
) => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);

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
    token?.decimals && setTokenDecimals(token.decimals as number);
    token?.tokenName && setTokenName(token.tokenName as string);
    token?.tokenSymbol && setTokenSymbol(token.tokenSymbol as string);
    token && actions.setIsPreExistingToken(Boolean(token));
    token && actions.setDeployedTokenAddress(props.address);

    actions.setTokenAlreadyRegistered(
      Boolean(tlData?.tokenId && tlData?.tokenId !== ADDRESS_ZERO_BYTES32)
    );
  }, [props.address, token, tlData, props, actions]);

  return (
    <Card className="bg-base-300" compact>
      <Card.Body $as="ul" className="list-inside">
        <Card.Title>
          <h3>Token Details</h3>
        </Card.Title>
        <ul>
          <li className="list-item">Decimals: {tokenDecimals}</li>
          <li className="list-item">Token Name: {tokenName}</li>
          <li className="list-item">Token Symbol: {tokenSymbol}</li>
        </ul>
      </Card.Body>
    </Card>
  );
};
