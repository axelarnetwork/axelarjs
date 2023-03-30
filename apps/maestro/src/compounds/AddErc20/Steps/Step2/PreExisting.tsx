import { FC, useEffect, useState } from "react";

import { Card, TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils";
import { useNetwork } from "wagmi";

import { useAddErc20StateContainer } from "~/compounds/AddErc20";
import { ADDRESS_ZERO_BYTES32 } from "~/config/constants";
import {
  useGetERC20TokenDetailsQuery,
  useInterchainTokensQuery,
} from "~/services/gmp/hooks";

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
    <Card className="bg-base-200 dark:bg-base-300" compact>
      <Card.Body $as="ul" className="list-inside">
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
  );
};
