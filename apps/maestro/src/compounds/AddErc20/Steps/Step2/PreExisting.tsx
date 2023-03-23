import { FC, useEffect, useState } from "react";

import { TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils";
import { useSigner } from "wagmi";

import { useGetERC20TokenDetails } from "~/lib/contract/hooks/useERC20";
import { useCheckTokenExistsInTokenLinker } from "~/lib/contract/hooks/useInterchainTokenLinker";

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
          setTokenAlreadyExists={props.setTokenAlreadyExists}
        />
      )}
    </div>
  );
};

type ERC20DetailsProps = {
  address: string;
  setTokenAlreadyExists: (okenAlreadyExists: boolean) => void;
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

  const { data: doesTlExist } = useCheckTokenExistsInTokenLinker({
    address: String(process.env.NEXT_PUBLIC_TOKEN_LINKER_ADDRESS),
    signerOrProvider: signer.data,
    tokenAddress: props.address as `0x${string}`,
  });

  useEffect(() => {
    tokenInfo && tokenInfo.decimals && setTokenDecimals(tokenInfo.decimals);
    tokenInfo && tokenInfo.tokenName && setTokenName(tokenInfo.tokenName);
    tokenInfo && tokenInfo.tokenSymbol && setTokenSymbol(tokenInfo.tokenSymbol);
    props.setTokenAlreadyExists(Boolean(doesTlExist));
  }, [props.address, tokenInfo, doesTlExist]);

  return (
    <div>
      <div>{props.address}</div>
      <div>
        Does token exist: {doesTlExist ? "Token Exists" : "Token Doesnt Exist"}
      </div>
      <div>Decimals: {tokenDecimals}</div>
      <div>Token Name: {tokenName}</div>
      <div>Token Symbol: {tokenSymbol}</div>
    </div>
  );
};
