import { FC, useCallback, useMemo, useState } from "react";

import { Button, Modal, TextInput } from "@axelarjs/ui";
import { useNetwork } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";

import { useSendInterchainTokenMutation } from "./hooks/useSendInterchainTokenMutation";

type Props = {
  trigger?: JSX.Element;
  tokenAddress: `0x${string}`;
  tokenId: `0x${string}`;
};

export const SendInterchainToken: FC<Props> = (props) => {
  const { data: evmChains } = useEVMChainConfigsQuery();
  const [amount, setAmount] = useState<number | undefined>();
  const { chain: currentChain } = useNetwork();
  const { mutateAsync: sendToken } = useSendInterchainTokenMutation({
    tokenAddress: props.tokenAddress,
    tokenId: props.tokenId,
  });

  const [fromChainId, setFromChainId] = useState(currentChain?.id);
  const [toChainId, setToChainId] = useState(5);
  const back = () => (
    <Modal.CloseAction
      // onClick={actions.resetAddErc20StateInputs}
      color="secondary"
    >
      Close
    </Modal.CloseAction>
  );

  const forward = () => (
    <Modal.CloseAction
      // onClick={actions.resetAddErc20StateInputs}
      color="primary"
    >
      Close
    </Modal.CloseAction>
  );

  const selectedFromChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === fromChainId),
    [fromChainId, evmChains]
  );
  const selectedToChain = useMemo(
    () => evmChains?.find((c) => c.chain_id === toChainId),
    [toChainId, evmChains]
  );

  const handleSend = useCallback(async () => {
    if (!(selectedFromChain && selectedToChain && amount)) {
      return;
    }

    await sendToken({
      tokenAddress: props.tokenAddress,
      tokenId: props.tokenId,
      toNetwork: selectedToChain.chain_name,
      fromNetwork: selectedFromChain.chain_name,
      amount: amount?.toString(),
    });
  }, [
    sendToken,
    props.tokenAddress,
    props.tokenId,
    selectedFromChain,
    selectedToChain,
    amount,
  ]);

  return (
    <Modal trigger={props.trigger}>
      <Modal.Body>
        <div>
          <Modal.Title className="flex items-center gap-2">
            Send Interchain Token
          </Modal.Title>

          <div className="mt-5 grid grid-cols-2">
            <div className="grid grid-cols-1">
              <label className="text-center">Source Chain</label>
              <EVMChainsDropdown
                compact={true}
                selectedChain={selectedFromChain}
                chains={evmChains}
                onSwitchNetwork={(chain_id) => {
                  const target = evmChains?.find(
                    (c) => c.chain_id === chain_id
                  );
                  if (target) {
                    setFromChainId(target?.chain_id);
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-1">
              <label className="text-center">Destination Chain</label>
              <EVMChainsDropdown
                compact={true}
                selectedChain={selectedToChain}
                chains={evmChains}
                onSwitchNetwork={(chain_id) => {
                  const target = evmChains?.find(
                    (c) => c.chain_id === chain_id
                  );
                  if (target) {
                    setToChainId(target?.chain_id);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <TextInput
          inputSize={"md"}
          type={"number"}
          color={"primary"}
          className={"mt-5 w-full"}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          placeholder="Amount to send"
        />
        <div>TOKEN ID: {props.tokenId}</div>
        <Button onClick={handleSend}>Send [TODO]</Button>
      </Modal.Body>
      <Modal.Actions>
        {back()}
        {forward()}
      </Modal.Actions>
    </Modal>
  );
};
export default SendInterchainToken;
