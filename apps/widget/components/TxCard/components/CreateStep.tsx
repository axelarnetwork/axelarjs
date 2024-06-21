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
  interchainTokenAddress: string;
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
      <motion.div className="flex w-full justify-between text-xl text-blue-400">
        <CustomConnectBtn />
        <motion.div
          onClick={onClickInfo}
          className="mb-5 h-6 w-6 transform cursor-pointer self-end rounded-full border-2 border-blue-500 text-center text-sm text-blue-500 transition-transform duration-100 hover:scale-110"
        >
          i
        </motion.div>
      </motion.div>
      <label htmlFor="amount" className="mt-8 block font-medium text-white">
        <motion.div className="flex w-full justify-between">
          <motion.p className="text-blue-400">FROM:</motion.p>

          <AnimatePresence>
            <motion.div className="h-6">
              {name && symbol && (
                <motion.p key="token-info-content" className="text-green-400">
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
        placeholder="Enter Interchain Token ID"
        autoCorrect="off"
        spellCheck="false"
        className={`text-md my-2 h-24 w-full border bg-gray-900 font-medium text-white ${
          name ? "border-green-500" : "border-gray-700"
        } rounded-md px-4 py-2 focus:border-blue-500 focus:outline-none`}
        style={{ resize: "none" }}
      />
      <label htmlFor="amount" className="mt-5 block font-medium text-white">
        <motion.div className="flex w-full justify-between">
          <motion.p className="text-blue-400">Send {symbol}:</motion.p>
          {name && (
            <motion.p className="pt-1 text-xs text-gray-400">
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
            className={`w-full border bg-gray-900 text-right font-medium ${
              isValidAmount() ? "border-gray-700" : "border-red-500"
            } rounded-md px-4 py-2 focus:border-blue-500 focus:outline-none`}
          />
        </motion.div>
      </motion.div>
      <label
        htmlFor="destinationAddress"
        className="mt-4 block font-medium text-blue-400"
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
            className={`h-24 w-full border bg-gray-900 font-medium ${
              (destinationAddressValue ? isValidAddress() : true)
                ? "border-gray-700"
                : "border-red-500"
            } rounded-md px-4 py-2 focus:border-blue-500 focus:outline-none`}
            style={{ resize: "none" }}
          />
          <motion.div className="ml-4 mt-1">
            <Dropdown
              option="chains"
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
