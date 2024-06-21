import { useState } from "react";

import { LayoutGroup, motion } from "framer-motion";
import { Chain } from "viem";

import useInterchainTransfer from "../../hooks/useInterchainTransfer";
import { isNumericInput } from "../../utils/utils";
import CreateStepContent from "./components/CreateStep";
import ErrorStep from "./components/ErrorStep";
import InfoStep from "./components/InfoStep";
import LoadingStep from "./components/LoadingStep";
import SuccessStep from "./components/SuccessStep";

const TxCard: React.FC = () => {
  const [selectedToChain, setSelectedToChain] = useState<Chain | null>(null);
  const [amountInputValue, setAmountInputValue] = useState("0.1");
  const [destinationAddressValue, setDestinationAddressValue] = useState("");
  const [interchainTokenAddress, setInterchainTokenAddress] = useState("");
  const [isInfoStep, setIsInfoStep] = useState(false);
  const { error, isLoadingTx, isPending, reset, hash } =
    useInterchainTransfer();
  const handleAmountInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    (isNumericInput(value) || value === "") && setAmountInputValue(value);

  const handleDestinationAddressChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setDestinationAddressValue(e.target.value);

  const onClickFinish = () => {
    reset();
    setInterchainTokenAddress("");
    setDestinationAddressValue("");
    setAmountInputValue("0.1");
  };

  const getStepComponent = () =>
    isInfoStep ? (
      <InfoStep goBack={() => setIsInfoStep(false)} />
    ) : error ? (
      <ErrorStep error={error} onClickAction={() => reset()} />
    ) : hash ? (
      <SuccessStep onClickAction={onClickFinish} hash={hash} />
    ) : isLoadingTx ? (
      <LoadingStep isWaitingForApproval={isPending} />
    ) : (
      <CreateStepContent
        interchainTokenAddress={interchainTokenAddress}
        isLoadingTx={isLoadingTx}
        amountInputValue={amountInputValue}
        handleAmountInputChange={handleAmountInputChange}
        destinationAddressValue={destinationAddressValue}
        handleDestinationAddressChange={handleDestinationAddressChange}
        setSelectedToChain={setSelectedToChain}
        selectedToChain={selectedToChain}
        onClickInfo={() => setIsInfoStep(true)}
      />
    );

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="w-full max-w-sm rounded-lg border border-blue-600 bg-gray-900 p-6 shadow-md"
      >
        {getStepComponent()}
      </motion.div>
    </LayoutGroup>
  );
};

export default TxCard;
