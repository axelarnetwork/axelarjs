import { debounce, invariant } from "@axelarjs/utils";
import { useRef } from "react";
import {
  signIn,
  signOut,
  useSession,
  type SignInResponse,
} from "next-auth/react";

import { useMutation } from "@tanstack/react-query";
import { useDisconnect, useSignMessage } from "wagmi";
import { watchAccount } from "wagmi/actions";

import { trpc } from "../trpc";

export type UseWeb3SignInOptions = {
  enabled?: boolean;
  onSignInSuccess?: (response?: SignInResponse) => void;
  onSignInStart?: (address: `0x${string}`) => void;
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
  const { disconnectAsync } = useDisconnect();

  const signInAddressRef = useRef<`0x${string}` | null>(null);

  const { mutateAsync: createSignInMessage } =
    trpc.auth.createSignInMessage.useMutation();

  // avoid signing in multiple times
  const isSigningInRef = useRef(false);

  const {
    mutateAsync: signInWithWeb3Async,
    mutate: signInWithWeb3,
    error,
    ...mutation
  } = useMutation(async (address?: `0x${string}` | null) => {
    try {
      invariant(address, "Address is required");

      signInAddressRef.current = address;
      isSigningInRef.current = true;

      const { message } = await createSignInMessage({ address });

      onSignInStart?.(address);
      const signature = await signMessageAsync({ message });
      const response = await signIn("credentials", { address, signature });

      if (response?.error) {
        throw new Error(response.error);
      }

      onSignInSuccess?.(response);

      isSigningInRef.current = false;
    } catch (error) {
      if (error instanceof Error) {
        await disconnectAsync();
        await signOut();

        signInAddressRef.current = null;
        isSigningInRef.current = false;

        throw error;
      }
    }
  });

  const unwatch = watchAccount(
    debounce(({ address }) => {
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

      unwatch();
      signInWithWeb3Async(address);
    }, 150)
  );

  return {
    retryAsync: signInWithWeb3Async.bind(null, signInAddressRef.current),
    retry: signInWithWeb3.bind(null, signInAddressRef.current),
    signIn: signInWithWeb3,
    signInAsync: signInWithWeb3Async,
    error: error as Error | null,
    ...mutation,
  };
}
