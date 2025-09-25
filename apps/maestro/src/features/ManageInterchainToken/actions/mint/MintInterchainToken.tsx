import { Button, Dialog, FormControl, Label, TextInput } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { invariant } from "@axelarjs/utils";
import { useEffect, useMemo, useRef, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { parseUnits, TransactionExecutionError } from "viem";

import useMintStellarTokens from "~/features/stellarHooks/useMintStellarTokens";
import useMintTokens from "~/features/suiHooks/useMintTokens";
import {
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  useAccount,
  useChainId,
} from "~/lib/hooks";
import { logger } from "~/lib/logger";
import { preventNonNumericInput } from "~/lib/utils/validation";
import ChainsDropdown from "~/ui/components/ChainsDropdown";
import { useManageInterchainTokenContainer } from "../../ManageInterchainToken.state";
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

  const chainId = useChainId();
  const { chain } = useAccount();

  const [
    { txState, accountAddress, erc20Details, isMinting, tokenAddress, tokenId },
    { setTxState, mintTokenAsync },
  ] = useMintInterchainTokenState();

  const [, manageActions] = useManageInterchainTokenContainer();

  const mintTokens = useMintTokens();
  const mintStellarTokens = useMintStellarTokens();
  const handledToastKeyRef = useRef<string | null>(null);

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();
    invariant(accountAddress, "Account address is required");

    setTxState({
      status: "awaiting_approval",
    });

    const adjustedAmount = parseUnits(
      data.amountToMint,
      erc20Details?.decimals || 18
    );

    try {
      if (chainId === SUI_CHAIN_ID) {
        const result = await mintTokens({
          amount: adjustedAmount,
          coinType: tokenAddress,
          tokenId: tokenId,
        });
        if (result.digest) {
          setTxState({
            status: "confirmed",
            hash: result.digest,
            chainId,
          });
        }
      } else if (chainId === STELLAR_CHAIN_ID) {
        const result = await mintStellarTokens({
          amount: adjustedAmount.toString(),
          tokenAddress: tokenAddress,
          toAddress: accountAddress,
        });

        if (result.hash) {
          setTxState({
            status: "confirmed",
            hash: result.hash,
            chainId,
          });
        }
      } else {
        const txHash = await mintTokenAsync({
          address: tokenAddress,
          args: [accountAddress, adjustedAmount],
        });
        if (txHash) {
          setTxState({
            status: "submitted",
            hash: txHash,
            chainId,
          });
        }
      }
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        toast.error(`Failed to mint tokens: ${error.cause.shortMessage}`, {
          duration: 10000,
        });
        logger.error(`Failed to mint tokens: ${error.cause.message}`);

        setTxState({
          status: "idle",
        });
        manageActions.closeModal();
        return;
      }

      setTxState({
        status: "reverted",
        error: error as Error,
      });
    }
  };

  useEffect(() => {
    if (txState.status !== "confirmed" && txState.status !== "reverted") {
      return;
    }

    const explorer = chain?.blockExplorers?.default?.url;
    const txHash =
      txState.status === "confirmed"
        ? (txState.receipt?.transactionHash ?? txState.hash)
        : txState.hash;
    const toastKey = `${txState.status}:${txHash ?? ""}:${chain?.id ?? ""}`;
    if (handledToastKeyRef.current === toastKey) {
      return;
    }
    handledToastKeyRef.current = toastKey;

    if (txState.status === "confirmed") {
      if (explorer && txHash) {
        toast.success(
          <span>
            Mint confirmed. View tx:
            <a
              href={`${explorer}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline"
            >
              {txHash}
            </a>
          </span>,
          { duration: 10000 }
        );
      } else {
        toast.success("Successfully minted interchain tokens", {
          duration: 10000,
        });
      }
      manageActions.closeModal();
      return;
    }

    if (txState.status === "reverted") {
      if (explorer && txHash) {
        toast.error(
          <span>
            Mint failed. View tx:
            <a
              href={`${explorer}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline"
            >
              {txHash}
            </a>
          </span>,
          { duration: 10000 }
        );
      } else {
        toast.error("Mint transaction failed", { duration: 10000 });
      }
      manageActions.closeModal();
    }
  }, [txState, chain, manageActions]);

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
        <ChainsDropdown disabled compact />
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
            $bordered
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
          type="submit"
          disabled={!formState.isValid || isMinting}
          $variant="primary"
          $loading={
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
