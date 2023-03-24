import { FC, useEffect, useState } from "react";

import { TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils";
import { useNetwork, useSigner } from "wagmi";

import { ADDRESS_ZERO_BYTES32 } from "~/config/constants";
import { useGetERC20TokenDetails } from "~/lib/contract/hooks/useERC20";
import { useInterchainTokensQuery } from "~/services/gmp/hooks";

import { StepProps } from "..";

export const PreExistingERC20Token: FC<StepProps> = (props: StepProps) => {
  const [tokenAddress, setTokenAddress] = useState("");
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
      {validatedAddr && (
        <ERC20Details
          address={validatedAddr}
          setTokenAlreadyRegistered={props.setTokenAlreadyRegistered}
          setIsPreexistingToken={props.setIsPreexistingToken}
          deployedTokenAddress={props.deployedTokenAddress}
          setDeployedTokenAddress={props.setDeployedTokenAddress}
        />
      )}
    </div>
  );
};

type ERC20DetailsProps = {
  address: string;
  setTokenAlreadyRegistered: (tokenAlreadyRegistered: boolean) => void;
  setIsPreexistingToken: (isPreexistingToken: boolean) => void;
  deployedTokenAddress: string;
  setDeployedTokenAddress: (deployedTokenAddress: string) => void;
};

export const ERC20Details: FC<ERC20DetailsProps> = (
  props: ERC20DetailsProps
) => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const signer = useSigner();
  const { data: tokenInfo } = useGetERC20TokenDetails({
    address: props.address,
    signerOrProvider: signer.data,
    tokenAddress: props.address as `0x${string}`,
  });

  const { chain } = useNetwork();
  const { data: tokenData } = useInterchainTokensQuery({
    chainId: chain?.id,
    tokenAddress: props.address as `0x${string}`,
  });

  useEffect(() => {
    tokenInfo && tokenInfo.decimals && setTokenDecimals(tokenInfo.decimals);
    tokenInfo && tokenInfo.tokenName && setTokenName(tokenInfo.tokenName);
    tokenInfo && tokenInfo.tokenSymbol && setTokenSymbol(tokenInfo.tokenSymbol);
    tokenInfo && props.setIsPreexistingToken(Boolean(tokenInfo));
    tokenInfo && props.setDeployedTokenAddress(props.address);
    props.setTokenAlreadyRegistered(
      Boolean(tokenData?.tokenId !== ADDRESS_ZERO_BYTES32)
    );
  }, [props.address, tokenInfo, tokenData]);

  return (
    <div>
      <div>{props.address}</div>
      <div>
        Does token exist:{" "}
        {tokenData?.tokenId !== ADDRESS_ZERO_BYTES32
          ? "Token Exists"
          : "Token Doesnt Exist"}
      </div>
      <div>Decimals: {tokenDecimals}</div>
      <div>Token Name: {tokenName}</div>
      <div>Token Symbol: {tokenSymbol}</div>
    </div>
  );
};
