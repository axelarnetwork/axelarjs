import { useState } from "react";

import { createContainer } from "unstated-next";

export type DeployAndRegisterTransactionState =
  | {
      type: "idle";
    }
  | {
      type: "deploying";
      txHash: `0x${string}`;
    }
  | {
      type: "deployed";
      txHash: `0x${string}`;
      tokenAddress: `0x${string}`;
    };

export const INITIAL_STATE = {
  step: 0,
  newTokenType: "new" as "new" | "existing",
  tokenName: "",
  tokenSymbol: "",
  decimals: 0,
  amountToMint: 0,
  deployedTokenAddress: "",
  txHash: undefined as `0x${string}` | undefined,
  tokenAlreadyRegistered: false,
  isPreExistingToken: false,
  txState: { type: "idle" } as DeployAndRegisterTransactionState,
  selectedChains: new Set<string>(),
};

function useAddErc20State(initialState = INITIAL_STATE) {
  const [step, setStep] = useState(0);
  const [newTokenType, setNewTokenType] = useState<"new" | "existing">(
    initialState.newTokenType
  );
  const [tokenName, setTokenName] = useState(initialState.tokenName);
  const [tokenSymbol, setTokenSymbol] = useState(initialState.tokenSymbol);
  const [decimals, setDecimals] = useState(initialState.decimals);
  const [amountToMint, setAmountToMint] = useState(initialState.amountToMint);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState(
    initialState.deployedTokenAddress
  );
  const [txHash, setTxHash] = useState<`0x${string}`>(
    initialState.txHash as `0x${string}`
  );
  const [tokenAlreadyRegistered, setTokenAlreadyRegistered] = useState(
    initialState.tokenAlreadyRegistered
  );
  const [isPreExistingToken, setIsPreExistingToken] = useState(
    initialState.isPreExistingToken
  );
  const [txState, setTxState] = useState<DeployAndRegisterTransactionState>(
    initialState.txState
  );
  const [selectedChains, setSelectedChains] = useState(
    initialState.selectedChains
  );

  const resetAddErc20StateInputs = () => {
    setStep(0);
    setNewTokenType("new");
    setTokenName("");
    setTokenSymbol("");
    setDecimals(0);
    setAmountToMint(0);
    setTxState({ type: "idle" });
    setIsPreExistingToken(false);
    setTokenAlreadyRegistered(false);
    setSelectedChains(new Set<string>());
  };
  const resetAllState = () => {
    resetAddErc20StateInputs();
    setDeployedTokenAddress("");
  };

  const addSelectedChain = (item: string) =>
    setSelectedChains((prev) => new Set(prev).add(item));

  const removeSelectedChain = (item: string) => {
    setSelectedChains((prev) => {
      if (!prev.has(item)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  };

  return {
    state: {
      step,
      newTokenType,
      tokenName,
      tokenSymbol,
      decimals,
      amountToMint,
      txState,
      deployedTokenAddress,
      txHash,
      selectedChains,
      tokenAlreadyRegistered,
      isPreExistingToken,
    },
    actions: {
      setStep,
      setNewTokenType,
      setTokenName,
      setTokenSymbol,
      setDecimals,
      setAmountToMint,
      setDeployedTokenAddress,
      setTxState,
      resetAddErc20StateInputs,
      resetAllState,
      setTxHash,
      addSelectedChain,
      removeSelectedChain,
      setTokenAlreadyRegistered,
      setIsPreExistingToken,
      incrementStep: () => setStep((prev) => prev + 1),
    },
  };
}

export const {
  Provider: AddErc20StateProvider,
  useContainer: useAddErc20StateContainer,
} = createContainer(useAddErc20State);
