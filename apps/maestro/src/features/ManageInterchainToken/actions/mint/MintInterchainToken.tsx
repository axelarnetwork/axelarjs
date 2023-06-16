import {
  Button,
  Dialog,
  FormControl,
  Label,
  TextInput,
  toast,
} from "@axelarjs/ui";
import { useMemo, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import invariant from "tiny-invariant";
import {
  isAddress,
  TransactionExecutionError,
  UserRejectedRequestError,
} from "viem";
import { useAccount, useChainId, useWaitForTransaction } from "wagmi";

import EVMChainsDropdown from "~/components/EVMChainsDropdown";
import { useMintInterchainToken } from "~/lib/contract/hooks/useInterchainToken";
import { useTransactionState } from "~/lib/hooks/useTransaction";
import { trpc } from "~/lib/trpc";
import { useManageInterchainTokenContainer } from "../../ManageInterchaintoken.state";

type FormState = {
  amountToMint: string;
};

const ALLOWED_NON_NUMERIC_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
];

export const MintInterchainToken: FC = () => {
  const [txState, setTxState] = useTransactionState();
  const chainId = useChainId();
  const { address: accountAddress } = useAccount();

  const [state] = useManageInterchainTokenContainer();

  const { data: erc20Details } = trpc.erc20.getERC20TokenDetails.useQuery(
    {
      tokenAddress: state.tokenAddress,
      chainId,
    },
    {
      enabled: isAddress(state.tokenAddress) && Boolean(chainId),
    }
  );

  const {
    writeAsync: mintTokenAsync,
    isLoading: isMinting,
    data: mintResult,
  } = useMintInterchainToken({
    address: state.tokenAddress,
  });

  const trpcContext = trpc.useContext();

  useWaitForTransaction({
    hash: mintResult?.hash,
    confirmations: 5,
    async onSuccess(receipt) {
      if (!mintResult) {
        return;
      }

      await trpcContext.erc20.getERC20TokenBalanceForOwner.invalidate();
      await trpcContext.erc20.getERC20TokenBalanceForOwner.refetch();

      setTxState({
        status: "confirmed",
        receipt,
      });

      toast.success("Successfully minted interchain tokens");
    },
  });

  const { register, handleSubmit, formState } = useForm<FormState>({
    defaultValues: {
      amountToMint: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitHandler: SubmitHandler<FormState> = async (data, e) => {
    e?.preventDefault();

    const decimalAdjustment = BigInt(10 ** (erc20Details?.decimals ?? 18));
    const adjustedAmount = BigInt(data.amountToMint) * decimalAdjustment;

    setTxState({
      status: "awaiting_approval",
    });

    invariant(accountAddress, "Account address is required");

    const txResult = await mintTokenAsync({
      args: [accountAddress, adjustedAmount],
    }).catch((error) => {
      if (
        error instanceof TransactionExecutionError &&
        error.cause instanceof UserRejectedRequestError
      ) {
        console.log("User rejected request");
      }
    });

    if (txResult?.hash) {
      setTxState({
        status: "submitted",
        hash: txResult?.hash,
      });
    }
  };

  const buttonChildren = useMemo(() => {
    switch (txState.status) {
      case "idle":
      case "confirmed":
        return "Mint tokens";
      case "awaiting_approval":
        return "Waiting for approval";
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
            onKeyDown={(e) => {
              // prevent non-numeric characters
              if (
                // allow backspace, delete, tab, arrow keys, enter
                !ALLOWED_NON_NUMERIC_KEYS.includes(e.key) &&
                // is not numeric
                !/^[0-9.]+$/.test(e.key)
              ) {
                e.preventDefault();
              }
            }}
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
          color="primary"
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
