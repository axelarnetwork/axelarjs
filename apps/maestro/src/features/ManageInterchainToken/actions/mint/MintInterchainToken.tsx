import {
  Button,
  Dialog,
  FormControl,
  Label,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { invariant } from "@axelarjs/utils";
import { useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { TransactionExecutionError } from "viem";

import { logger } from "~/lib/logger";
import { preventNonNumericInput } from "~/lib/utils/validation";
import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import { useMintInterchainTokenState } from "./MintInterchainToken.state";

type FormState = {
  amountToMint: string;
};

export const MintInterchainToken: FC = () => {
  const { register, handleSubmit, formState } = useForm<FormState>({
    defaultValues: {
      amountToMint: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [
    { txState, accountAddress, erc20Details, isMinting },
    { setTxState, mintTokenAsync },
  ] = useMintInterchainTokenState();

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();

    const decimalAdjustment = BigInt(10 ** (erc20Details?.decimals ?? 18));
    const adjustedAmount = BigInt(data.amountToMint) * decimalAdjustment;

    setTxState({
      status: "awaiting_approval",
    });

    invariant(accountAddress, "Account address is required");

    try {
      const txResult = await mintTokenAsync({
        args: [accountAddress, adjustedAmount],
      });

      if (txResult?.hash) {
        setTxState({
          status: "submitted",
          hash: txResult?.hash,
        });
      }
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Failed to mint tokens: ${error.cause.shortMessage}`);
        logger.error(`Failed to mint tokens: ${error.cause.message}`);

        setTxState({
          status: "idle",
        });
        return;
      }

      setTxState({
        status: "reverted",
        error: error as Error,
      });
    }
  };

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Mint tokens";
      case "awaiting_approval":
        return "Confirm on wallet";
      case "submitted":
        return "Minting tokens...";
      case "reverted":
        return "Failed to mint tokens";
    }
  }, [txState]);

  return (
    <>
      <Dialog.Title className="flex">
        <span>Mint interchain tokens on</span>
        <EVMChainsDropdown disabled compact />
      </Dialog.Title>
      <form
        className="flex flex-1 flex-col justify-between gap-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <FormControl>
          <Label htmlFor="amountToMint">
            <Label.Text>Amount to mint</Label.Text>
          </Label>
          <TextInput
            id="amountToMint"
            bordered
            placeholder="Enter your amount to mint"
            min={0}
            className="bg-base-200"
            onKeyDown={preventNonNumericInput}
            {...register("amountToMint", {
              disabled: isMinting,
              validate(value) {
                if (!value || value === "0") {
                  return "Amount must be greater than 0";
                }

                return true;
              },
            })}
          />
        </FormControl>

        <Button
          variant="primary"
          type="submit"
          disabled={!formState.isValid || isMinting}
          loading={
            txState.status === "awaiting_approval" ||
            txState.status === "submitted"
          }
        >
          {buttonChildren}
        </Button>
      </form>
    </>
  );
};

export default MintInterchainToken;
