import { invariant } from "@axelarjs/utils";
import { useCallback, useRef } from "react";
import { signIn, useSession, type SignInResponse } from "next-auth/react";

import { useDisconnect, useSignMessage } from "wagmi";
import { watchAccount } from "wagmi/actions";

import { trpc } from "../trpc";

export type UseWeb3SignInOptions = {
  enabled?: boolean;
  onSignInSuccess?: (response?: SignInResponse) => void;
  onSignInError?: (error: Error) => void;
  onSignInStart?: (address: `0x${string}`) => void;
};

const DEFAULT_OPTIONS: UseWeb3SignInOptions = {
  enabled: true,
  onSignInSuccess: () => {},
  onSignInError: () => {},
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
  onSignInError,
}: UseWeb3SignInOptions = DEFAULT_OPTIONS) {
  const { data: session, status: sessionStatus } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect();

  const { mutateAsync: createSignInMessage } =
    trpc.auth.createSignInMessage.useMutation();

  // avoid signing in multiple times
  const isSigningInRef = useRef(false);

  const signInWithWeb3Async = useCallback(
    async (address?: `0x${string}` | null) => {
      try {
        isSigningInRef.current = true;

        invariant(address, "Address is required");

        onSignInStart?.(address);

        const { message } = await createSignInMessage({ address });
        const signature = await signMessageAsync({ message });
        const response = await signIn("credentials", { address, signature });

        if (response?.error) {
          await disconnectAsync();
          throw new Error(response.error);
        }

        onSignInSuccess?.(response);

        isSigningInRef.current = false;
      } catch (error) {
        if (error instanceof Error) {
          onSignInError?.(error);
        }
      }
    },
    [
      createSignInMessage,
      disconnectAsync,
      onSignInError,
      onSignInStart,
      onSignInSuccess,
      signMessageAsync,
    ]
  );

  watchAccount(({ address }) => {
    if (
      enabled === false ||
      isSigningInRef.current ||
      sessionStatus === "loading" ||
      !address
    ) {
      return;
    }

    if (session?.address === address) {
      // User is already signed in with the same address
      return;
    }

    signInWithWeb3Async(address);
  });

  return {
    signInAsync: signInWithWeb3Async,
  };
}
