import { FC, useEffect, useState } from "react";

import { TextInput } from "@axelarjs/ui";
import { isAddress } from "ethers/lib/utils";
import { useSigner } from "wagmi";

import { useERC20 } from "~/lib/contract/hooks/useERC20";

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
      {validatedAddr && <ERC20Details address={validatedAddr} />}
    </div>
  );
};

type ERC20DetailsProps = {
  address: string;
};

export const ERC20Details: FC<ERC20DetailsProps> = ({ address }) => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const signer = useSigner();
  const erc20 = useERC20({ address, signerOrProvider: signer.data });

  useEffect(() => {
    erc20?.decimals().then((decimals) => setTokenDecimals(decimals));
    erc20?.name().then((name) => setTokenName(name));
    erc20?.symbol().then((symbol) => setTokenSymbol(symbol));
  }, [address]);

  return (
    <div>
      <div>{address}</div>
      <div>Decimals: {tokenDecimals}</div>
      <div>Token Name: {tokenName}</div>
      <div>Token Symbol: {tokenSymbol}</div>
    </div>
  );
};
