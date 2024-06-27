import { useState } from "react";

import { BigNumberish, formatUnits, isAddress } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { Chain, type Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import tokenABI from "../../../contract-abis/token.abi.json";
import useInterchainTransfer from "../../../hooks/useInterchainTransfer";
import useTokenData from "../../../hooks/useTokenData";
import { CustomConnectBtn } from "../../common/CustomConnectBtn";
import Dropdown from "../../common/Dropdown";
import LoadingButton from "../../common/LoadingButton";

type TokenData = {
  address: `0x${string}`;
  name: string;
  symbol: string;
};
interface CreateStepContentProps {
  isLoadingTx: boolean;
  amountInputValue: string;
  handleAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  destinationAddressValue: string;
  handleDestinationAddressChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  setSelectedToChain: React.Dispatch<React.SetStateAction<Chain | null>>;
  selectedToChain: Chain | null;
  onClickInfo: () => void;
}
const CreateStepContent: React.FC<CreateStepContentProps> = ({
  isLoadingTx,
  amountInputValue,
  handleAmountInputChange,
  destinationAddressValue,
  handleDestinationAddressChange,
  setSelectedToChain,
  selectedToChain,
  onClickInfo,
}) => {
  const account = useAccount();
  const { sendTransfer } = useInterchainTransfer();
  const [tokenId, setTokenId] = useState<string>("");

  const tokenData: TokenData = useTokenData(tokenId) as TokenData;
  const { address: interchainTokenAddress, name, symbol } = tokenData;
  const { data: balance } = useReadContract({
    abi: tokenABI as Abi,
    address: interchainTokenAddress,
    functionName: "balanceOf",
    args: [account.address],
  });
  function onClickSend() {
    if (selectedToChain) {
      void sendTransfer(
        selectedToChain,
        amountInputValue,
        tokenId,
        destinationAddressValue
      );
    }
  }

  const handleTokenIdChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTokenId(e.target.value);
  };

  const balanceFormatted = formatUnits((balance as BigNumberish) || "0");

  const isValidAddress = () => isAddress(destinationAddressValue);

  const isValidAmount = () =>
    parseFloat(amountInputValue) > 0 &&
    parseFloat(amountInputValue) <= parseFloat(balanceFormatted);

  const isButtonDisabled =
    !destinationAddressValue ||
    !amountInputValue ||
    !isValidAmount() ||
    !isValidAddress();
  !selectedToChain?.id;

  return (
    <>
      <motion.div className="flex w-full justify-between items-center text-xl text-blue-400">
        <CustomConnectBtn />
        <motion.div
          onClick={onClickInfo}
          className="border-primary text-primary h-6 w-6 transform cursor-pointer rounded-full border-2 text-center text-sm transition-transform duration-100 hover:scale-110"
        >
          i
        </motion.div>
      </motion.div>
      <label htmlFor="amount" className="mt-8 block font-medium text-gray-400">
        <motion.div className="flex w-full justify-between">
          <motion.p className="text-pimary">From:</motion.p>

          <AnimatePresence>
            <motion.div className="h-6">
              {name && symbol && (
                <motion.p key="token-info-content" className="text-primary">
                  {`${name} (${symbol})`}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </label>
      <textarea
        value={tokenId}
        onChange={handleTokenIdChange}
        id="tokenId"
        placeholder="Enter Token Address or Interchain Token ID"
        autoCorrect="off"
        spellCheck="false"
        className={`text-md bg-secondary my-2 h-24 w-full border font-medium text-gray-400 ${
          name ? "border-green-500" : "border-gray-700"
        } focus:border-primary rounded-md px-4 py-2 focus:outline-none`}
        style={{ resize: "none" }}
      />
      <label htmlFor="amount" className="mt-5 block font-medium text-gray-400">
        <motion.div className="flex w-full justify-between">
          <motion.div className="flex text-gray-400">
            Send&nbsp; <div className="text-primary">{symbol}</div>:
          </motion.div>
          {name && (
            <motion.p className="text-primary pt-1 text-xs">
              Max: {balance !== undefined ? balanceFormatted : "Loading..."}
            </motion.p>
          )}
        </motion.div>
      </label>

      <motion.div className="mt-2 flex items-center gap-4 md:flex-row">
        <motion.div className="relative flex flex-grow">
          <input
            inputMode="decimal"
            disabled={isLoadingTx}
            type="text"
            value={amountInputValue}
            onChange={handleAmountInputChange}
            id="amount"
            placeholder="Enter amount"
            className={`bg-secondary w-full border text-right font-medium ${
              isValidAmount() ? "border-gray-700" : "border-red-500"
            } focus:border-primary rounded-md px-4 py-2 focus:outline-none`}
          />
        </motion.div>
      </motion.div>
      <label
        htmlFor="destinationAddress"
        className="mt-4 block font-medium text-gray-400"
      >
        To:
      </label>
      <motion.div className="mt-2 flex items-center gap-4 md:flex-row">
        <motion.div className="relative flex flex-grow">
          <textarea
            disabled={isLoadingTx}
            value={destinationAddressValue}
            onChange={handleDestinationAddressChange}
            id="destinationAddress"
            placeholder="Enter destination address"
            autoCorrect="off"
            spellCheck="false"
            className={`bg-secondary h-24 w-full border font-medium ${
              (destinationAddressValue ? isValidAddress() : true)
                ? "border-gray-700"
                : "border-red-500"
            } focus:border-primary rounded-md px-4 py-2 focus:outline-none`}
            style={{ resize: "none" }}
          />
          <motion.div className="ml-4 mt-1">
            <Dropdown
              onSelectValue={setSelectedToChain}
              value={selectedToChain}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div className="mt-10 flex w-full justify-end">
        <LoadingButton onClick={onClickSend} disabled={isButtonDisabled}>
          Send
        </LoadingButton>
      </motion.div>
    </>
  );
};

export default CreateStepContent;
