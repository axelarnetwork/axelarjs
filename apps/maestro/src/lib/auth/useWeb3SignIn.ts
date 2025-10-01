import { debounce, invariant } from "@axelarjs/utils";
import { useEffect, useRef } from "react";
import {
  signIn,
  signOut,
  useSession,
  type SignInResponse,
} from "next-auth/react";

import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { useMutation } from "@tanstack/react-query";
import { useSignMessage } from "wagmi";
import { watchAccount } from "wagmi/actions";
import { useSignTransaction as useXRPLSignTransaction, useWallet as useXRPLWallet } from "@xrpl-wallet-standard/react";

import { xrplChainConfig } from "~/config/chains/vm-chains";
import { wagmiConfig } from "~/config/wagmi";
import { useDisconnect } from "~/lib/hooks";
import { useStellarKit } from "~/lib/providers/StellarWalletKitProvider";
import { trpc } from "../trpc";
import { setStellarConnectionState } from "../utils/stellar";

import { Client, Wallet, multisign } from "xrpl";

export type UseWeb3SignInOptions = {
  enabled?: boolean;
  onSignInSuccess?: (response?: SignInResponse) => void;
  onSignInStart?: (address: string) => void;
};

const DEFAULT_OPTIONS: UseWeb3SignInOptions = {
  enabled: true,
  onSignInSuccess: () => {},
  onSignInStart: () => {},
};

/**
 * A hook that signs in a user with their connected Web3 wallet.
 *
 * @param {UseWeb3SignInOptions} options - The options object.
 * @param {boolean} options.enabled - Whether the hook is enabled. Defaults to `true`.
 * @param {Function} options.onSigninSuccess - A callback function to run after successfully signing in. Defaults to `() => {}`.
 * @param {Function} options.onSigninError - A callback function to run if there is an error signing in. Defaults to `() => {}`.
 */
export function useWeb3SignIn({
  enabled,
  onSignInStart,
  onSignInSuccess,
}: UseWeb3SignInOptions = DEFAULT_OPTIONS) {
  const { data: session, status: sessionStatus } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { mutateAsync: signSuiMessageAsync } = useSignPersonalMessage();
  const currentSuiAccount = useCurrentAccount();
  const xrplSignTransaction = useXRPLSignTransaction();
  const {wallet: xrplWallet, status: xrplConnectionStatus } = useXRPLWallet();

  const signInAddressRef = useRef<string | null>(null);

  const { mutateAsync: createSignInMessage } =
    trpc.auth.createSignInMessage.useMutation();

  // avoid signing in multiple times
  const isSigningInRef = useRef(false);
  const { kit } = useStellarKit();

  const {
    mutateAsync: signInWithWeb3Async,
    mutate: signInWithWeb3,
    error,
    ...mutation
  } = useMutation({
    mutationFn: async (address?: string | null) => {
      console.log("Starting sign in with web3 for address", address);
      try {
        invariant(address, "Address is required");

        signInAddressRef.current = address;
        isSigningInRef.current = true;

        console.log("Creating sign in message now", address);
        const { message } = await createSignInMessage({ address }).catch(
          (error) => {
            console.error("Error creating sign in message", error);
            throw error;
          }
        );

        onSignInStart?.(address);
        let signature;
        console.log("Address is", address);
        // 42 is the length of an EVM address
        if (address.length === 42) {
          signature = await signMessageAsync({ message });
        }
        // 66 is the length of a sui address
        else if (address.length === 66) {
          const resp = await signSuiMessageAsync({
            message: new TextEncoder().encode(message),
          });
          signature = resp.signature;
        } else if (address.startsWith("G")) {
          // Stellar
          invariant(kit, "Stellar wallet kit not initialized");
          const result = await kit.signMessage(message);
          signature = result.signedMessage;
        } else if (address.startsWith("r")) {
          // XRPL
          console.log("Signing using this XRPL account now");

          let xrplNetwork = `xrpl:${xrplChainConfig.environment}`;
          if(xrplChainConfig.environment === 'devnet-amplifier') {
            xrplNetwork = 'xrpl:devnet';
          }
          console.log("Using XRPL network", xrplNetwork);
          // things are more difficult for xrpl, since the wallet library does not allow to sign arbitrary messages
          // we have to create a transaction, sign it and extract the signature from there
          // at the same time, we must make sure that the transaction is not valid on the network
          // therefore, we create a transaction that has LastLedgerSequence set to 0

          const tx = {
            TransactionType: "AccountSet",
            Account: address,
            Memos: [
              { Memo: { MemoType: Buffer.from("auth-challenge").toString('hex'), MemoData: Buffer.from(message).toString('hex') } }
            ],
            // make it explicitly expired / un-submittable:
            LastLedgerSequence: 0,
            Sequence: 0,  // (optional) impossible sequence
            Fee: "0"
          };
          console.log("Signing this XRPL transaction", tx);

          const result = await xrplSignTransaction(tx, xrplNetwork as XRPLIdentifierString);
          signature = result.signed_tx_blob;
        }
        console.log("Checking signature:", signature);
        const response = await signIn("credentials", {
          address,
          signature,
          redirect: false,
        });
        if (response?.error) {
          throw new Error(response.error);
        }

        // If we successfully signed in with a Stellar wallet, set the connection state
        if (address.startsWith("G")) {
          setStellarConnectionState(true);
        }

        onSignInSuccess?.(response);

        isSigningInRef.current = false;
      } catch (error) {
        console.warn("Error signing in with web3", error);
        if (error instanceof Error) {
          disconnect();
          await signOut();

          signInAddressRef.current = null;
          isSigningInRef.current = false;

          throw error;
        }
      }
    },
  });

  const unwatchEVM = watchAccount(wagmiConfig, {
    onChange: debounce(async ({ address }) => {
      if (
        enabled === false ||
        isSigningInRef.current ||
        sessionStatus === "loading" ||
        !address
      ) {
        return;
      }

      if (
        session?.address === address ||
        signInAddressRef.current === address
      ) {
        // User is already signed in with the same address
        return;
      }

      unwatchEVM();
      await signInWithWeb3Async(address);
    }, 150),
  });

  // Same check as above, but for sui
  useEffect(() => {
    if (
      enabled === false ||
      isSigningInRef.current ||
      sessionStatus === "loading" ||
      !currentSuiAccount
    ) {
      return;
    }

    const address = currentSuiAccount.address as `0x${string}`;

    if (session?.address === address || signInAddressRef.current === address) {
      return;
    }

    void signInWithWeb3Async(address);
  }, [
    currentSuiAccount,
    sessionStatus,
    session?.address,
    enabled,
    signInWithWeb3Async,
  ]);

  // Same check as above, but for XRPL
  useEffect(() => {
    console.log("Currently signing in?", isSigningInRef.current);
    console.log("XRPL Wallet changed", xrplWallet, enabled, isSigningInRef.current, sessionStatus, xrplWallet?.accounts?.length);
    if (
      enabled === false ||
      isSigningInRef.current ||
      sessionStatus === "loading" ||
      !xrplWallet?.accounts?.length
    ) {
      return;
    }

    const address = xrplWallet.accounts[0].address;
    console.log("Sign in now? XRPL Address is", address);
    if (
      session?.address === address ||
      signInAddressRef.current === address
    ) {
      return;
    }
    console.log("Sign in now!");

    void signInWithWeb3Async(address);
  }, [
    xrplWallet?.accounts?.length,
    xrplConnectionStatus,
    sessionStatus,
    session?.address,
    enabled,
    signInWithWeb3Async,
  ]);

  return {
    retryAsync: signInWithWeb3Async.bind(null, signInAddressRef.current),
    retry: signInWithWeb3.bind(null, signInAddressRef.current),
    signIn: signInWithWeb3,
    signInAsync: signInWithWeb3Async,
    error: error,
    ...mutation,
  };
}
